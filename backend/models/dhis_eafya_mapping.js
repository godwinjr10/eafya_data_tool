import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const eAFYMapping = sequelize.define('eAFYMapping', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    section_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    section_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eafya_hmis_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eafya_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eafya_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hmis_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hmis_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_element_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_optioncombo_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_optioncombo_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'dhis_eafya_mapping',
    schema: 'reporting',
    timestamps: true,
});

export default eAFYMapping; 