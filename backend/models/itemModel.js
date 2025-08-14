import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const ItemModel =
  sequelize.define(
    "mappeditems",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:
          DataTypes.UUIDV4,
        primaryKey: true,
      },
      data_element_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eafya_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eafya_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "mappeditems",
      schema: "reporting",
      timestamps: true,
    }
  );
  ItemModel.sync({ alter: true });

export default ItemModel;
