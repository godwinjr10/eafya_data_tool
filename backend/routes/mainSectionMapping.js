import express from "express";
import mainSectionMappingModel from "../models/mainSectionMapping.js";
import DhisEafyaMappingConditions from "../models/dhisEafyaMappingConditions.js";

const router = express.Router();

// GET all main sections with their associated condition mappings
router.get("/", async (req, res) => {
	try {
		const mainSections = await mainSectionMappingModel.findAll({
			include: [
				{
					model: DhisEafyaMappingConditions,
					as: "conditionMappings",
					required: false, // LEFT JOIN
				},
			],
		});

		res.json(mainSections);
	} catch (error) {
		console.error("Error fetching main sections:", error);
		res.status(500).json({ message: error.message });
	}
});

// GET specific main section with condition mappings
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const mainSection = await mainSectionMappingModel.findByPk(id, {
			include: [
				{
					model: DhisEafyaMappingConditions,
					as: "conditionMappings",
				},
			],
		});

		if (!mainSection) {
			return res
				.status(404)
				.json({ message: "Main section not found" });
		}

		res.json(mainSection);
	} catch (error) {
		console.error("Error fetching main section:", error);
		res.status(500).json({ message: error.message });
	}
});

// POST - Create new main section
router.post("/", async (req, res) => {
	try {
		const { category_name, report_name } = req.body;

		if (!category_name || !report_name) {
			return res.status(400).json({
				message: "category_name and report_name are required",
			});
		}

		const newMainSection = await mainSectionMappingModel.create({
			category_name,
			report_name,
		});

		res.status(201).json(newMainSection);
	} catch (error) {
		console.error("Error creating main section:", error);
		res.status(500).json({ message: error.message });
	}
});

// PUT - Update main section
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { category_name, report_name } = req.body;

		const mainSection = await mainSectionMappingModel.findByPk(id);

		if (!mainSection) {
			return res
				.status(404)
				.json({ message: "Main section not found" });
		}

		await mainSection.update({
			category_name: category_name || mainSection.category_name,
			report_name: report_name || mainSection.report_name,
		});

		res.json(mainSection);
	} catch (error) {
		console.error("Error updating main section:", error);
		res.status(500).json({ message: error.message });
	}
});

// DELETE - Delete main section (condition mappings will be set to NULL due to onDelete: 'SET NULL')
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const mainSection = await mainSectionMappingModel.findByPk(id);

		if (!mainSection) {
			return res
				.status(404)
				.json({ message: "Main section not found" });
		}

		await mainSection.destroy();

		res.json({ message: "Main section deleted successfully" });
	} catch (error) {
		console.error("Error deleting main section:", error);
		res.status(500).json({ message: error.message });
	}
});

// POST - Add condition mapping to a main section
router.post("/:id/conditions", async (req, res) => {
	try {
		const { id } = req.params;
		const conditionData = req.body;

		// Verify main section exists
		const mainSection = await mainSectionMappingModel.findByPk(id);
		if (!mainSection) {
			return res
				.status(404)
				.json({ message: "Main section not found" });
		}

		// Create condition mapping with the foreign key
		const newCondition = await DhisEafyaMappingConditions.create({
			...conditionData,
			main_section_id: id,
		});

		res.status(201).json(newCondition);
	} catch (error) {
		console.error("Error creating condition mapping:", error);
		res.status(500).json({ message: error.message });
	}
});

export default router;

