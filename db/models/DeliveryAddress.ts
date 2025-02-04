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

interface addressesAtributes { 
    id?: number;
    peopleId?: number;
    address: string;
    latitude:  Float64Array;
    longitude: Float64Array;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Addresses extends Model<addressesAtributes> implements addressesAtributes { 
    public id!: number;
    public peopleId!: number;
    public address!: string;
    public latitude!: Float64Array;
    public longitude!: Float64Array;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Addresses.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    peopleId: { 
        type: DataTypes.INTEGER,
        references: {
            model: 'people',
            key: 'id'
        }
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    latitude: { 
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
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
    modelName: 'Addresses',
    tableName: 'Addresses',
    timestamps: true,
    paranoid: true,
})