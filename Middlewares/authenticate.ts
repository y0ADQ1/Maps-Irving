import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Person from '../db/models/people'; 

interface DecodedToken {
  id: number;
  email: string;
}

export const authenticate = async (req: Request & { userId?: number; peopleId?: number }, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
        return; 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
        req.userId = decoded.id; 

        const person = await Person.findOne({ where: { userId: req.userId } });
        if (!person) {
            res.status(403).json({ message: 'Usuario no tiene datos personales registrados' });
            return;
        }

        req.peopleId = person.id; 
        next(); 
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
        return; 
    }
};