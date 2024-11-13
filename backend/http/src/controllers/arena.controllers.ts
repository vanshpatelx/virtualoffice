import { Request, Response, RequestHandler } from 'express';
import * as zod from 'zod';
import { errorHandler } from '../errorHandler/error';

const getSpecificSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {

    res.status(201).json({ message: 'Space created successfully' });
};

const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try{
        // ZOD
        // cache space id in Cache
            // or got for DB search
        // add Elements in Cache
        // Kafka DataSend
        // WSMager Inform to main server
        res.status(200).json({ message: 'successfully' });
    }catch(err){
        return errorHandler(res, 'add element unscuse');;
    }
};

const deleteElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

const getAllElements: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

export { getAllElements, addElement, getSpecificSpace, deleteElement };
