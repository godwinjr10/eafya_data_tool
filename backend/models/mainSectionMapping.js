import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const mainSectionMappingModel = sequelize.define(
	"main_section_mapping",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		category_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		report_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		schema: "reporting",
		tableName: "main_section_mapping",
	}
);

// Remove the automatic sync to prevent conflicts
// mainSectionMappingModel.sync({ alter: true });

export default mainSectionMappingModel;
