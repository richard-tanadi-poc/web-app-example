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
                    withCredentials([file(credentialsId: '319c0a98-40b7-451e-91fb-7b206f917664', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'cat "${GOOGLE_APPLICATION_CREDENTIALS}" | docker login -u _json_key --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                        sh "docker push ${IMAGE_NAME}:latest"
                        sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'
                    }
                }
            }
        }

        // stage('Deploy Back-End to GKE') {
        //     steps{
        //         step([
        //         $class: 'KubernetesEngineBuilder',
        //         projectId: env.GCP_PROJECT,
        //         clusterName: 'mlff-dev-cluster-1',
        //         location: 'asia-southeast2-a',
        //         manifestPattern: 'api/manifests',
        //         credentialsId: env.GCP_CREDENTIALS_ID,
        //         verifyDeployments: true])
        //     }
        // }

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
                    withCredentials([file(credentialsId: '319c0a98-40b7-451e-91fb-7b206f917664', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
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