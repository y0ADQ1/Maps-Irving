require('dotenv').config();
import { DataTypes, Sequelize } from 'sequelize';
import { Model } from "sequelize"

const sequelize = new Sequelize(
    process.env.DB_NAME?? '',
    process.env.DB_USERNAME?? '',
    process.env.DB_PASSWORD?? '',
    {
        dialect:'mysql',
        host: process.env.DB_HOST
    }
)

interface online_ordersAtributes {
    id?: number;
    orderId: number;
    menuId: number;
    quantity: number;
}

export default class orders_details extends Model<online_ordersAtributes> implements online_ordersAtributes { 
    public id!: number;
    public orderId!: number;
    public menuId!: number;
    public quantity!: number;
}

orders_details.init(
    { 
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'orders',
                key: 'id'
            },
            allowNull: false
        },
        menuId: { 
            type: DataTypes.INTEGER,
            references: {
                model:'menu',
                key: 'id'
            },
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
{
    sequelize,
    modelName: 'orders_details',
    tableName: 'orders_details', 
    timestamps: false, 
    paranoid: false,  
})