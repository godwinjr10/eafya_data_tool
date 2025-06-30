import express from "express";
import CommoditiesMapping from "../../models/commoditiesMapping.js";

const router =
  express.Router();

// GET all commodities mappings with pagination
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
        await CommoditiesMapping.getAll(
          page,
          limit,
          search
        );
      res.json(result);
    } catch (error) {
      console.error(
        "Error fetching commodities mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single commodities mapping (using hmis_code as key)
router.put(
  "/:hmis_code",
  async (req, res) => {
    try {
      const { hmis_code } =
        req.params;
      const updateData =
        req.body;

      const updatedMapping =
        await CommoditiesMapping.update(
          hmis_code,
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Commodities mapping not found",
          });
      }

      res.json({
        message:
          "Commodities mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating commodities mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update commodities mappings
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
        await CommoditiesMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} commodities mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating commodities mappings:",
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
