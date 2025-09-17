import express from "express";
import Facility from "../models/facility.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const facility = await Facility.create(req.body);

    res.status(201).json({
      status: "success",
      facility,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalRecords = await Facility.count();
    const totalPages = Math.ceil(totalRecords / limit);

    const facility = await Facility.findAll({
      limit,
      offset: skip,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      results: facility.length,
      totalRecords,
      totalPages,
      currentPage: page,
      facility,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  console.log("Received update request for ID:", req.params.id);
  console.log("Update data:", req.body);
  try {
    const result = await Facility.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    const facility = await Facility.findByPk(req.params.id);

    res.status(200).json({
      status: "success",
      facility,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const facility = await Facility.findByPk(req.params.id);

    if (!facility) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      facility,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Facility.destroy({
      where: { id: req.params.id },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
