const express = require('express');
const router = express.Router();
const conekta = require('conekta');
const Orders = require('../db/models/orders');
const orders_details = require('../db/models/orders_details');
const { clearCart } = require('../controllers/menuController');

conekta.Conekta.privateKey = process.env.CONEKTA_PRIVATE_KEY_TEST;

router.post('/confirmOrder', async (req, res) => {
    const { clientId, deliveryAddressId, totalPrice, status, cartItems } = req.body;

    try {
        const conektaOrder = await conekta.Order.create({
            line_items: cartItems.map(item => ({
                name: `Producto ${item.productId}`, 
                unit_price: item.price * 100, 
                quantity: item.quantity,
            })),
            currency: 'MXN',
            customer_info: {
                customer_id: clientId.toString(), 
            },
            shipping_contact: {
                address: {
                    street1: 'Villas Universidad', 
                    postal_code: '27087', 
                    country: 'MX',
                },
            },
            charges: [{
                payment_method: {
                    type: 'card', 
                },
            }],
        });

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
            conektaOrderId: conektaOrder.id,
        });
    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
        res.status(500).json({ message: 'Error al confirmar el pedido' });
    }
});

module.exports = router;