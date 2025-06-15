# EAFYA HMIS Backend

This is the backend API server for the EAFYA HMIS Data Tool. It provides data storage and retrieval capabilities for the HMIS data entry system.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eafya_hmis
   NODE_ENV=development
   ```

4. Make sure MongoDB is running on your system.

## Running the Server

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for hot reloading.

### Production Mode
```bash
npm start
```

## API Endpoints

### HMIS Data

- `POST /api/hmis` - Create new HMIS entry
- `GET /api/hmis` - Get HMIS entries by dataset and section
- `GET /api/hmis/:id` - Get HMIS entry by ID
- `PUT /api/hmis/:id` - Update HMIS entry
- `DELETE /api/hmis/:id` - Delete HMIS entry

### Query Parameters

When fetching HMIS entries, you can use the following query parameters:
- `dataSetId` (required) - The ID of the dataset (e.g., 'HMIS_105_01')
- `section` (required) - The section number
- `facilityId` (required) - The ID of the health facility
- `month` (optional) - The reporting month (1-12)
- `year` (optional) - The reporting year

## Data Model

### HMIS Entry Schema

```javascript
{
  dataSetId: String,      // e.g., 'HMIS_105_01'
  section: Number,        // Section number
  facilityId: String,     // Facility identifier
  reportingPeriod: {
    month: Number,        // 1-12
    year: Number         // e.g., 2024
  },
  data: Map,             // Actual form data
  metadata: {
    submittedBy: String,
    submittedAt: Date,
    lastModifiedBy: String,
    lastModifiedAt: Date,
    status: String       // 'draft', 'submitted', 'approved', 'rejected'
  }
}
``` 