import express from "express";
import LabtestsMapping from "../../models/labtestsMapping.js";

const router =
  express.Router();

// GET all lab tests mappings with pagination
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
        await LabtestsMapping.getAll(
          page,
          limit,
          search
        );
      res.json(result);
    } catch (error) {
      console.error(
        "Error fetching lab tests mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single lab tests mapping (only hmis_code as key)
router.put(
  "/:hmis_code",
  async (req, res) => {
    try {
      const { hmis_code } =
        req.params;
      const updateData =
        req.body;

      const updatedMapping =
        await LabtestsMapping.update(
          hmis_code,
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Lab tests mapping not found",
          });
      }

      res.json({
        message:
          "Lab tests mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating lab tests mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update lab tests mappings
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
        await LabtestsMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} lab tests mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating lab tests mappings:",
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
