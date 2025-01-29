require('dotenv').config();
import express from 'express';

const app = express();
app.use(express.json());
//rutas para las apis

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("node", "root", "8721", {
    host: "127.0.0.1",
    dialect: "mysql"
})

export default sequelize;