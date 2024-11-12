import { Response, Request } from 'express';
import * as zod from 'zod';
import { errorHandler } from '../errorHandler/error';
import { redisClient } from '../config/redisClient';
import { RabbitMQClient } from '../config/rabbitmqClient';
// import jwt from 'jsonwebtoken';
// import { config } from '../config/config';
// import { Db } from '../config/DBClient';

const signUpParams = zod.object({
    username: zod.string().min(1, 'Username is required'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    type: zod.enum(['admin', 'user']),
});
// const signInParams = z.object({
//     username: z.string(),
//     password: z.string(),
// });

const signUpScripts = `
    if redis.call("GET", KEYS[1]) then
        return "EXISTS"
    else
        redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
        return "OK"
    end
`;

// Signup handler
const signup = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { username, password, type } = signUpParams.parse(req.body);

        // Cache key to store user data
        const cacheKey = `user:${username}`;
        const value = JSON.stringify({ password, type });

        // Evaluate the Lua script in Redis to check user existence
        const result = await redisClient.eval(signUpScripts, 1, cacheKey, value, 3600000);

        if (result === 'EXISTS') {
            return errorHandler(res, 'User already exists.', 409);
        }

        // Send signup data to RabbitMQ
        // const id = 1;  // Ideally, generate a unique ID (e.g., using UUID)
        // RabbitMQClient.sendSignUpDataToQueue({ id, username, password, type });

        // Generate JWT token
        // const token = jwt.sign({ id, username, type }, config.JWT_SECRET, { expiresIn: '7d' });

        // return res.status(201).json({ message: 'Signup successful', token });
        return res.status(201).json({ message: 'Signup successful'});
    } catch (error) {
        return errorHandler(res, 'SignUp Failed');
    }
};

// // Signin handler
// const signin = async (req: Request, res: Response) => {
//     try {
//         const { username, password } = signInParams.parse(req.body);

//         // Cache key to retrieve user data
//         const cacheKey = `user:${username}`;
//         const cachedUser = await redisClient.get(cacheKey);

//         if (cachedUser) {
//             const user = JSON.parse(cachedUser);

//             if (user.password === password) {
//                 const token = jwt.sign({ username, type: user.type }, config.JWT_SECRET, { expiresIn: '7d' });
//                 return res.status(200).json({ message: 'SignIn successful', token });
//             }
//             return errorHandler(res, 'Invalid credentials', 401);
//         }

//         // Query the database if the user is not in cache
//         const query = `SELECT * FROM DB WHERE userID = ${username}`;
//         const user = await Db(query);

//         if (!user || user.password !== password) {
//             return errorHandler(res, 'Invalid credentials', 401);
//         }

//         // Generate JWT token after successful authentication
//         const token = jwt.sign({ username, type: user.type }, config.JWT_SECRET, { expiresIn: '7d' });
//         return res.status(200).json({ message: 'SignIn successful', token });
//     } catch (error) {
//         return errorHandler(res, 'SignIn Failed');
//     }
// };

// export { signin, signup };
export { signup };

