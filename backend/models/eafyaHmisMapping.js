import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import DimSections from "./dimSections.js";

const EafyaHmisMapping = sequelize.define(
  "eafya_hmis_mappings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dim_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eafya_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    eafya_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    schema: "reporting",
    tableName: "eafya_hmis_mappings",
    indexes: [
      {
        unique: true,
        fields: ["dim_id", "eafya_id"],
      },
      {
        fields: ["dim_id"],
      },
      {
        fields: ["eafya_id"],
      },
    ],
  }
);

export default EafyaHmisMapping;
