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
import dhisIntegration from "./routes/dhisintegration/index.js";

/***Mapping Routes ****/
import eafyadetails from "./routes/mapping/eafyadetails.js";
import datasetRoutes from "./routes/mapping/datasets.js";
import commoditiesMappingRoutes from "./routes/mapping/commodities.js";
import labtestsMappingRoutes from "./routes/mapping/labtests.js";
import familyplanningMappingRoutes from "./routes/mapping/familyplanning.js";
import vaccinesMappingRoutes from "./routes/mapping/vaccines.js";
import conditionsMappingRoutes from "./routes/mapping/conditions.js";
import proceduresMappingRoutes from "./routes/mapping/procedures.js";
import imagingMappingRoutes from "./routes/mapping/imaging.js";
import productsMappingRoutes from "./routes/mapping/products.js";

/*** DHIS2 Report ****/
import maternityRoutes from "./routes/dhisreports/maternity.js";
import postnatalRoutes from "./routes/dhisreports/postnatal.js";
import familyPlanningRoutes from "./routes/dhisreports/familyplanning.js";
import childHealthRoutes from "./routes/dhisreports/childHealth.js";
import tetanusVaccinationRoutes from "./routes/dhisreports/tetanusVaccination.js";
import childImmunizationRoutes from "./routes/dhisreports/childImmunization.js";
import hmis108Routes from "./routes/dhisreports/108Routes.js";
import materializedViewIdsRoutes from "./routes/mapping/materializedViewIds.js";
import updateRoutes from "./routes/update.js";
import upgradeRoutes from "./routes/upgrade.js";
import labtestsPatientRoutes from "./routes/reports/labtestsPatient.js";
import imagingRoutes from "./routes/reports/imaging.js";
import theatreRoutes from "./routes/reports/theatre.js";
import familyPlanningDetailsRoutes from "./routes/reports/familyPlanning.js";
import inpatientRoutes from "./routes/reports/inpatient.js";

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
      alter: false, // Disable automatic schema alterations
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

/***Mapping Routes ****/
app.use("/api/mapping/eafyadetails", eafyadetails);
app.use("/api/mapping/commodities", commoditiesMappingRoutes);
app.use("/api/mapping/labtests", labtestsMappingRoutes);
app.use("/api/mapping/familyplanning", familyplanningMappingRoutes);
app.use("/api/mapping/vaccines", vaccinesMappingRoutes);
app.use("/api/mapping/conditions", conditionsMappingRoutes);
app.use("/api/mapping/procedures", proceduresMappingRoutes);
app.use("/api/mapping/imaging", imagingMappingRoutes);
app.use("/api/mapping/products", productsMappingRoutes);

/*** DHIS2 Report ****/
app.use("/api/maternity", maternityRoutes);
app.use("/api/postnatal", postnatalRoutes);
app.use("/api/family-planning", familyPlanningRoutes);
app.use("/api/child-health", childHealthRoutes);
app.use("/api/tetanus-vaccination", tetanusVaccinationRoutes);
app.use("/api/child-immunization", childImmunizationRoutes);
app.use("/api/hmis108", hmis108Routes);
app.use("/api/materialized-view-ids", materializedViewIdsRoutes);
app.use("/api/labtests/patient", labtestsPatientRoutes);
app.use("/api/imaging", imagingRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/familyplanning", familyPlanningDetailsRoutes);
app.use("/api/inpatient", inpatientRoutes);

// Initialize update routes
updateRoutes(app);
upgradeRoutes(app);

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
