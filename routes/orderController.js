const express = require('express');
const router = express.Router();
const axios = require('axios');
const Orders = require('../db/models/orders');
const orders_details = require('../db/models/orders_details');
const { clearCart } = require('../controllers/menuController');

router.post('/confirmOrder', async (req, res) => {
    const { clientId, deliveryAddressId, totalPrice, status, cartItems, email, name, phone, token_id } = req.body;

    try {
        // 1. CREAR EL CLIENTE EN CONEKTA
        const customerResponse = await axios.post(
            'https://api.conekta.io/customers',
            {
                name: name,
                email: email,
                phone: phone
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.conekta-v2.0.0+json',
                    'Authorization': `Basic ${Buffer.from(process.env.CONEKTA_PRIVATE_KEY_TEST + ':').toString('base64')}`
                }
            }
        );

        const customer = customerResponse.data; // Guardamos el cliente

        // 2. CREAR LA ORDEN EN CONEKTA (USANDO EL CUSTOMER_ID Y EL TOKEN_ID)
        const orderResponse = await axios.post(
            'https://api.conekta.io/orders',
            {
                currency: 'MXN',
                customer_info: {
                    customer_id: customer.id, // Usa el ID del cliente recién creado
                },
                line_items: cartItems.map(item => ({
                    name: `Producto ${item.productId}`,
                    unit_price: item.price * 100, // Conekta espera precios en centavos
                    quantity: item.quantity,
                })),
                charges: [{
                    payment_method: {
                        type: 'card',
                        token_id: token_id // Necesita un token generado desde el frontend
                    }
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.conekta-v2.0.0+json',
                    'Authorization': `Basic ${Buffer.from(process.env.CONEKTA_PRIVATE_KEY_TEST + ':').toString('base64')}`
                }
            }
        );

        const conektaOrder = orderResponse.data; // Guardamos la orden creada en Conekta

        // 3. REGISTRAR LA ORDEN EN LA BASE DE DATOS LOCAL
        const order = await Orders.create({
            clientId,
            deliveryAddressId,
            totalPrice,
            status,
        });

        // 4. REGISTRAR LOS DETALLES DE LA ORDEN
        for (const item of cartItems) {
            await orders_details.create({
                orderId: order.id,
                menuId: item.productId,
                quantity: item.quantity,
            });
        }

        // 5. LIMPIAR EL CARRITO
        await clearCart(req);

        // 6. ENVIAR RESPUESTA EXITOSA
        res.status(201).json({
            message: 'Pedido confirmado correctamente',
            order,
            conektaOrderId: conektaOrder.id,
            conektaOrder
        });

    } catch (error) {
        console.error('Error al confirmar el pedido:', error.response ? error.response.data : error);
        res.status(500).json({
            message: 'Error al confirmar el pedido',
            error: error.response ? error.response.data : error.message
        });
    }
});

module.exports = router;
