require('dotenv').config();
import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize"

const sequelize = new Sequelize(
    process.env.DB_NAME ?? '',
    process.env.DB_USERNAME ?? '',
    process.env.DB_PASSWORD ?? '',
    {
        dialect: 'mysql',
        host: process.env.DB_HOST
    }
);

interface PeopleAtributes {
    id: number;
    name: string;
    last_name: string;
    birthdate: Date;
    cellphone_number: number;
    userId: number;
    delivery_men: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default class People extends Model <PeopleAtributes> implements PeopleAtributes { 
    public id!: number;
    public name!: string;
    public last_name!: string;
    public birthdate!: Date;
    public cellphone_number!: number;
    public userId!: number;
    public delivery_men!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

People.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cellphone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    delivery_men: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    modelName: 'People',
    tableName: 'People',
    timestamps: true,
})