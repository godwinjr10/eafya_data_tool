import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { testConnection, sequelize } from "./config/database.js";
import attendanceRoutes from "./routes/dhisreports/attendance.js";
import conditionRoutes from "./routes/dhisreports/conditions.js";
import commoditiesRoutes from "./routes/dhisreports/commodities.js";
import labTestRoutes from "./routes/dhisreports/labtests.js";
import FacilityRoutes from "./routes/facility.js";
import userRoutes from "./routes/users.js";
import antenatalRoutes from "./routes/dhisreports/antenatal.js";
import tetanusRoutes from "./routes/dhisreports/tetanus.js";
import immunizationRoutes from "./routes/dhisreports/immunization.js";
import downloadRoutes from "./routes/dhisreports/downloads.js";
import outpatientRoutes from "./routes/reports/outpatient.js";
import commoditiesReportRoutes from "./routes/reports/commodities.js";
import dashboardRoutes from "./routes/dhisreports/dashboard.js";
import dhisIntegration from "./routes/dhisintegration/dhisroutes.js";
import mappingRoutes from "./routes/mapping/hmis.js";
import datasetRoutes from "./routes/mapping/datasets.js";
import eafyaRoutes from "./routes/mapping/eafya.js";
import maternityRoutes from "./routes/dhisreports/maternity.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

testConnection();

// Sync database models
const syncDatabase = async () => {
	try {
		await sequelize.sync({
			alter: process.env.NODE_ENV === "development",
		});
		console.log("Database synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
};

syncDatabase();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/labtests", labTestRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/facility", FacilityRoutes);
app.use("/api/conditions", conditionRoutes);
app.use("/api/commodities", commoditiesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/antenatal", antenatalRoutes);
app.use("/api/tetanus", tetanusRoutes);
app.use("/api/immunization", immunizationRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/outpatient", outpatientRoutes);
app.use("/api/commodities/report", commoditiesReportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dhis", dhisIntegration);
app.use("/api/mapping", mappingRoutes);
app.use("/api/eafya", eafyaRoutes);
app.use("/api/maternity", maternityRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: "Something went wrong!",
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
