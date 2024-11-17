pipeline {
    agent any
    environment {
        GCP_PROJECT = 'poc-bjb-mlff'
        REPO_LOCATION = 'asia-southeast2'
        GCP_REPO_NAME = 'mlff-poc-demo-app'

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
                        sh 'cat "${GOOGLE_APPLICATION_CREDENTIALS}" | docker login -u _json_key --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                        sh "docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                        sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'
                    }
                }
            }
        }

        stage('Push Front-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend"
                    withCredentials([file(credentialsId: '319c0a98-40b7-451e-91fb-7b206f917664', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'cat "${GOOGLE_APPLICATION_CREDENTIALS}" | docker login -u _json_key --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                        sh "docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                        sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'
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