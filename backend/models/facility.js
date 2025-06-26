import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Facility = sequelize.define('Facility', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    facility_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dhis2_code: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    tableName: 'facility',
    schema: 'reporting',
    timestamps: true,
});

export default Facility;
