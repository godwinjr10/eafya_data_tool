import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Facility = sequelize.define(
  "Facility",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facility_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dhis2_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    dhis2_uri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dhis2_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dhis2_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "facility",
    schema: "reporting",
    timestamps: true,
  }
);

export default Facility;
