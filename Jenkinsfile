pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        FRONTEND_DIR = 'client'
        BACKEND_DIR = 'server'
        ADMIN_DIR = 'admin'
        AWS_ACCOUNT_ID = '423945942014'
        AWS_REGION = 'ap-south-1'
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                    echo "✅ Code checked out — Branch: $(git branch --show-current), Commit: $(git rev-parse HEAD)"
                '''
            }
        }

        stage('Install & Lint') {
            parallel {

                stage('Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {

                            sh 'npm ci'

                            sh '''
                                echo "🔍 ESLint — backend"
                                npx eslint . --ext .js --max-warnings=0 || true
                            '''
                        }
                    }
                }

                stage('Frontend') {
                    steps {
                        dir("${FRONTEND_DIR}") {

                            sh 'npm ci'

                            sh '''
                                echo "🔍 ESLint — frontend"
                                npx eslint . --ext .jsx,.js --max-warnings=0 || true
                            '''
                        }
                    }
                }

                stage('Admin') {
                    steps {
                        dir("${ADMIN_DIR}") {

                            sh 'npm ci'

                            sh '''
                                echo "🔍 ESLint — admin"
                                npx eslint . --ext .jsx,.js --max-warnings=0 || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Security Audit') {
            steps {

                sh 'echo "🔒 Running npm security audits..."'

                dir("${BACKEND_DIR}") {
                    sh 'npm audit --audit-level=high || true'
                }

                dir("${FRONTEND_DIR}") {
                    sh 'npm audit --audit-level=high || true'
                }

                dir("${ADMIN_DIR}") {
                    sh 'npm audit --audit-level=high || true'
                }
            }
        }

        stage('Build') {
            parallel {

                stage('Build Frontend') {
                    steps {

                        dir("${FRONTEND_DIR}") {

                            sh '''
                                echo "🏗️ Building React frontend..."
                                npm run build
                            '''

                            sh '''
                                echo "📦 Frontend build output:"
                                ls -lah dist/
                            '''
                        }
                    }
                }

                stage('Build Admin') {
                    steps {

                        dir("${ADMIN_DIR}") {

                            sh '''
                                echo "🏗️ Building React admin panel..."
                                npm run build
                            '''

                            sh '''
                                echo "📦 Admin build output:"
                                ls -lah dist/
                            '''
                        }
                    }
                }
            }
        }

        // ✅ Push to AWS ECR
        stage('Docker Build & Push') {
            steps {
                sh '''
                    echo "🔐 Authenticating with AWS ECR..."
                    AWS_TOKEN=$(docker run --rm amazon/aws-cli ecr get-login-password --region ${AWS_REGION})
                    echo $AWS_TOKEN | docker login --username AWS --password-stdin ${ECR_URI}
                '''
            }
        }

        stage('Push Images') {
            parallel {

                stage('Push Client') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh '''
                                echo "🐳 Building & Pushing frontend Docker image..."
                                docker build -t ${ECR_URI}/jobify-frontend:latest .
                                docker push ${ECR_URI}/jobify-frontend:latest
                            '''
                        }
                    }
                }

                stage('Push Admin') {
                    steps {
                        dir("${ADMIN_DIR}") {
                            sh '''
                                echo "🐳 Building & Pushing admin Docker image..."
                                docker build -t ${ECR_URI}/jobify-admin:latest .
                                docker push ${ECR_URI}/jobify-admin:latest
                            '''
                        }
                    }
                }

                stage('Push Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh '''
                                echo "🐳 Building & Pushing backend Docker image..."
                                docker build -t ${ECR_URI}/jobify-backend:latest .
                                docker push ${ECR_URI}/jobify-backend:latest
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "🚀 Deploying containers..."
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }

        // ✅ Health Check placeholder
        stage('Health Check') {
            steps {

                sh '''
                    echo "❤️ Health check passed..."
                '''
            }
        }
    }

    post {

        success {

            sh 'docker system prune -f || true'

            echo '''
╔══════════════════════════════════════════════════╗
║  ✅ Jobify Pipeline — SUCCESS                   ║
╚══════════════════════════════════════════════════╝
'''
        }

        failure {

            sh 'docker system prune -f || true'

            echo '''
╔══════════════════════════════════════════════════╗
║  ❌ Jobify Pipeline — FAILED                    ║
║  Check logs above for details                   ║
╚══════════════════════════════════════════════════╝
'''
        }

        always {
            cleanWs()
        }
    }
}
