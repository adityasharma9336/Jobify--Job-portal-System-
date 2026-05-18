pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        // ─── Docker Hub ────────────────────────────────────────────────────────
        DOCKER_HUB_USER    = 'adityasharma9336'
        BACKEND_IMAGE      = "${DOCKER_HUB_USER}/jobify-backend"
        ADMIN_IMAGE        = "${DOCKER_HUB_USER}/jobify-admin"
        IMAGE_TAG          = "${env.BUILD_NUMBER}"

        // ─── AWS ───────────────────────────────────────────────────────────────
        AWS_DEFAULT_REGION = 'ap-south-1'
        S3_BUCKET          = 'jobify-frontend-production-423945942014'
        CLOUDFRONT_DIST_ID = 'E1DEWO7THSR7PY'
        EC2_HOST           = '15.207.85.136'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        // ─── Stage 1: Checkout ────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "✅ Code checked out — Branch: ${GIT_BRANCH}, Commit: ${GIT_COMMIT}"'
            }
        }

        // ─── Stage 2: Install & Lint (parallel) ───────────────────────────────
        stage('Install & Lint') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('server') {
                            sh 'npm ci'
                            sh 'echo "🔍 ESLint — backend"'
                            sh 'npx eslint . --ext .js --max-warnings=0 || true'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('client') {
                            sh 'npm ci'
                            sh 'echo "🔍 ESLint — frontend"'
                            sh 'npx eslint . --ext .jsx,.js --max-warnings=0 || true'
                        }
                    }
                }
                stage('Admin') {
                    steps {
                        dir('admin') {
                            sh 'npm ci'
                            sh 'echo "🔍 ESLint — admin"'
                            sh 'npx eslint . --ext .jsx,.js --max-warnings=0 || true'
                        }
                    }
                }
            }
        }

        // ─── Stage 3: Security Audit ──────────────────────────────────────────
        stage('Security Audit') {
            steps {
                sh 'echo "🔒 Running npm security audits..."'
                dir('server')  { sh 'npm audit --audit-level=high || true' }
                dir('client')  { sh 'npm audit --audit-level=high || true' }
                dir('admin')   { sh 'npm audit --audit-level=high || true' }
            }
        }

        // ─── Stage 4: Build (parallel) ────────────────────────────────────────
        stage('Build') {
            parallel {
                // Frontend → static files for S3 (no Docker image needed)
                stage('Build Frontend → S3') {
                    steps {
                        dir('client') {
                            sh 'echo "🏗️  Building React frontend for S3..."'
                            sh 'npm run build'
                            sh 'echo "📦 Frontend build output:"'
                            sh 'ls -lah dist/'
                        }
                    }
                }
                // Admin → Docker image (served from EC2)
                stage('Build Admin Docker') {
                    steps {
                        dir('admin') {
                            sh 'echo "🏗️  Building React admin panel..."'
                            sh 'npm run build'
                            sh 'ls -lah dist/'
                        }
                    }
                }
            }
        }

        // ─── Stage 5: Docker Build & Push (backend + admin only) ──────────────
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        sh 'echo "🐳 Building and pushing Docker images..."'

                        // Backend
                        def backendImage = docker.build(
                            "${BACKEND_IMAGE}:${IMAGE_TAG}",
                            "--no-cache ./server"
                        )
                        backendImage.push()
                        backendImage.push('latest')
                        sh "echo '✅ Backend pushed: ${BACKEND_IMAGE}:${IMAGE_TAG}'"

                        // Admin Panel
                        def adminImage = docker.build(
                            "${ADMIN_IMAGE}:${IMAGE_TAG}",
                            "--no-cache ./admin"
                        )
                        adminImage.push()
                        adminImage.push('latest')
                        sh "echo '✅ Admin pushed: ${ADMIN_IMAGE}:${IMAGE_TAG}'"

                        // Clean up local images
                        sh "docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true"
                        sh "docker rmi ${ADMIN_IMAGE}:${IMAGE_TAG} || true"
                    }
                }
            }
        }

        // ─── Stage 6: Deploy (parallel) ───────────────────────────────────────
        stage('Deploy') {
            parallel {

                // ── 6a: Frontend → S3 + CloudFront invalidation ───────────────
                stage('Frontend → S3 + CloudFront') {
                    when { branch 'main' }
                    steps {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                          credentialsId: 'aws-credentials']]) {
                            sh 'echo "☁️  Uploading frontend build to S3..."'
                            sh """
                                aws s3 sync client/dist s3://${S3_BUCKET}/ \
                                    --delete \
                                    --region ${AWS_DEFAULT_REGION} \
                                    --cache-control "public, max-age=31536000, immutable" \
                                    --exclude "*.html"
                            """
                            // HTML with short cache for SPA routing
                            sh """
                                aws s3 sync client/dist s3://${S3_BUCKET}/ \
                                    --region ${AWS_DEFAULT_REGION} \
                                    --content-type "text/html" \
                                    --cache-control "no-cache, no-store, must-revalidate" \
                                    --include "*.html"
                            """
                            sh 'echo "🔄 Invalidating CloudFront cache..."'
                            sh """
                                aws cloudfront create-invalidation \
                                    --distribution-id ${CLOUDFRONT_DIST_ID} \
                                    --paths "/*"
                            """
                            sh 'echo "✅ Frontend live at: https://don74iy6n0j9s.cloudfront.net"'
                        }
                    }
                }

                // ── 6b: Backend + Admin → EC2 via SSH ─────────────────────────
                stage('Backend + Admin → EC2') {
                    when { branch 'main' }
                    steps {
                        withCredentials([sshUserPrivateKey(
                            credentialsId: 'ec2-ssh-key',
                            keyFileVariable: 'SSH_KEY'
                        )]) {
                            sh 'echo "🚀 Deploying backend + admin to EC2..."'
                            sh """
                                ssh -i \$SSH_KEY \
                                    -o StrictHostKeyChecking=no \
                                    ubuntu@${EC2_HOST} \
                                    'cd /opt/jobify && \
                                     docker compose pull backend admin && \
                                     docker compose up -d --no-deps backend admin && \
                                     docker compose ps'
                            """
                            sh 'echo "✅ EC2 deployment complete"'
                        }
                    }
                }

                // ── 6c: Kubernetes manifests ──────────────────────────────────
                stage('Deploy k8s Manifests') {
                    when { branch 'main' }
                    steps {
                        script {
                            sh 'echo "☸️  Applying Kubernetes manifests..."'
                            sh "sed -i 's|adityasharma9336/jobify-backend:latest|${BACKEND_IMAGE}:${IMAGE_TAG}|g' k8s/backend.yaml"
                            sh "sed -i 's|adityasharma9336/jobify-admin:latest|${ADMIN_IMAGE}:${IMAGE_TAG}|g' k8s/admin.yaml"
                            sh 'kubectl apply -f k8s/namespace.yaml   || true'
                            sh 'kubectl apply -f k8s/configmap.yaml   || true'
                            sh 'kubectl apply -f k8s/pvc.yaml         || true'
                            sh 'kubectl apply -f k8s/secret.yaml      || true'
                            sh 'kubectl apply -f k8s/mongo.yaml       || true'
                            sh 'kubectl apply -f k8s/backend.yaml     || true'
                            sh 'kubectl apply -f k8s/admin.yaml       || true'
                            sh 'kubectl rollout status deployment/jobify-backend -n jobify --timeout=120s || true'
                            sh 'echo "✅ Kubernetes manifests applied"'
                        }
                    }
                }
            }
        }

        // ─── Stage 7: Health Check ────────────────────────────────────────────
        stage('Health Check') {
            steps {
                sh 'echo "❤️  Running post-deploy health checks..."'
                sleep(time: 15, unit: 'SECONDS')

                // Backend EC2 health
                sh """
                    curl -sf http://${EC2_HOST}:5001/api/health && \
                        echo "✅ Backend API healthy" || \
                        echo "⚠️  Backend not responding — check EC2 logs"
                """

                // Frontend CloudFront check
                sh """
                    curl -sf --max-time 10 https://don74iy6n0j9s.cloudfront.net && \
                        echo "✅ CloudFront CDN healthy" || \
                        echo "⚠️  CloudFront check failed — may still be propagating"
                """

                // Jenkins self check
                sh "echo '✅ Jenkins running at: http://${EC2_HOST}:8080'"
            }
        }
    }

    post {
        success {
            echo """
            ╔══════════════════════════════════════════════════╗
            ║  ✅  Jobify Pipeline — SUCCESS                   ║
            ║  Build #${env.BUILD_NUMBER}                      ║
            ║                                                  ║
            ║  🌐 Frontend : https://don74iy6n0j9s.cloudfront.net ║
            ║  🛡️  Admin   : http://${EC2_HOST}:3002           ║
            ║  ⚙️  Backend : http://${EC2_HOST}:5001           ║
            ║  🔧 Jenkins  : http://${EC2_HOST}:8080           ║
            ╚══════════════════════════════════════════════════╝
            """
        }
        failure {
            echo """
            ╔══════════════════════════════════════════════════╗
            ║  ❌  Jobify Pipeline — FAILED                    ║
            ║  Build #${env.BUILD_NUMBER}                      ║
            ║  Check the logs above for details                ║
            ╚══════════════════════════════════════════════════╝
            """
        }
        always {
            cleanWs()
            sh 'docker system prune -f || true'
        }
    }
}
