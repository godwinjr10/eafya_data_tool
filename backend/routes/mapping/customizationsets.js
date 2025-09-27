import express from "express";
import { Op } from "sequelize";
import { pool } from "../../config/database.js";
import CustomizationSet from "../../models/customizationsets.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, category, mapping_id, mapping_name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!mapping_id) {
      return res.status(400).json({ message: "mapping_id is required" });
    }
    const created = await CustomizationSet.create({
      name,
      category: category || null,
      mapping_id: Number(mapping_id),
      mapping_name: mapping_name || null,
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { allData } = req.body;
    if (!allData || !allData.name || !Array.isArray(allData.mappings)) {
      return res
        .status(400)
        .json({ message: "allData with name and mappings[] is required" });
    }

    const name = String(allData.name).trim();
    const category = allData.category || null;
    const toAdd = allData.mappings.map((m) => ({
      id: m.id,
      name: m.name ?? null,
    }));

    // Insert duplicate rows, ignore conflicts on (name, mapping_id)
    let createdCount = 0;
    for (const m of toAdd) {
      try {
        const result = await pool.query(
          `INSERT INTO reporting.customizationset (name, category, mapping_id, mapping_name, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [name, category, Number(m.id), m.name || null]
        );
        // pg returns no rowCount for ON CONFLICT DO NOTHING when no conflict; use commandTag fallback
        createdCount += 1;
      } catch (e) {
        // ignore unique violations, rethrow others
        if (e.code !== "23505") throw e;
      }
    }
    res
      .status(201)
      .json({ message: "Bulk add complete", created: createdCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT name, category
       FROM reporting.customizationset
       ORDER BY name`
    );
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const rows = await CustomizationSet.findAll({
      where: { name, mapping_id: { [Op.gt]: 0 } },
      order: [["mapping_id", "ASC"]],
    });
    const data = rows.map((r) => ({ id: r.mapping_id, name: r.mapping_name }));
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a single mapping from the JSONB array by name and mapping id
router.delete("/:name/mappings/:mappingId", async (req, res) => {
  try {
    const { name, mappingId } = req.params;
    const deleted = await CustomizationSet.destroy({
      where: { name, mapping_id: Number(mappingId) },
    });
    if (!deleted) return res.status(404).json({ message: "Mapping not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/items/clinics", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_clinic
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/items/wards", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_ward
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/items/vaccines", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_vaccine
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/items/store", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_store
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read one by id
router.get("/:id", async (req, res) => {
  try {
    const item = await CustomizationSet.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { name, mapping_id, mapping_name } = req.body;
    const item = await CustomizationSet.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    const updateData = {};
    if (typeof name !== "undefined") updateData.name = name;
    if (typeof mapping_id !== "undefined")
      updateData.mapping_id = String(mapping_id);
    if (typeof mapping_name !== "undefined")
      updateData.mapping_name = mapping_name;
    await item.update(updateData);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a mapping by id (allowed in details view)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CustomizationSet.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
