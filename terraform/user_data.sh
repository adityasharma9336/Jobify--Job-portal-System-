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

# Add Swap Space to prevent OOM during builds
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "Swap added: $(swapon --show)"

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
cat > /opt/jobify/docker-compose.yml << 'COMPOSEEOF'
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

  frontend:
    image: adityasharma9336/jobify-frontend:latest
    container_name: jobify-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - jobify-net
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

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

# Replace JWT secret placeholder
JWT_VAL="${jwt_secret}"
sed -i "s|JOBIFY_JWT_SECRET_PLACEHOLDER|$JWT_VAL|g" /opt/jobify/docker-compose.yml

# Pull backend/admin/jenkins images
echo "=== Pulling Docker images ==="
docker pull adityasharma9336/jobify-backend:latest || true
docker pull adityasharma9336/jobify-admin:latest || true
docker pull jenkins/jenkins:lts || true

# Build frontend image from GitHub source (no Docker Hub login needed)
echo "=== Building Frontend Image from GitHub ==="
git clone https://github.com/adityasharma9336/Jobify--Job-portal-System-.git /tmp/jobify-repo
docker build -t adityasharma9336/jobify-frontend:latest /tmp/jobify-repo/client
rm -rf /tmp/jobify-repo
echo "Frontend image built successfully!"

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
echo "  Frontend:      http://$EC2_IP"
echo "  Admin Panel:   http://$EC2_IP:3002"
echo "  Backend API:   http://$EC2_IP:5001/api/health"
echo "  Jenkins:       http://$EC2_IP:8080"
echo "  Prometheus:    http://$EC2_IP:9090"
echo "  Grafana:       http://$EC2_IP:3001"
date
