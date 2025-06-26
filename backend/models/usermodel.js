import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserModel = sequelize.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        module: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    { timestamps: true, schema: 'reporting', tableName: 'users' }
);

// UserModel.sync({ alter: true });

export default UserModel;