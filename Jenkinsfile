pipeline {
    agent any
     environment {
        IMAGE_NAME = "nourayari/devops-tp-node" 
    }
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build / Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Static Analysis - SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        // ====== EXERCICE 2 ======

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Image Scanning (Trivy)') {
            steps {
               
               sh "trivy image --exit-code 0 ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                }
            }
    }
    stage('Infrastructure Provisioning - Terraform') {
    steps {
        dir('terraform') {
            sh 'terraform init'
            sh 'terraform apply -auto-approve'
        }
    }
}

stage('Configuration & Deploy - Ansible/Kubernetes') {
    steps {
        sh "ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --extra-vars image_tag=${BUILD_NUMBER}"
    }
}

stage('Smoke Test') {
    steps {
        sh '''
        sleep 10
        curl -f http://host.docker.internal:30080/health
        '''
    }
}
    }
}