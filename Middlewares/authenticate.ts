import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  email: string;
}

export const authenticate = (req: Request & { userId?: number }, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
        return; 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
        req.userId = decoded.id; 
        next(); 
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
        return; 
    }
};