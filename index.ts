import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import router from './routes/authRoutes';
import { Sequelize } from 'sequelize';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/api/auth', router);

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Configuración de Sequelize
const sequelize = new Sequelize("node", "root", "8721", {
    host: "127.0.0.1",
    dialect: "mysql"
});

export default sequelize;
