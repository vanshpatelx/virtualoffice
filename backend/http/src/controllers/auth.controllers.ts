import { Response, Request } from 'express';
import * as zod from 'zod';
import { errorHandler } from '../errorHandler/error';
import { redisClient } from '../config/redisClient';
import { RabbitMQClient } from '../config/rabbitmqClient';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { DBClient } from '../config/DBClient';
import { KafkaSingleton } from '../config/kafkaClient';
import { generateUniqueId } from '../utils/ID';

const signUpParams = zod.object({
    username: zod.string().min(1, 'Username is required').email(),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    type: zod.enum(['admin', 'user']),
});

const signInParams = zod.object({
    username: zod.string(),
    password: zod.string(),
});

const signUpScripts = `
    if redis.call("GET", KEYS[1]) then
        return "EXISTS"
    else
        redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
        return "OK"
    end
`;

/**
 * Handles user signup and adds the user to the system.
 * 
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * 
 * @returns {Promise<void>} - Returns nothing. Response is sent directly from this function.
 */
const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password, type } = signUpParams.parse(req.body);
        const id = generateUniqueId();
        const cacheKey = `user:${username}`;
        const value = JSON.stringify({ password, type });

        // eval script for checking and adding data to redis
        const result = await redisClient.eval(signUpScripts, 1, cacheKey, value, 3600000);

        if (result === 'EXISTS') {
            return errorHandler(res, 'User already exists.', 409);
        }

        await KafkaSingleton.addUser(JSON.stringify({ id, username, password, type }));

        // Generate JWT token
        const token = jwt.sign({ type, username }, config.JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({ message: 'Signup successful', token });
    } catch (error) {
        return errorHandler(res, 'SignUp Failed', 500);
    }
};

// Signin handler
const signin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = signInParams.parse(req.body);

        const cacheKey = `user:${username}`;
        const cachedUser = await redisClient.get(cacheKey);

        if (cachedUser) {
            const user = JSON.parse(cachedUser);

            if (user.password === password) {
                const token = jwt.sign({ username, type: user.type }, config.JWT_SECRET, { expiresIn: '7d' });
                return res.status(200).json({ message: 'SignIn successful', token });
            }
            return errorHandler(res, 'Invalid credentials', 401);
        }

        // Query the database if the user is not in cache
        const query = 'SELECT * FROM users WHERE username = ?';
        const users = DBClient.executeQuery(query, [username]) as any;
        if (!users || users.length === 0) {
            return errorHandler(res, 'Invalid credentials', 401);
        }
        const user = users[0];
        if (user.password !== password) {
            return errorHandler(res, 'Invalid credentials', 401);
        }

        // Cache user in Redis
        await redisClient.set(cacheKey, JSON.stringify({ id: user.id, username, password, type: user.type }));

        // Generate JWT
        const token = jwt.sign({ username, type: user.type }, config.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ message: 'SignIn successful', token });
    } catch (error) {
        return errorHandler(res, 'SignIn Failed', 500);
    }
};

export { signin, signup };
