import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  testConnection,
  sequelize,
} from "./config/database.js";
import hmisRoutes from "./routes/hmis.routes.js";
import dhisEafyaMappingRoutes from "./routes/eafya_mapping.routes.js";
import attendanceRoutes from "./routes/attendance.js";
import datasetRoutes from "./routes/dataset.js";
import conditionRoutes from "./routes/conditions.js";
import commoditiesRoutes from "./routes/commodities.js";
import labTestRoutes from "./routes/labtests.js";
import FacilityRoutes from "./routes/facility.js";
import userRoutes from "./routes/users.js";
import CsvMappingRoutes from "./routes/mappings/vaccineMapping.js";
import conditionsMappingRoutes from "./routes/mappings/conditionsMapping.js";
import commoditiesMappingRoutes from "./routes/mappings/commoditiesMapping.js";
import labtestsMappingRoutes from "./routes/mappings/labtestsMapping.js";
import postnatalMappingRoutes from "./routes/mappings/postnatalMapping.js";
import maternityMappingRoutes from "./routes/mappings/maternityMapping.js";
import familyplanningMappingRoutes from "./routes/mappings/familyplanningMapping.js";
import antenatalMappingRoutes from "./routes/mappings/antenatalMapping.js";
import antenatalRoutes from "./routes/antenatal.js";
import tetanusRoutes from "./routes/tetanus.js";
import immunizationRoutes from "./routes/immunization.js";
import downloadRoutes from "./routes/downloads.js";
import outpatientRoutes from "./routes/reports/outpatient.js";
import commoditiesReportRoutes from "./routes/reports/commodities.js";
import dashboardRoutes from "./routes/dashboard.js";
import AllMappingsRoutes from "./routes/mappings/allMappings.js";
import ItemsMappedRoutes from "./routes/mappings/itemsMapped.js";
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

// Test database connection
testConnection();

// Sync database models
const syncDatabase =
  async () => {
    try {
      await sequelize.sync({
        alter:
          process.env
            .NODE_ENV ===
          "development",
      });
      console.log(
        "Database synced successfully"
      );
    } catch (error) {
      console.error(
        "Error syncing database:",
        error
      );
    }
  };

syncDatabase();

// Routes
app.use(
  "/api/hmis",
  hmisRoutes
);
app.use(
  "/api/users",
  userRoutes
);
app.use(
  "/api/labtests",
  labTestRoutes
);
app.use(
  "/api/datasets",
  datasetRoutes
);
app.use(
  "/api/facility",
  FacilityRoutes
);
app.use(
  "/api/conditions",
  conditionRoutes
);
app.use(
  "/api/commodities",
  commoditiesRoutes
);
app.use(
  "/api/mappings",
  dhisEafyaMappingRoutes
);
app.use(
  "/api/mapp/csv",
  CsvMappingRoutes
);
app.use(
  "/api/mapping/vaccines",
  CsvMappingRoutes
);
app.use(
  "/api/mapping/conditions",
  conditionsMappingRoutes
);
app.use(
  "/api/mapping/commodities",
  commoditiesMappingRoutes
);
app.use(
  "/api/mapping/labtests",
  labtestsMappingRoutes
);
app.use(
  "/api/mapping/postnatal",
  postnatalMappingRoutes
);
app.use(
  "/api/mapping/maternity",
  maternityMappingRoutes
);
app.use(
  "/api/mapping/familyplanning",
  familyplanningMappingRoutes
);
app.use(
  "/api/mapping/antenatal",
  antenatalMappingRoutes
);
app.use(
  "/api/attendance",
  attendanceRoutes
);
app.use(
  "/api/hmis",
  hmisRoutes
);
app.use(
  "/api/users",
  userRoutes
);
app.use(
  "/api/labtests",
  labTestRoutes
);
app.use(
  "/api/datasets",
  datasetRoutes
);
app.use(
  "/api/facility",
  FacilityRoutes
);
app.use(
  "/api/conditions",
  conditionRoutes
);
app.use(
  "/api/commodities",
  commoditiesRoutes
);
app.use(
  "/api/mappings",
  dhisEafyaMappingRoutes
);
app.use(
  "/api/attendance",
  attendanceRoutes
);
app.use(
  "/api/antenatal",
  antenatalRoutes
);
app.use(
  "/api/tetanus",
  tetanusRoutes
);
app.use(
  "/api/immunization",
  immunizationRoutes
);
app.use(
  "/api/downloads",
  downloadRoutes
);
app.use(
  "/api/outpatient",
  outpatientRoutes
);
app.use(
  "/api/commodities/report",
  commoditiesReportRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/elements",
  AllMappingsRoutes
);
app.use(
  "/api/mapItems",
  ItemsMappedRoutes
);

// Error handling middleware
app.use(
  (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message:
        "Something went wrong!",
    });
  }
);

const PORT =
  process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
