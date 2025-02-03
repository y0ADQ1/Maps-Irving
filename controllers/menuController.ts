import { Request, Response } from 'express';
import Menu from '../db/models/menu';

interface CartItem {
    productId: number;
    product_name: string;
    price: number;
    quantity: number;
}

let userCarts: { [userId: number]: CartItem[] } = {};

export const showMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuItems = await Menu.findAll({
            attributes: ['product_name', 'description', 'price']
        });

        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error al obtener el menú:', error);
        res.status(500).json({ message: 'Error al obtener el menú' });
    }
};

export const addToCart = async (req: Request & { userId?: number }, res: Response): Promise<void> => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        const product = await Menu.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        if (!userCarts[userId]) {
            userCarts[userId] = [];
        }

        const existingItem = userCarts[userId].find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            userCarts[userId].push({
                productId: product.id,
                product_name: product.product_name,
                price: product.price,
                quantity: quantity
            });
        }

        res.status(200).json({ message: 'Producto agregado al carrito', cart: userCarts[userId] });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito' });
    }
};

export const removeFromCart = async (req: Request & { userId?: number }, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        if (!userCarts[userId]) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        const itemIndex = userCarts[userId].findIndex(item => item.productId === parseInt(productId));
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            return;
        }

        userCarts[userId].splice(itemIndex, 1);

        res.status(200).json({ message: 'Producto eliminado del carrito', cart: userCarts[userId] });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar producto del carrito' });
    }
};

export const getCart = async (req: Request & { userId?: number }, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        if (!userCarts[userId]) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        const total = userCarts[userId].reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({ cart: userCarts[userId], total });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

export const clearCart = async (req: Request & { userId?: number }, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        if (!userCarts[userId]) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        userCarts[userId] = [];
        res.status(200).json({ message: 'Carrito vaciado', cart: userCarts[userId] });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ message: 'Error al vaciar el carrito' });
    }
};