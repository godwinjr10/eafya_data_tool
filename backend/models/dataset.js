import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Dataset = sequelize.define('Dataset', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    dataset_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataset_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sections: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    }
}, {
    tableName: 'datasets',
    schema: 'reporting',
    timestamps: true,
});

export default Dataset;
