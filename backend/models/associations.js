import mainSectionMappingModel from "./mainSectionMapping.js";
import DhisEafyaMappingConditions from "./dhisEafyaMappingConditions.js";

// Initialize all model associations
export const initializeAssociations = () => {
	// Define associations between mainSectionMapping and DhisEafyaMappingConditions
	mainSectionMappingModel.hasMany(DhisEafyaMappingConditions, {
		foreignKey: "main_section_id",
		as: "conditionMappings",
	});

	DhisEafyaMappingConditions.belongsTo(mainSectionMappingModel, {
		foreignKey: "main_section_id",
		as: "mainSection",
	});

	console.log("Model associations initialized successfully");
};

