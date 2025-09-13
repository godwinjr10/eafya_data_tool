import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const MaterializedViewIdsModel = sequelize.define(
  "materialized_view_ids",
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
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  { timestamps: true, schema: "reporting", tableName: "materialized_view_ids" }
);

//MaterializedViewIdsModel.sync({ alter: true });

export default MaterializedViewIdsModel;
