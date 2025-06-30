import express from "express";
import ConditionsMapping from "../../models/conditionsMapping.js";

const router =
  express.Router();

// GET all conditions mappings with pagination
router.get(
  "/",
  async (req, res) => {
    try {
      const page =
        parseInt(
          req.query.page
        ) || 1;
      const limit =
        parseInt(
          req.query.limit
        ) || 50;
      const search =
        req.query.search ||
        "";

      const result =
        await ConditionsMapping.getAll(
          page,
          limit,
          search
        );
      res.json(result);
    } catch (error) {
      console.error(
        "Error fetching conditions mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single conditions mapping (using id as key)
router.put(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;
      const updateData =
        req.body;

      const updatedMapping =
        await ConditionsMapping.update(
          id,
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Conditions mapping not found",
          });
      }

      res.json({
        message:
          "Conditions mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating conditions mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update conditions mappings
router.put(
  "/bulk",
  async (req, res) => {
    try {
      const { mappings } =
        req.body;

      if (
        !mappings ||
        !Array.isArray(
          mappings
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Mappings array is required",
          });
      }

      const updatedMappings =
        await ConditionsMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} conditions mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating conditions mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

export default router;
