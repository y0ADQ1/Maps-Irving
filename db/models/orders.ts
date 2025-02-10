require('dotenv').config();
import { DataTypes, Sequelize } from "sequelize";
import { Model } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME ?? '',
    process.env.DB_USERNAME ?? '',
    process.env.DB_PASSWORD ?? '',
    {
        dialect: 'mysql',
        host: process.env.DB_HOST
    }
);

interface ordersAtributes {
    id?: number;
    clientId: number;
    deliveryId?: number;
    deliveryAddressId?: number;
    totalPrice?: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Orders extends Model<ordersAtributes> implements ordersAtributes {
    public id!: number;
    public clientId!: number;
    public deliveryId?: number;
    public deliveryAddressId?: number;
    public totalPrice!: number;
    public status!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Orders.init ({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'people',
            key: 'id'
        },
        allowNull: false
    },
    deliveryId: { 
        type: DataTypes.INTEGER,
        references: {
            model: 'people',
            key: 'id'
        },
        allowNull: true
    },
    deliveryAddressId: { 
        type: DataTypes.INTEGER,
        references: {
            model: 'DeliveryAddresses',
            key: 'id'
        },
        allowNull: false
    },
    totalPrice: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: { 
        type: DataTypes.ENUM('pending', 'in progress', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    createdAt: { 
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
},
{
    sequelize,
    modelName: 'Orders',
    tableName: 'orders',
    timestamps: true,
    paranoid: false,
    indexes: [
        {
            name: 'orders_client_id_index',
            fields: ['clientId']
        },
        {
            name: 'orders_delivery_id_index',
            fields: ['delivery_menId']
        },
        {
            name: 'orders_delivery_address_id_index',
            fields: ['deliveryAddressId']
        },
        {
            name: 'orders_status_index',
            fields: ['status']
        }
    ]
}
)