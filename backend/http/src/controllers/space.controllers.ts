import { Request, Response, RequestHandler } from 'express';
import * as zod from 'zod';
import { errorHandler } from '../errorHandler/error';
import { generateUniqueId } from '../utils/ID';
import { redisClient } from '../config/redisClient';
import { KafkaSingleton } from '../config/kafkaClient';

const createSpaceSchema = zod.object({
    name: zod.string(),
    dimensions: zod.array(zod.number()).length(2),
    mapId: zod.number()
});
const deleteSpaceSchema = zod.object({
    spaceId: zod.number()
});
const createSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    // image add logic here
    try {
        const { name, dimensions, mapId } = createSpaceSchema.parse(req.body);
        const [dimensions1, dimensions2] = dimensions;
        const id = generateUniqueId();
        // const userId = req.id;
        const userId = 1234;
        const key = `UserSpace${userId}${id}`;
        redisClient.set(key, JSON.stringify({ name, dimensions1, dimensions2 }));
        KafkaSingleton.addSpace(JSON.stringify({ id, userId, name, dimensions1, dimensions2, mapId }));
        res.status(201).json({ message: 'Space created successfully', spaceId: id });
    } catch (err) {
        return errorHandler(res, 'Space creation unsuccessful', 400);
    }
};

const deleteSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { spaceId } = deleteSpaceSchema.parse(req.body);
        const userId = 1234;
        const cacheKey = `UserSpace${userId}${spaceId}`;
        redisClient.del(cacheKey);
        KafkaSingleton.deleteSpace(JSON.stringify(spaceId));
        res.status(200).json({ message: 'Space deleted successfully' });
    } catch (err) {
        return errorHandler(res, 'Space delete unsuccessful', 400);
    }
};

const getAllSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    // add image logic here
    try {
        const userId = 1234;
        const cacheKey = `UserSpace${userId}`;
        const spaces = await redisClient.keys(cacheKey);
        if (spaces.length === 0) {
            return res.status(200).json({ spaces: [] });
        }
        const spaceDataList = await redisClient.mget(spaces);

        const allData = spaceDataList.map((data, index) => {
            if (data) {
                const space = JSON.parse(data);
                const id = space[index].replace(`UserSpace${userId}`, '');
                return {
                    id,
                    name: space.name,
                    dimensions: `${space.dimensions1}x${space.dimensions2}`,
                }
            }
            return null;
        }).filter(space => space !== null);
        res.status(200).json({ message: 'All spaces retrieved successfully', allData });
    } catch (err) {
        return errorHandler(res, 'Space delete unsuccessful', 400);
    }
};

export { createSpace, deleteSpace, getAllSpace };
