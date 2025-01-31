require('dotenv').config();
import bodyParser from 'body-parser';
import express from 'express';
import router from './routes/authRoutes';

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', router);

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