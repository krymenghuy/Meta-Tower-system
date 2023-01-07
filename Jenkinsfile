pipeline {
    agent any

    stages {
        stage('Start') {
            steps {
                echo "Hello Jenkins!"
            }
        }
        stage('Deployment') {
            steps {
                sh 'ssh -o StrictHostKeyChecking=no root@66.29.152.204 "cd /apps/m-clinic;\
                git fetch;\
                git checkout dev;\
                git pull;\
                "'
            }
        }
        stage('Ending') {
            steps {
                echo "Thank you!"
            }
        }
    }
    post{
        success{
            sh '''
            sh 1-success-deploy-dev.sh;\
            '''
        }
        failure{
            sh '''
            sh 2-fail-deploy-dev.sh;\
            '''
        }
    }
}
