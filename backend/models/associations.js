import mainSectionMappingModel from "./mainSectionMapping.js";
import DhisEafyaMappingConditions from "./dhisEafyaMappingConditions.js";
import DimSections from "./dimSections.js";
import Dhis2MappingDetails from "./dhis2MappingDetails.js";
import EafyaHmisMapping from "./eafyaHmisMapping.js";

// Initialize all model associations
export const initializeAssociations = () => {
	const models = {
		mainSectionMappingModel,
		DhisEafyaMappingConditions,
		DimSections,
		Dhis2MappingDetails,
		EafyaHmisMapping,
	};

	// Define associations between mainSectionMapping and DhisEafyaMappingConditions
	mainSectionMappingModel.hasMany(DhisEafyaMappingConditions, {
		foreignKey: "main_section_id",
		as: "conditionMappings",
	});

	DhisEafyaMappingConditions.belongsTo(mainSectionMappingModel, {
		foreignKey: "main_section_id",
		as: "mainSection",
	});

	// Additional associations can be added here as needed
	// Example: EafyaHmisMapping and DimSections
	DimSections.hasMany(EafyaHmisMapping, {
		foreignKey: "dim_id",
		sourceKey: "id",
		as: "eafyaMappings",
	});

	EafyaHmisMapping.belongsTo(DimSections, {
		foreignKey: "dim_id",
		targetKey: "id",
		as: "dimSection",
	});

	console.log("Model associations initialized successfully");
};

