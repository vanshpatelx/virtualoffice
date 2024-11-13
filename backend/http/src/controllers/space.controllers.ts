import { Request, Response, RequestHandler } from 'express';

const createSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(201).json({ message: 'Space created successfully' });
};

const deleteSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'Space deleted successfully' });
};

const getAllSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

export { createSpace, deleteSpace, getAllSpace };
