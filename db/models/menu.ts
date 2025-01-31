require('dotenv').config();
import { DataTypes, Sequelize } from 'sequelize';
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

interface MenuAtributes {
    id?: number;
    product_name: string;
    description: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Menu extends Model <MenuAtributes> implements MenuAtributes { 
    public id!: number;
    public product_name!: string;
    public description!: string;
    public price!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Menu.init({ 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
},
{
    sequelize,
    modelName: 'Menu',
    tableName: 'Menu',
    timestamps: true,
})