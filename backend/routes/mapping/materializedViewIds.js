import express from "express";
import { Op } from "sequelize";
import { pool } from "../../config/database.js";
import MaterializedViewIdsModel from "../../models/materializedViewIds.js";
import AdminAuth from "../../utils/adminAuth.js";

const router = express.Router();

// Create a new materialized view id
router.post("/", AdminAuth, async (req, res) => {
  try {
    const { name, category, mapping_id, mapping_name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!mapping_id) {
      return res.status(400).json({ message: "mapping_id is required" });
    }
    const created = await MaterializedViewIdsModel.create({
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

// Bulk add id_nos for a given name (no deletes; ignores existing pairs)
router.post("/bulk", AdminAuth, async (req, res) => {
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
          `INSERT INTO reporting.materialized_view_ids (name, category, mapping_id, mapping_name, created_at, updated_at)
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

// Read all materialized view ids
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT name, category
       FROM reporting.materialized_view_ids
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

// Read all mappings by name
router.get("/by-name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const rows = await MaterializedViewIdsModel.findAll({
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
router.delete(
  "/by-name/:name/mappings/:mappingId",
  AdminAuth,
  async (req, res) => {
    try {
      const { name, mappingId } = req.params;
      const deleted = await MaterializedViewIdsModel.destroy({
        where: { name, mapping_id: Number(mappingId) },
      });
      if (!deleted)
        return res.status(404).json({ message: "Mapping not found" });
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Search helper endpoint for reference tables (must come before "/:id")
router.get("/search", async (req, res) => {
  try {
    const { table, q } = req.query;
    const allowed = {
      clinic: "dwh.dim_eafya_clinic",
      ward: "dwh.dim_eafya_ward",
      vaccine: "dwh.dim_eafya_vaccine",
      store: "dwh.dim_eafya_store",
    };
    if (!table || !allowed[table]) {
      return res.status(400).json({
        message:
          "Invalid or missing table. Use one of: clinic, ward, vaccine, store",
      });
    }
    // Ensure relation exists to avoid 500s if missing
    const relation = allowed[table];
    const regclassCheck = await pool.query("SELECT to_regclass($1) AS rel", [
      relation,
    ]);
    if (!regclassCheck.rows[0].rel) {
      return res.status(404).json({ message: `Table ${relation} not found` });
    }
    const text = `SELECT id, "name" FROM ${allowed[table]} ${
      q ? 'WHERE "name" ILIKE $1' : ""
    } ORDER BY "name" LIMIT 50`;
    const params = q ? [`%${q}%`] : [];
    const { rows } = await pool.query(text, params);
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
});

// List reference items by table (for modal loading like other mappings)
router.get("/items", async (req, res) => {
  try {
    const { table, category } = req.query;

    const allowed = {
      clinic: "dwh.dim_eafya_clinic",
      ward: "dwh.dim_eafya_ward",
      vaccine: "dwh.dim_eafya_vaccine",
      store: "dwh.dim_eafya_store",
    };

    const normalized = (table ? table : (category || "").toLowerCase()).replace(
      /s$/,
      ""
    );
    if (!normalized || !allowed[normalized]) {
      return res.status(400).json({
        message: "Provide table or category (clinic|ward|vaccine|store)",
      });
    }
    const candidates = Array.isArray(allowed[normalized])
      ? allowed[normalized]
      : [allowed[normalized]];
    let rows = [];
    for (const rel of candidates) {
      const reg = await pool.query("SELECT to_regclass($1) AS rel", [rel]);
      if (!reg.rows[0].rel) continue;
      const r = await pool.query(
        `SELECT id, "name" FROM ${rel} ORDER BY "name" LIMIT 1000`
      );
      if (r.rows.length > 0) {
        rows = r.rows;
        break;
      }
    }
    res.json(rows);
  } catch (error) {
    console.error("Items error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Read one by id
router.get("/:id", async (req, res) => {
  try {
    const item = await MaterializedViewIdsModel.findByPk(req.params.id);
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
    const item = await MaterializedViewIdsModel.findByPk(req.params.id);
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
    const deleted = await MaterializedViewIdsModel.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Search helper endpoint for reference tables
router.get("/search", async (req, res) => {
  try {
    const { table, q } = req.query;
    const allowed = {
      clinic: "dwh.dim_eafya_clinic",
      ward: "dwh.dim_eafya_ward",
      vaccine: "dwh.dim_eafya_vaccine",
      store: "dwh.dim_eafya_store",
    };
    if (!table || !allowed[table]) {
      return res.status(400).json({
        message:
          "Invalid or missing table. Use one of: clinic, ward, vaccine, store",
      });
    }
    // Ensure relation exists to avoid 500s if missing
    const relation = allowed[table];
    const regclassCheck = await pool.query("SELECT to_regclass($1) AS rel", [
      relation,
    ]);
    if (!regclassCheck.rows[0].rel) {
      return res.status(404).json({ message: `Table ${relation} not found` });
    }
    const text = `SELECT id, "name" FROM ${allowed[table]} ${
      q ? 'WHERE "name" ILIKE $1' : ""
    } ORDER BY "name" LIMIT 50`;
    const params = q ? [`%${q}%`] : [];
    const { rows } = await pool.query(text, params);
    res.json(rows);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
});
export default router;
