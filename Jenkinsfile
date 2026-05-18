pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'your-dockerhub-username'
        APP_NAME_BACKEND = 'jobify-backend'
        APP_NAME_FRONTEND = 'jobify-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test Backend') {
            steps {
                dir('server') {
                    sh 'npm install'
                    // sh 'npm test' // Uncomment if you have tests
                }
            }
        }

        stage('Build & Test Frontend') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials-id') {
                        def backendImage = docker.build("${DOCKER_HUB_USER}/${APP_NAME_BACKEND}:${env.BUILD_NUMBER}")
                        backendImage.push()
                        backendImage.push("latest")

                        def frontendImage = docker.build("${DOCKER_HUB_USER}/${APP_NAME_FRONTEND}:${env.BUILD_NUMBER}")
                        frontendImage.push()
                        frontendImage.push("latest")
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
