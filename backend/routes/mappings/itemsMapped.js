import express from "express";
import { pool } from "../../config/database.js";
import ItemModel from "../../models/itemModel.js";
import { v4 as uuidv4 } from 'uuid'

const router =
  express.Router();

// Get items for a specific data element
router.get(
  "/:dataElementId/items",
  async (req, res) => {
    try {
      const {
        dataElementId,
      } = req.params;
      const query = `
    SELECT 
      id,
      data_element_id,
      eafya_id,
      eafya_name,
      "createdAt",
      "updatedAt"
    FROM reporting.mappeditems
    WHERE data_element_id = $1
    ORDER BY "createdAt"
    `;
      const { rows } =
        await pool.query(
          query,
          [dataElementId]
        );
      return res.json(rows);
    } catch (error) {
      console.error(
        "Database error:",
        error
      );
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// Get items count for a specific data element
router.get(
    "/:dataElementId/items/count",
    async (req, res) => {
      try {
        const {
          dataElementId,
        } = req.params;
        const query = `
      SELECT 
        id,
        data_element_id,
        eafya_id,
        eafya_name,
        "createdAt",
        "updatedAt"
      FROM reporting.mappeditems
      WHERE data_element_id = $1
      ORDER BY "createdAt"
      `;
        const { rows } =
          await pool.query(
            query,
            [dataElementId]
          );
        return res.json(rows.length);
      } catch (error) {
        console.error(
          "Database error:",
          error
        );
        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

// Create a new item for a data element
router.post(
  "/:dataElementId/items",
  async (req, res) => {
    try {
      const {
        dataElementId,
      } = req.params;
      const {
        eafya_id,
        eafya_name,
      } = req.body;

      // Generate a unique ID using timestamp and random number
      const uniqueId =uuidv4();

      const query = `
    INSERT INTO reporting.mappeditems (id, data_element_id, eafya_id, eafya_name, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
    `;

      const { rows } =
        await pool.query(
          query,
          [
            uniqueId,
            dataElementId,
            eafya_id || null,
            eafya_name ||
              null,
          ]
        );

      return res
        .status(201)
        .json(rows[0]);
    } catch (error) {
      console.error(
        "Database error:",
        error
      );
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// Update item mapping
router.put(
  "/items/:itemId",
  async (req, res) => {
    try {
      const { itemId } =
        req.params;
      const {
        eafya_id,
        eafya_name,
      } = req.body;

      const query = `
    UPDATE reporting.mappeditems
    SET 
      eafya_id = $2,
      eafya_name = $3,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `;

      const { rows } =
        await pool.query(
          query,
          [
            itemId,
            eafya_id || null,
            eafya_name ||
              null,
          ]
        );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({
            error:
              "Item not found",
          });
      }

      return res.json(
        rows[0]
      );
    } catch (error) {
      console.error(
        "Database error:",
        error
      );
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// Delete an item
router.delete(
  "/items/:itemId",
  async (req, res) => {
    try {
      const { itemId } =
        req.params;

      const query = `
    DELETE FROM reporting.mappeditems
    WHERE id = $1
    RETURNING *
    `;

      const { rows } =
        await pool.query(
          query,
          [itemId]
        );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({
            error:
              "Item not found",
          });
      }

      return res.json({
        message:
          "Item deleted successfully",
      });
    } catch (error) {
      console.error(
        "Database error:",
        error
      );
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

export default router;
