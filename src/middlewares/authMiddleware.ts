import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction):void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(403).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "worisecretKey");
        req.user = decoded as {id: string};
        next();
    } catch (e) {
        res.status(401).send({ error: 'Invalid token.' });
    }
};
