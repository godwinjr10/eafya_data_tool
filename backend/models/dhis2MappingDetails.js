import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Dhis2MappingDetails = sequelize.define(
  "dhis2_mapping_details",
  {
    hmis_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    hmis_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    hmis_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hmis_section: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hmis_section_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dhis2_data_element_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dhis2_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dhis2_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dhis2_shortName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dhis2_dataset: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dhis2_categoryCombo_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dhis2_categoryOptionCombo_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dhis2_categoryOptionCombo_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    schema: "reporting",
    tableName: "dhis2_mapping_details",

  }
);
Dhis2MappingDetails.sync({ alter: true });

export default Dhis2MappingDetails;
