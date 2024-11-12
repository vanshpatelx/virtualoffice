import express, { Express, Request, Response } from 'express'
import adminRoutes from './routes/admin.routes';
import arenaRoutes from './routes/arena.routes';
import authRoutes from './routes/auth.routes';
import spaceRoutes from './routes/space.routes';
import { redisClient } from './config/redisClient';
import { RabbitMQClient } from './config/rabbitmqClient';

const app: Express = express();
const PORT = process.env.PORT || 3003;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/arena', arenaRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/space', spaceRoutes);

app.get('/check', (req: Request, res: Response) => {
    res.json(`Running`);
});

// Promise.all([
//     redisClient.ping().then(() => console.log('Redis connected')),
//     RabbitMQClient.getChannel().then(() => console.log('RabbitMQ channel ready')),
// ])
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server is running on: ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error('Failed to initialize services:', err);
//         process.exit(1);
//     });

Promise.all([
    redisClient.ping().then(() => console.log('Redis connected')),
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
