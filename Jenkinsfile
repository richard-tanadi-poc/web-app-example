pipeline {
    agent any
    environment {
        GCP_PROJECT = 'poc-bjb-mlff'
        REPO_LOCATION = 'asia-southeast2'
        GCP_REPO_NAME = 'mlff-poc-demo-app'
        GCP_CREDENTIALS_ID = '580f7131-c443-495c-9eec-ad1f6a40a024'
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
                    docker.build "${IMAGE_NAME}:latest", "-f ${apiDockerfile} ."
                }
            }
        }

        stage('Push Back-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-backend"
                    withCredentials([file(credentialsId: 'b121e9d7-f634-4410-8fb4-8e8b83dd327a', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'cat "${GOOGLE_APPLICATION_CREDENTIALS}" | docker login -u _json_key --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                        sh "docker push ${IMAGE_NAME}:latest"
                        sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'
                    }
                }
            }
        }

        stage('Deploy Back-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-backend"
                    withCredentials([file(credentialsId: 'b121e9d7-f634-4410-8fb4-8e8b83dd327a', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh "gcloud auth activate-service-account --keyfile=${GOOGLE_APPLICATION_CREDENTIALS}"
                        sh 'gcloud container clusters get-credentials mlff-dev-cluster-1 --zone asia-southeast2-a'
                        sh 'kubectl delete deployments api'
                        sh 'kubectl delete services api'
                        sh 'kubectl apply -f api/manifests/deployment.yaml'
                        sh 'kubectl apply -f api/manifests/service.yaml'
                    }
                }
            }
        }

        stage('Build Front-End Image') {
            steps {
                script {
                    def webDockerfile = 'web/Dockerfile'
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend"
                    docker.build "${IMAGE_NAME}:latest", "-f ${webDockerfile} ."
                }
            }
        }


        stage('Push Front-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend"
                    withCredentials([file(credentialsId: 'b121e9d7-f634-4410-8fb4-8e8b83dd327a', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'cat "${GOOGLE_APPLICATION_CREDENTIALS}" | docker login -u _json_key --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                        sh "docker push ${IMAGE_NAME}:latest"
                        sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'
                    }
                }
            }
        }

        stage('Deploy Front-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend"
                    withCredentials([file(credentialsId: 'b121e9d7-f634-4410-8fb4-8e8b83dd327a', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh "gcloud auth activate-service-account --keyfile=${GOOGLE_APPLICATION_CREDENTIALS}"
                        sh 'gcloud container clusters get-credentials mlff-dev-cluster-1 --zone asia-southeast2-a'
                        sh 'kubectl delete deployments web'
                        sh 'kubectl delete services web'
                        sh 'kubectl apply -f web/manifests/deployment.yaml'
                        sh 'kubectl apply -f web/manifests/service.yaml'
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