pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nour-ayari/devops-tp-node.git'
            }
        }

        stage('Build / Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Static Analysis - SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner'
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
    }
}