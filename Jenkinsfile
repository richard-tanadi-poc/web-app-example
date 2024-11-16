pipeline {
    agent any
    environment {
        GCP_PROJECT = 'poc-bjb-mlff'
        REPO_LOCATION = 'asia-southeast2'
        GCP_REPO_NAME = 'test-repo-bjb-application'

    }

    stages {
        stage('Checkout') {
            steps {
               checkout scm
            }

        }

        stage('Build Back-End Image') {
            steps {
                script {
                    def apiDockerfile = 'api/Dockerfile'
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-backend"
                    docker.build "${IMAGE_NAME}:${env.BUILD_NUMBER}", "-f ${apiDockerfile} ."
                }
            }
        }

        stage('Build Front-End Image') {
            steps {
                script {
                    def webDockerfile = 'web/Dockerfile'
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend"
                    docker.build "${IMAGE_NAME}:${env.BUILD_NUMBER}", "-f ${webDockerfile} ."
                }
            }
        }

        stage('Push Back-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-backend"
                    withCredentials([file(credentialsId: '319c0a98-40b7-451e-91fb-7b206f917664', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }

        stage('Push Front-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "https://${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend"
                    docker.withRegistry("https://${REPO_LOCATION}-docker.pkg.dev") {
                        sh("gcloud auth activate-service-account --key-file=${GC_KEY}")
                        sh("gcloud container clusters get-credentials prod --zone northamerica-northeast1-a --project ${project}")
                        docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push()
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