pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh 'ssh -o StrictHostKeyChecking=no root@66.29.152.204 "cd /apps/m-clinic;\
                git fetch;\
                git checkout dev;\
                git pull;\
                "'
            }
        }
    }
}
