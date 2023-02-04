pipeline {
    agent any

    environment {
        BOT_TOKEN = credentials('Telegram_BotToken')
        CHAT_ID = credentials('Telegram_ChatID')
    }

    stages {
        stage('Start') {
            steps {
                echo "Hello Jenkins!"
            }
        }
        stage('Deploy') {
            steps {
                sh 'ssh -o StrictHostKeyChecking=no vectfrar@192.64.117.185 -p 21098 "cd ~/public_html/mclinic.vectorasoft.com;\
                git fetch;\
                git checkout main;\
                git pull;\
                "'
            }
        }
        // stage('Database Migration') {
        //     steps {
        //         sh 'ssh -o StrictHostKeyChecking=no vectfrar@192.64.117.185 -p 21098 "cd ~/public_html/mclinic.vectorasoft.com;\
        //         php artisan migrate:fresh --seed;\
        //         "'
        //     }
        // }
        stage('Ending') {
            steps {
                echo "Thank you!"
            }
        }
    }
    post{
        success{
            sh '''
            sh 1-success-deploy.sh;\
            '''
        }
        failure{
            sh '''
            sh 2-fail-deploy.sh;\
            '''
        }
    }
}
