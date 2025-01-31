require('dotenv').config();
import { DataTypes, Sequelize } from "sequelize";
import { Model } from 'sequelize';
import bcrypt from 'bcrypt';

const sequelize = new Sequelize(
    process.env.DB_NAME ?? '',
    process.env.DB_USERNAME ?? '',
    process.env.DB_PASSWORD ?? '',
    {
        dialect: 'mysql',
        host: process.env.DB_HOST
    }
);

interface UsersAtributes{
    id?: number;
    user_name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    authToken?: string;
}


export default class Users extends Model<UsersAtributes> implements UsersAtributes {
    public id!: number;
    public user_name!: string;
    public email!: string;
    public password!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public authToken!: string;
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
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
    authToken: {
        type: DataTypes.STRING(500),
        unique: true
    },
},
{
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true,
    hooks: {
    beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
        },
    }
}
);