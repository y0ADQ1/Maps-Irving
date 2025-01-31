import { Request, Response } from 'express';
import Menu from '../db/models/menu';

interface CartItem {
    productId: number;
    product_name: string;
    price: number;
    quantity: number;
}

let cart: CartItem[] = [];

export const showMenu = async (res: Response): Promise<void> => {
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

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId, quantity } = req.body;

        const product = await Menu.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: product.id,
                product_name: product.product_name,
                price: product.price,
                quantity: quantity
            });
        }

        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito' });
    }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;

        const itemIndex = cart.findIndex(item => item.productId === parseInt(productId));
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            return;
        }

        cart.splice(itemIndex, 1);

        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar producto del carrito' });
    }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({ cart, total });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        cart = []; 
        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ message: 'Error al vaciar el carrito' });
    }
};
