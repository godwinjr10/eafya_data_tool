import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection, sequelize } from './config/database.js';
import hmisRoutes from './routes/hmis.routes.js';
import dhisEafyaMappingRoutes from './routes/eafya_mapping.routes.js';
import attendanceRoutes from './routes/attendance.js';
import datasetRoutes from './routes/dataset.js';
import conditionRoutes from './routes/conditions.js';
import commoditiesRoutes from './routes/commodities.js';
import labTestRoutes from './routes/labtests.js';
import FacilityRoutes from './routes/facility.js';
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
testConnection();

// Sync database models
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

syncDatabase();

// Routes
app.use('/api/hmis', hmisRoutes);
app.use("/api/users", userRoutes);
app.use('/api/labtests', labTestRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/facility', FacilityRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/commodities', commoditiesRoutes);
app.use('/api/mappings', dhisEafyaMappingRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 