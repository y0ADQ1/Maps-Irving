import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import router from './routes/authRoutes';
import { Sequelize } from 'sequelize';

// Importar orderController (usando require porque es un archivo JS)
const orderRoutes = require('./routes/orderController');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Registrar rutas
app.use('/api/auth', router);
app.use('/api/orders', orderRoutes); // Agregar rutas de orderController

const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const sequelize = new Sequelize("maps", "root", "8721", {
    host: "127.0.0.1",
    dialect: "mysql"
});

export default sequelize;
