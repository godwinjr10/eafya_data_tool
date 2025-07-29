import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import DimHmisConditions from "./dimHmisConditions.js";

const FactHmisEafyaMapping =
  sequelize.define(
    "FactHmisEafyaMapping",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:
          DataTypes.UUIDV4,
        primaryKey: true,
      },
      dim_condition_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model:
            DimHmisConditions,
          key: "id",
        },
      },
      eafya_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eafya_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eafya_hmis_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName:
        "fact_hmis_eafya_mapping",
      schema: "reporting",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: [
            "dim_condition_id",
            "eafya_id",
          ],
        },
        {
          fields: [
            "dim_condition_id",
          ],
        },
        {
          fields: [
            "eafya_id",
          ],
        },
        {
          fields: [
            "is_active",
          ],
        },
      ],
    }
  );

// Define associations
DimHmisConditions.hasMany(
  FactHmisEafyaMapping,
  {
    foreignKey:
      "dim_condition_id",
    as: "mappings",
  }
);

FactHmisEafyaMapping.belongsTo(
  DimHmisConditions,
  {
    foreignKey:
      "dim_condition_id",
    as: "condition",
  }
);

export default FactHmisEafyaMapping;
