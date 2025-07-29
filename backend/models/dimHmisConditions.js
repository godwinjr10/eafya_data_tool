import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const DimHmisConditions =
  sequelize.define(
    "DimHmisConditions",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:
          DataTypes.UUIDV4,
        primaryKey: true,
      },
      section_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      section_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hmis_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hmis_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data_element_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category_optioncombo_id:
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
      category_optioncombo_name:
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
    },
    {
      tableName:
        "dim_hmis_conditions",
      schema: "reporting",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: [
            "section_id",
            "hmis_code",
          ],
        },
        {
          fields: [
            "section_id",
          ],
        },
        {
          fields: [
            "hmis_code",
          ],
        },
      ],
    }
  );

export default DimHmisConditions;
