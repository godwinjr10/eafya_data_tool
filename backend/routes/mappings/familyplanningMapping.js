import express from "express";
import FamilyplanningMapping from "../../models/familyplanningMapping.js";

const router =
  express.Router();

// GET all family planning mappings
router.get(
  "/",
  async (req, res) => {
    try {
      const mappings =
        await FamilyplanningMapping.getAll();
      res.json(mappings);
    } catch (error) {
      console.error(
        "Error fetching family planning mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single family planning mapping (using id as key)
router.put(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;
      const updateData =
        req.body;

      const updatedMapping =
        await FamilyplanningMapping.update(
          id,
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Family planning mapping not found",
          });
      }

      res.json({
        message:
          "Family planning mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating family planning mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update family planning mappings
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
        await FamilyplanningMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} family planning mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating family planning mappings:",
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
