# ─────────────────────────────────────────────────────────────────────────────
# Jobify — Terraform Infrastructure (AWS)
# Resources: EC2 (backend), S3 (frontend), CloudFront, IAM, Secrets Manager
# ─────────────────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "Jobify"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Get current AWS account ID (used for unique S3 bucket name)
data "aws_caller_identity" "current" {}

# ─── IAM Role for EC2 (allows pulling from Secrets Manager) ──────────────────
resource "aws_iam_role" "jobify_ec2_role" {
  name = "${var.app_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "jobify_secrets_policy" {
  name = "${var.app_name}-secrets-policy"
  role = aws_iam_role.jobify_ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
      Resource = aws_secretsmanager_secret.jobify_jwt.arn
    }]
  })
}

resource "aws_iam_instance_profile" "jobify_profile" {
  name = "${var.app_name}-instance-profile"
  role = aws_iam_role.jobify_ec2_role.name
}

# ─── AWS Secrets Manager — JWT Secret ────────────────────────────────────────
resource "aws_secretsmanager_secret" "jobify_jwt" {
  name                    = "${var.app_name}/jwt-secret"
  description             = "JWT signing secret for Jobify backend"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "jobify_jwt_value" {
  secret_id = aws_secretsmanager_secret.jobify_jwt.id
  secret_string = jsonencode({
    JWT_SECRET = var.jwt_secret
    MONGO_URI  = var.mongo_uri
  })
}

# ─── Security Group for Backend EC2 ──────────────────────────────────────────
resource "aws_security_group" "backend_sg" {
  name        = "${var.app_name}-backend-sg"
  description = "Allow HTTP, HTTPS, and SSH to Jobify backend"
  vpc_id      = aws_vpc.jobify_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins CI/CD (port 8080)"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins JNLP agents (port 50000)"
    from_port   = 50000
    to_port     = 50000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Admin Panel (port 3002)"
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Grafana (port 3001)"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Prometheus (port 9090)"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ─── VPC + Subnets ────────────────────────────────────────────────────────────
resource "aws_vpc" "jobify_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "${var.app_name}-vpc" }
}

resource "aws_internet_gateway" "jobify_igw" {
  vpc_id = aws_vpc.jobify_vpc.id
  tags   = { Name = "${var.app_name}-igw" }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.jobify_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.app_name}-subnet-a" }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.jobify_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.jobify_igw.id
  }
  tags = { Name = "${var.app_name}-public-rt" }
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public_rt.id
}

