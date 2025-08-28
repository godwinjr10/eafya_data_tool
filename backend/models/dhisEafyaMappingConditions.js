import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const DhisEafyaMappingConditions = sequelize.define(
	"DhisEafyaMappingConditions",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		section_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		section_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		eafya_hmis_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		eafya_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		eafya_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		hmis_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		hmis_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		data_element_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		category_optioncombo_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		category_optioncombo_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		main_section_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "main_section_mapping",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		},
	},
	{
		tableName: "dhis_eafya_mapping_conditions",
		schema: "reporting",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
	}
);

// Remove the automatic sync to prevent conflicts
// DhisEafyaMappingConditions.sync({ alter: true });

export default DhisEafyaMappingConditions;
