import { Request, Response } from 'express';
import Orders from '../db/models/orders';
import orders_details from '../db/models/orders_details';
import { clearCart } from './menuController'; 
import  People  from '../db/models/people';


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

export const getPendingOrders = async (req: Request & { userId?: number }, res: Response): Promise<void> => {
    try {
        // Verificar si el usuario es un delivery_men
        const person = await People.findOne({ where: { userId: req.userId } });
        if (!person || !person.delivery_men) {
            res.status(403).json({ message: 'Acceso denegado. Solo los repartidores pueden acceder a esta vista.' });
            return;
        }

        // Obtener las órdenes pendientes
        const orders = await Orders.findAll({
            where: { status: 'pending' }, // Filtra por estado "pending"
            include: [{ model: orders_details, as: 'details' }], // Incluye los detalles de la orden
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las órdenes pendientes' });
    }
};