# ─── EC2 Instance — Backend ───────────────────────────────────────────────────
resource "aws_instance" "jobify_backend" {
  ami                    = var.ami_id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.jobify_profile.name
  key_name               = var.key_pair_name

  user_data = <<-EOF
    #!/bin/bash
    set -e
    exec > /var/log/jobify-setup.log 2>&1

    echo "=== Jobify AWS Setup Starting ==="
    date

    # Update system packages
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg lsb-release git python3 awscli

    # Install Docker (official method)
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Start Docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ubuntu

    echo "Docker installed: $(docker --version)"
    echo "Docker Compose installed: $(docker compose version)"

    # Create app directory
    mkdir -p /opt/jobify
    cd /opt/jobify

    # Create prometheus config
    mkdir -p prometheus grafana/provisioning/datasources grafana/provisioning/dashboards

    cat > prometheus/prometheus.yml << 'PROMEOF'
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'jobify-backend'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['backend:5000']
PROMEOF

    cat > grafana/provisioning/datasources/prometheus.yml << 'GRAFEOF'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
GRAFEOF

    # Write Docker Compose file
    cat > docker-compose.yml << 'COMPOSEEOF'
name: jobify
services:
  mongodb:
    image: mongo:7.0
    container_name: jobify-mongo
    restart: unless-stopped
    volumes:
      - mongodb_data:/data/db
    networks:
      - jobify-net
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s

  backend:
    image: adityasharma9336/jobify-backend:latest
    container_name: jobify-backend
    restart: unless-stopped
    ports:
      - "5001:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/jobify
      - JWT_SECRET=JOBIFY_JWT_SECRET_PLACEHOLDER
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - jobify-net
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  jenkins:
    image: jenkins/jenkins:lts
    container_name: jobify-jenkins
    restart: unless-stopped
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - jobify-net

  admin:
    image: adityasharma9336/jobify-admin:latest
    container_name: jobify-admin
    restart: unless-stopped
    ports:
      - "3002:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - jobify-net

  prometheus:
    image: prom/prometheus:latest
    container_name: jobify-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - /opt/jobify/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    networks:
      - jobify-net

  grafana:
    image: grafana/grafana:latest
    container_name: jobify-grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_PATHS_PROVISIONING=/etc/grafana/provisioning
    volumes:
      - grafana_data:/var/lib/grafana
      - /opt/jobify/grafana/provisioning:/etc/grafana/provisioning:ro
    networks:
      - jobify-net

networks:
  jobify-net:
    driver: bridge

volumes:
  mongodb_data:
  prometheus_data:
  grafana_data:
  jenkins_home:
COMPOSEEOF

    # Fetch JWT secret from Secrets Manager and update compose file
    SECRET=$(aws secretsmanager get-secret-value \
      --secret-id ${var.app_name}/jwt-secret \
      --region ${var.aws_region} \
      --query SecretString \
      --output text 2>/dev/null || echo '{"JWT_SECRET":"${var.jwt_secret}"}')

    JWT_VAL=$(echo $SECRET | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('JWT_SECRET','jobify_secret'))" 2>/dev/null || echo "${var.jwt_secret}")
    sed -i "s|JOBIFY_JWT_SECRET_PLACEHOLDER|$JWT_VAL|g" /opt/jobify/docker-compose.yml

    # Pull all images (no frontend — served from S3)
    echo "=== Pulling Docker images ==="
    docker pull adityasharma9336/jobify-backend:latest || true
    docker pull adityasharma9336/jobify-admin:latest || true
    docker pull jenkins/jenkins:lts || true

    # Install AWS CLI v2 for Jenkins S3 deployments
    apt-get install -y unzip
    curl -fsSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip
    unzip -q awscliv2.zip && ./aws/install && rm -rf awscliv2.zip aws/
    echo "AWS CLI: $(aws --version)"

    # Install Node.js 20 for Jenkins frontend builds
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "Node.js: $(node --version)" && echo "npm: $(npm --version)"

    # Start the full stack
    echo "=== Starting Jobify stack ==="
    docker compose -f /opt/jobify/docker-compose.yml up -d

    # Create systemd service for auto-restart on reboot
    cat > /etc/systemd/system/jobify.service << 'SVCEOF'
[Unit]
Description=Jobify Docker Compose Stack
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/jobify
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
SVCEOF

    systemctl daemon-reload
    systemctl enable jobify

    echo "=== Jobify setup complete ==="
    EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    echo "Services:"
    echo "  Jenkins CI/CD: http://$EC2_IP:8080"
    echo "  Admin Panel:   http://$EC2_IP:3002"
    echo "  Backend API:   http://$EC2_IP:5001/api/health"
    echo "  Prometheus:    http://$EC2_IP:9090"
    echo "  Grafana:       http://$EC2_IP:3001"
    echo "  Frontend CDN:  https://don74iy6n0j9s.cloudfront.net"
    echo "  Frontend S3:   http://${var.app_name}-frontend-${var.environment}-${data.aws_caller_identity.current.account_id}.s3-website.${var.aws_region}.amazonaws.com"
    date

    # Print Jenkins initial admin password location
    echo "=== Jenkins Initial Setup ==="
    echo "Jenkins password will be at: /var/jenkins_home/secrets/initialAdminPassword"
    echo "Run: docker exec jobify-jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
  EOF

  tags = { Name = "${var.app_name}-backend-ec2" }
}

# ─── S3 Bucket — Frontend ─────────────────────────────────────────────────────
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.app_name}-frontend-${var.environment}-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document { suffix = "index.html" }
  error_document { key = "index.html" } # SPA fallback
}

resource "aws_s3_bucket_policy" "frontend_public_read" {
  bucket = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.frontend.arn}/*"
    }]
  })
}

# ─── CloudFront Distribution ──────────────────────────────────────────────────
resource "aws_cloudfront_distribution" "frontend_cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Jobify Frontend CDN"

  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend.website_endpoint
    origin_id   = "S3-${var.app_name}-frontend"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.app_name}-frontend"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized (AWS Managed)
  }

  # SPA routing — serve index.html for 404s
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Name = "${var.app_name}-cloudfront" }
}