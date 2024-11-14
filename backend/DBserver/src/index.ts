import express, { Express, Request, Response } from 'express'
import { redisClient } from './consumer/redisClient';
import { KafkaConsumer } from './consumer/kafkaClient';

const app: Express = express();
const PORT = process.env.PORT || 3003;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/check', (req: Request, res: Response) => {
    res.json("Running");
});

Promise.all([
    redisClient.ping().then(() => console.log('Redis connected')),
    KafkaConsumer.connect()
])
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize services:', err);
        process.exit(1);
    });
