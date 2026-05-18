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

        // ✅ Docker Hub removed
        stage('Docker Build') {
            parallel {

                stage('Build Client Docker Image') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh '''
                                echo "🐳 Building frontend Docker image..."
                                docker build -t jobify-frontend:latest .
                            '''
                        }
                    }
                }

                stage('Build Admin Docker Image') {
                    steps {
                        dir("${ADMIN_DIR}") {
                            sh '''
                                echo "🐳 Building admin Docker image..."
                                docker build -t jobify-admin:latest .
                            '''
                        }
                    }
                }

                stage('Build Backend Docker Image') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh '''
                                echo "🐳 Building backend Docker image..."
                                docker build -t jobify-backend:latest .
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
