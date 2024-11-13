import { Request, Response, RequestHandler } from 'express';

const getSpecificSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(201).json({ message: 'Space created successfully' });
};

const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'Space deleted successfully' });
};

const deleteElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

const getAllElements: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({ message: 'All spaces retrieved successfully' });
};

export { getAllElements, addElement, getSpecificSpace, deleteElement };
