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

  user_data = templatefile("${path.module}/user_data.sh", {
    jwt_secret = var.jwt_secret
    aws_region = var.aws_region
    app_name   = var.app_name
  })

  tags = { Name = "${var.app_name}-backend-ec2" }
}

# ─── Elastic IP Association ───────────────────────────────────────────────────
resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.jobify_backend.id
  allocation_id = "eipalloc-03788a512da95a30e"
}

