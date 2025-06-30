import express from "express";
import AntenatalMapping from "../../models/antenatalMapping.js";

const router =
  express.Router();

// GET all antenatal mappings
router.get(
  "/",
  async (req, res) => {
    try {
      const mappings =
        await AntenatalMapping.getAll();
      res.json(mappings);
    } catch (error) {
      console.error(
        "Error fetching antenatal mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single antenatal mapping (using composite key)
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
        await AntenatalMapping.update(
          {
            hmis_code,
            categoryoptioncombo_uid,
          },
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Antenatal mapping not found",
          });
      }

      res.json({
        message:
          "Antenatal mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating antenatal mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update antenatal mappings
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
        await AntenatalMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} antenatal mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating antenatal mappings:",
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
