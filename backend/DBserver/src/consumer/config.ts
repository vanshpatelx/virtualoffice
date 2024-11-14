export const config = {
    redis : {
        host : process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: Number(process.env.REDIS_DB) || 0,
    },
    
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost', 
        signupQueue: process.env.RABBITMQ_QUEUE || 'user_signup_queue',
        signinQueue: 'user_signin_queue'
    },
    JWT_SECRET : '1234455',
    kafka: {
        url1: process.env.KAFKA || 'amqp://localhost', 
        url2: process.env.KAFKA || 'amqp://localhost', 
    },
    DB : {
        user : process.env.user || 'user',
        host : process.env.host || 'host',
        database : process.env.database || 'database',
        password : process.env.password || 'password',
        port: process.env.DB_PORT || 5432,
        
    }
};