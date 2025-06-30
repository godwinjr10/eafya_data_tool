import express from "express";
import MaternityMapping from "../../models/maternityMapping.js";

const router =
  express.Router();

// GET all maternity mappings
router.get(
  "/",
  async (req, res) => {
    try {
      const mappings =
        await MaternityMapping.getAll();
      res.json(mappings);
    } catch (error) {
      console.error(
        "Error fetching maternity mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single maternity mapping
router.put(
  "/:hmis_code/:categoryoptioncombo_uid",
  async (req, res) => {
    try {
      const {
        hmis_code,
        categoryoptioncombo_uid,
      } = req.params;
      const updateData =
        req.body;

      const updatedMapping =
        await MaternityMapping.update(
          hmis_code,
          categoryoptioncombo_uid,
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Maternity mapping not found",
          });
      }

      res.json({
        message:
          "Maternity mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating maternity mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update maternity mappings
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
        await MaternityMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} maternity mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating maternity mappings:",
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
