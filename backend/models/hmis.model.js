import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const HMIS = sequelize.define('HMIS', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    dataSetId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['HMIS_105_01']] // Add more datasets as needed
        }
    },
    section: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    facilityId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reportingPeriod: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
            isValidPeriod(value) {
                if (!value.month || !value.year) {
                    throw new Error('Reporting period must include month and year');
                }
                if (value.month < 1 || value.month > 12) {
                    throw new Error('Month must be between 1 and 12');
                }
            }
        }
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {
            status: 'draft'
        },
        validate: {
            isValidMetadata(value) {
                if (!['draft', 'submitted', 'approved', 'rejected'].includes(value.status)) {
                    throw new Error('Invalid status value');
                }
            }
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['dataSetId', 'facilityId'],
            name: 'hmis_dataset_facility_idx'
        },
        {
            fields: ['dataSetId', 'section'],
            name: 'hmis_dataset_section_idx'
        }
    ]
});

export default HMIS; 