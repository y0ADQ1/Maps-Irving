const express = require('express');
const Router = express.Router;
const axios = require('axios');
const Orders = require('../db/models/orders');
const orders_details = require('../db/models/orders_details');
const { clearCart } = require('../controllers/menuController');

const router = new Router();

router.post('/confirmOrder', async (req, res) => {
    console.log('req.body:', req.body);

    const { clientId, deliveryAddressId, totalPrice, status, cartItems, email, name, phone, token_id } = req.body;

    console.log('clientId:', clientId);
    console.log('deliveryAddressId:', deliveryAddressId);
    console.log('totalPrice:', totalPrice);
    console.log('status:', status);
    console.log('cartItems:', cartItems);
    console.log('email:', email);
    console.log('name:', name);
    console.log('phone:', phone);
    console.log('token_id:', token_id);

    // Validación básica de los datos
    if (
        clientId == null ||
        deliveryAddressId == null ||
        totalPrice == null ||
        !status ||
        !Array.isArray(cartItems) || cartItems.length === 0 ||
        !email ||
        !name ||
        !phone ||
        !token_id
    ) {
        console.log('Faltan datos requeridos o son inválidos');
        return res.status(400).json({ message: 'Faltan datos requeridos o son inválidos', received: req.body });
    }

    try {
        // 1. CREAR EL CLIENTE EN CONEKTA
        console.log('Creando cliente en Conekta...');
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

        console.log('Cliente creado en Conekta:', customerResponse.data);
        const customer = customerResponse.data; // Guardamos el cliente

        // 2. CREAR LA ORDEN EN CONEKTA (USANDO EL CUSTOMER_ID Y EL TOKEN_ID)
        console.log('Creando orden en Conekta...');
        const orderResponse = await axios.post(
            'https://api.conekta.io/orders',
            {
                currency: 'MXN',
                customer_info: {
                    customer_id: customer.id, // Usa el ID del cliente recién creado
                },
                line_items: cartItems.map(item => ({
                    name: `Producto ${item.productId}`,
                    unit_price: (item.price || 0) * 100, // Conekta espera precios en centavos
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

        console.log('Orden creada en Conekta:', orderResponse.data);
        const conektaOrder = orderResponse.data; // Guardamos la orden creada en Conekta

        // 3. REGISTRAR LA ORDEN EN LA BASE DE DATOS LOCAL
        console.log('Registrando orden en la base de datos local...');
        const order = await Orders.create({
            clientId,
            deliveryAddressId,
            totalPrice,
            status,
        });

        console.log('Orden registrada en la base de datos local:', order);

        // 4. REGISTRAR LOS DETALLES DE LA ORDEN
        console.log('Registrando detalles de la orden...');
        for (const item of cartItems) {
            await orders_details.create({
                orderId: order.id,
                menuId: item.productId,
                quantity: item.quantity,
            });
        }

        console.log('Detalles de la orden registrados');

        // 5. LIMPIAR EL CARRITO
        console.log('Limpiando el carrito...');
        await clearCart(req);

        console.log('Carrito limpiado');

        // 6. ENVIAR RESPUESTA EXITOSA
        console.log('Enviando respuesta exitosa...');
        res.status(201).json({
            message: 'Pedido confirmado con éxito',
            orderId: order.id,
            conektaOrderId: conektaOrder.id,
        });

    } catch (error) {
        console.error('Error al confirmar el pedido:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Error al confirmar el pedido',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
