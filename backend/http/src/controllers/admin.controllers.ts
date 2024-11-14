import { Request, Response, RequestHandler } from 'express';
import * as zod from 'zod';
import { generateUniqueId } from '../utils/ID';
import { redisClient } from '../config/redisClient';
import { KafkaSingleton } from '../config/kafkaClient';
import { errorHandler } from '../errorHandler/error';
import { DBClient } from '../config/DBClient';

const addElementAdminsSchema = zod.object({
    width: zod.number(),
    height: zod.number(),
    staticElement: zod.boolean()
});

const updateElementAdminsSchema = zod.object({
    elementId: zod.number()
});

const addAvatarAdminsSchema = zod.object({
    name: zod.string()
});

const addMapAdminsSchema = zod.object({
    name: zod.string(),
    dimensions: zod.string(),
    defaultElements: zod.array(zod.object({
        elementId: zod.string(),
        x: zod.number(),
        y: zod.number()
    }))
});

const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { width, height, staticElement } = addElementAdminsSchema.parse(req.body);
        const id = generateUniqueId();
        // Gen URLs
        const url = '1234';
        const key = `element${id}`;
        await redisClient.set(key, JSON.stringify({ url, width, height, staticElement }));
        KafkaSingleton.addElementAdmin(JSON.stringify({ id, url, width, height, staticElement }));
        res.status(201).json({ message: 'Space created successfully', id });
    } catch (error) {
        return errorHandler(res, 'addElement Failed', 500);
    }
};

const updateElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { elementId } = updateElementAdminsSchema.parse(req.body);
        // Delete S3 Storage
        // Create new One
        const key = `element${elementId}`;
        const url = '1234';
        const results = await redisClient.get(key);
        if (results) {
            const updateData = JSON.parse(results);
            const { width, height, staticElement } = updateData;
            await redisClient.set(key, JSON.stringify({ url, width, height, staticElement }));
        } else {
            const query = ``;
            const updateData = await DBClient.executeQuery(query, [query, query]) as any;
            const { width, height, staticElement } = updateData;
            await redisClient.set(key, JSON.stringify({ url, width, height, staticElement }));
        }
        KafkaSingleton.updateElementAdmin(JSON.stringify({ url }));
        res.status(200).json({ message: 'Space Update successfully' });
    } catch (error) {
        return errorHandler(res, 'upadteElement Failed', 500);
    }
};

const addAvatar: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name } = addAvatarAdminsSchema.parse(req.body);
        const id = generateUniqueId();
        // Gen URLs
        const url = '1234';
        const key = `avatar${id}`;
        await redisClient.set(key, JSON.stringify({ url, name }));
        KafkaSingleton.addAvatar(JSON.stringify({ id, name, url }));
        res.status(201).json({ message: 'Avatar created successfully', id });
    } catch (error) {
        return errorHandler(res, 'addElement Failed', 500);
    }
};

const addMap: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, dimensions, defaultElements } = addMapAdminsSchema.parse(req.body);
        const dimension: number[] = dimensions.split('x').map(part => parseInt(part, 10));
        const id = generateUniqueId();
        // Gen URLs
        const url = '1234';
        const key = `map${id}`;
        await redisClient.set(key, JSON.stringify({ name, dimensions, url, defaultElements }));
        KafkaSingleton.addMap(JSON.stringify({ id, name, dimensions, url, defaultElements }));
        res.status(201).json({ message: 'Map created successfully', id });
    } catch (error) {
        return errorHandler(res, 'addElement Failed', 500);
    }
};

export { addAvatar, addElement, updateElement, addMap };
