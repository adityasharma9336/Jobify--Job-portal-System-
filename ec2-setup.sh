#!/bin/bash
set -e
echo "=== [1/6] Installing Docker ==="
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release python3 unzip git

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker && systemctl start docker
usermod -aG docker ubuntu
echo "Docker: $(docker --version)"
echo "Compose: $(docker compose version)"

echo "=== [2/6] Creating directories ==="
mkdir -p /opt/jobify/prometheus
mkdir -p /opt/jobify/grafana/provisioning/datasources

echo "=== [3/6] Writing configs ==="
cat > /opt/jobify/prometheus/prometheus.yml << 'PROMEOF'
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

cat > /opt/jobify/grafana/provisioning/datasources/prometheus.yml << 'GRAFEOF'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
GRAFEOF

echo "=== [4/6] Writing Docker Compose ==="
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
      - JWT_SECRET=jobify_jwt_super_secret_2026
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

  jenkins:
    image: jenkins/jenkins:lts
    container_name: jobify-jenkins
    restart: unless-stopped
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=true
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
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

echo "=== [5/6] Pulling Docker images ==="
cd /opt/jobify
docker compose pull

echo "=== [6/6] Starting all services ==="
docker compose up -d

echo ""
echo "=== Container Status ==="
docker compose ps

echo ""
echo "=== Setup complete at $(date) ==="
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "15.207.85.136")
echo "Jenkins:    http://$EC2_IP:8080"
echo "Admin:      http://$EC2_IP:3002"
echo "Backend:    http://$EC2_IP:5001/api/health"
echo "Prometheus: http://$EC2_IP:9090"
echo "Grafana:    http://$EC2_IP:3001"
echo ""
echo "Jenkins password: $(docker exec jobify-jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo 'still starting...')"
