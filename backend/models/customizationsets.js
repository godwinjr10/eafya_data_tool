import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const CustomizationSet = sequelize.define(
  "customizationset",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mapping_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mapping_name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  { timestamps: true, schema: "reporting", tableName: "customizationset" }
);

export default CustomizationSet;