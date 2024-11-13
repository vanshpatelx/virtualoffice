import { Request, Response, RequestHandler } from 'express';

const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(201).json({ message: 'Space created successfully' });
};

const updateElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'Space deleted successfully' });
};

const addAvatar: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

const addMap: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

export { addAvatar, addElement, updateElement, addMap };
