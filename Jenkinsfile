pipeline {
    agent any
    environment {
        GCP_PROJECT = 'poc-mlff-app'
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
                    docker.build "${IMAGE_NAME}:latest", "-f ${apiDockerfile} ."
                }
            }
        }

        stage('Push Back-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-backend"
                    withCredentials([file(credentialsId: '6ce76586-2627-4c12-9175-330a8a74c6a7', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
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
                    withCredentials([file(credentialsId: '6ce76586-2627-4c12-9175-330a8a74c6a7', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud container clusters get-credentials mlff-dev-cluster-1 --zone asia-southeast2-a'
                        try{
                            sh 'kubectl delete deployments api'
                            sh 'kubectl delete services api-loadbalancer'
                        } catch (err) {
                            echo "Failed: ${err}"
                        } finally {
                            sh 'kubectl apply -f api/manifests/deployment.yaml'
                            sh 'kubectl apply -f api/manifests/service.yaml'
                        }
                    }
                }
            }
        }

        stage('Build Front-End Image') {
            steps {
                script {
                    def webDockerfile = 'fe-cadangan/Dockerfile'
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend-beta"
                    docker.build "${IMAGE_NAME}:latest", "-f ${webDockerfile} ."
                }
            }
        }

        stage('Push Front-End Image') {
            steps {
                script {
                    def IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${GCP_PROJECT}/${GCP_REPO_NAME}/garden-app-frontend-beta"
                    withCredentials([file(credentialsId: '6ce76586-2627-4c12-9175-330a8a74c6a7', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'cat "${GOOGLE_APPLICATION_CREDENTIALS}" | docker login -u _json_key --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                        sh "docker push ${IMAGE_NAME}:latest"
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