import { Request, Response } from 'express';
import People from '../db/models/people';
import Users from '../db/models/user';

export const register_personal_data = async (req: Request, res: Response): Promise<void> => { 
    try {
        const { name, last_name, birthdate, cellphone_number } = req.body;

        if (!name || !last_name || !birthdate || !cellphone_number) {
            res.status(400).json({ message: 'Todos los campos son obligatorios' });
            return;
        }

        const userId = (req as any).userId;

        const user = await Users.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'El usuario no existe' });
            return;
        }

        const person = await People.create({ name, last_name, birthdate, cellphone_number, userId, delivery_men: false }); 

        res.status(201).json({ message: 'Sus datos se han registrado correctamente', person });

    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}


export const register_delivery_men = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, last_name, birthdate, cellphone_number } = req.body;

        if (!name || !last_name || !birthdate || !cellphone_number) {
            res.status(400).json({ message: 'Todos los campos son obligatorios' });
            return;
        }

        const userId = (req as any).userId;

        const user = await Users.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'El usuario no existe' });
            return;
        }

        const dl_person = await People.create({ name, last_name, birthdate, cellphone_number, userId, delivery_men: true });

        res.status(201).json({ message: 'Repartidor registrado correctamente', dl_person });

    } catch (error) {
        console.error('Error registrando repartidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}