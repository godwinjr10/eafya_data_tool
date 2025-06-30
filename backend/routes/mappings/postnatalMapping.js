import express from "express";
import PostnatalMapping from "../../models/postnatalMapping.js";

const router =
  express.Router();

// GET all postnatal mappings with pagination
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
        await PostnatalMapping.getAll(
          page,
          limit,
          search
        );
      res.json(result);
    } catch (error) {
      console.error(
        "Error fetching postnatal mappings:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT update single postnatal mapping
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
        await PostnatalMapping.update(
          hmis_code,
          categoryoptioncombo_uid,
          updateData
        );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({
            message:
              "Postnatal mapping not found",
          });
      }

      res.json({
        message:
          "Postnatal mapping updated successfully",
        data: updatedMapping,
      });
    } catch (error) {
      console.error(
        "Error updating postnatal mapping:",
        error
      );
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// PUT bulk update postnatal mappings
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
        await PostnatalMapping.bulkUpdate(
          mappings
        );

      res.json({
        message: `${updatedMappings.length} postnatal mappings updated successfully`,
        data: updatedMappings,
      });
    } catch (error) {
      console.error(
        "Error bulk updating postnatal mappings:",
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
