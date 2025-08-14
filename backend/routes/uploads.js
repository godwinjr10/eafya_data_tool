import express from 'express';
import CSVUploadService from '../uploads.js';

const router = express.Router();

// Initialize the upload service
const uploadService = new CSVUploadService();

/**
 * @route GET /api/uploads/status
 * @desc Get upload service status and available files
 */
router.get('/status', async (req, res) => {
  try {
    const csvFiles = uploadService.getCSVFiles();
    const results = uploadService.getResults();
    const reportingTables = await uploadService.listReportingTables();
    
    res.json({
      success: true,
      message: 'Upload service status retrieved successfully',
      data: {
        availableFiles: csvFiles,
        uploadHistory: results,
        uploadsDirectory: uploadService.uploadsDir,
        reportingSchema: {
          name: 'reporting',
          tables: reportingTables,
          tableCount: reportingTables.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving upload service status',
      error: error.message
    });
  }
});

/**
 * @route POST /api/uploads/upload-all
 * @desc Upload all CSV files from the uploads directory
 */
router.post('/upload-all', async (req, res) => {
  try {
    // Clear previous results
    uploadService.clearResults();
    
    // Start upload process
    await uploadService.uploadAllCSVFiles();
    
    const results = uploadService.getResults();
    
    res.json({
      success: true,
      message: 'CSV upload process completed',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during CSV upload process',
      error: error.message
    });
  }
});

/**
 * @route POST /api/uploads/upload-file
 * @desc Upload a specific CSV file
 */
router.post('/upload-file', async (req, res) => {
  try {
    const { fileName } = req.body;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'fileName is required in request body'
      });
    }
    
    // Clear previous results
    uploadService.clearResults();
    
    // Upload specific file
    const result = await uploadService.uploadSpecificFile(fileName);
    
    if (result) {
      const results = uploadService.getResults();
      res.json({
        success: true,
        message: `File ${fileName} uploaded successfully`,
        data: results
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Failed to upload file ${fileName}`,
        data: uploadService.getResults()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading specific file',
      error: error.message
    });
  }
});

/**
 * @route GET /api/uploads/files
 * @desc Get list of available CSV files
 */
router.get('/files', async (req, res) => {
  try {
    const csvFiles = uploadService.getCSVFiles();
    
    res.json({
      success: true,
      message: 'Available CSV files retrieved successfully',
      data: {
        files: csvFiles,
        count: csvFiles.length,
        directory: uploadService.uploadsDir
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving CSV files list',
      error: error.message
    });
  }
});

/**
 * @route POST /api/uploads/clear-results
 * @desc Clear upload results and errors
 */
router.post('/clear-results', async (req, res) => {
  try {
    uploadService.clearResults();
    
    res.json({
      success: true,
      message: 'Upload results cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing upload results',
      error: error.message
    });
  }
});

export default router;
