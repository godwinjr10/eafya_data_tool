<<<<<<< HEAD
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const DimSections = sequelize.define(
    "dim_sections",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        section_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        section_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        section_item_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        section_item_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    },
    { 
        timestamps: false, 
        schema: 'reporting', 
        tableName: 'dim_sections',
        indexes: [
            {
                fields: ['section_id']
            },
            {
                fields: ['section_item_code']
            }
        ]
    }
);

export default DimSections; 
=======
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const DimSections = sequelize.define(
  "dim_sections",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    section_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    section_item_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section_item_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    schema: "reporting",
    tableName: "dim_sections",
    indexes: [
      {
        fields: ["section_id"],
      },
      {
        fields: ["section_item_code"],
      },
    ],
  }
);

export default DimSections;
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
