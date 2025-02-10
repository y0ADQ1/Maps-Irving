import { Request, Response } from 'express';
import Orders from '../db/models/orders';
import orders_details from '../db/models/orders_details';
import { clearCart } from './menuController'; 

interface OrderData {
  clientId: number;
  deliveryAddressId: number;
  totalPrice: number;
  status: string;
  cartItems: Array<{
    productId: number;
    quantity: number;
  }>;
}

export const confirmOrder = async (req: Request & { userId?: number }, res: Response): Promise<void> => {
    const { clientId, deliveryAddressId, totalPrice, status, cartItems } = req.body as OrderData;

    try {
        const order = await Orders.create({
            clientId,
            deliveryAddressId,
            totalPrice,
            status,
        });

        for (const item of cartItems) {
            await orders_details.create({
                orderId: order.id,
                menuId: item.productId,
                quantity: item.quantity,
            });
        }

        await clearCart(req);

        res.status(201).json({
            message: 'Pedido confirmado correctamente',
            order,
        });
    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
        res.status(500).json({ message: 'Error al confirmar el pedido' });
    }
};