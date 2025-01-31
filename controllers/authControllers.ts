import { Request, Response } from 'express';
import Users from '../db/models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const blacklist: string[] = [];

interface UserToken {
  id: number;
  email: string;
}

const generateToken = (user: UserToken): string => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '10min' }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_name, email, password } = req.body;
    const user = await Users.create({ user_name, email, password });
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logout = (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return
  }

  try {
    if (blacklist.includes(token)) {
      res.status(400).json({ message: 'Token ya inválido' });
    }
    blacklist.push(token);
    res.status(200).json({ message: 'Logout exitoso, token destruido' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el logout', error });
  }
};
