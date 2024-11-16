pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script{
                    echo 'Checkout from Github'
                    git branch: 'main', url: 'https://github.com/richard-tanadi-poc/web-app-example.git'
                    env.BUILD_NUMBER = 1
                    echo gitVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT
                    }
            }
        }

        stage('Build API Image') {
            steps {
                script {
                    def apiDockerfile = 'api/Dockerfile'
                    docker.build "myproject/api:${env.BUILD_NUMBER}", "-f ${apiDockerfile}"
                }
            }
        }

        stage('Build Web Image') {
            steps {
                script {
                    def webDockerfile = 'web/Dockerfile'
                    docker.build "myproject/web:${env.BUILD_NUMBER}", "-f ${webDockerfile}"
                }
            }
        }

        stage('Push API Image') {
            steps {
                script {
                    docker.withRegistry('https://your-docker-registry.com', 'dockerhub-credentials') {
                        docker.image("myproject/api:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }

        stage('Push Web Image') {
            steps {
                script {
                    docker.withRegistry('https://your-docker-registry.com', 'dockerhub-credentials') {
                        docker.image("myproject/web:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}