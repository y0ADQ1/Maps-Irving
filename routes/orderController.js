const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/confirmOrder', async (req, res) => {
    console.log('req.body:', req.body);

    const { totalPrice, cartItems, token_id, name, email, phone } = req.body;

    // Validación básica
    if (!totalPrice || !Array.isArray(cartItems) || cartItems.length === 0 || !token_id || !name || !email || !phone) {
        console.log('Faltan datos requeridos o son inválidos');
        return res.status(400).json({ message: 'Faltan datos requeridos o son inválidos', received: req.body });
    }

    try {
        // Crear cliente en Conekta
        const customerResponse = await axios.post(
            'https://api.conekta.io/customers',
            { name, email, phone },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.conekta-v2.0.0+json',
                    'Authorization': `Basic ${Buffer.from(process.env.CONEKTA_PRIVATE_KEY_TEST + ':').toString('base64')}`
                }
            }
        );

        const customer = customerResponse.data;

        // Crear orden en Conekta y procesar pago
        const orderResponse = await axios.post(
            'https://api.conekta.io/orders',
            {
                currency: 'MXN',
                customer_info: { customer_id: customer.id },
                line_items: cartItems.map(item => ({
                    name: `Producto ${item.productId}`,
                    unit_price: (item.price || 0) * 100,
                    quantity: item.quantity,
                })),
                charges: [{
                    payment_method: {
                        type: 'card',
                        token_id
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

        res.status(201).json({
            message: 'Pago realizado con éxito',
            conektaOrderId: orderResponse.data.id
        });
    } catch (error) {
        console.error('Error al procesar el pago:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Error al procesar el pago',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;