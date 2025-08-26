# eAFYA Mapping Component

This component provides a comprehensive interface for viewing and managing eAFYA mappings between HMIS (Health Management Information System) and eAFYA products.

## Features

- **Data Display**: Shows complete mapping information including HMIS codes, names, sections, eAFYA product mappings, and DHIS2 data elements
- **Filtering**: Filter mappings by section or search across all mapping fields
- **View Details**: Click the eye icon to view complete mapping information in a modal dialog
- **Edit Capability**: Click the edit icon to modify mappings (ready for API integration)
- **Responsive Design**: Follows the same design patterns and styles as the main mapping component

## API Endpoint

The component reads data from:
```
GET /mapping/eafya/commodities
```

## Data Structure

The API returns mapping objects with the following structure:

```json
{
  "id": "unique_id",
  "section_id": "section_identifier",
  "section_name": "Section Display Name",
  "hmis_code": "HMIS_CODE",
  "hmis_name": "HMIS Display Name",
  "eafya_product_id": "eafya_product_id",
  "eafya_product_name": "eAFYA Product Name",
  "dhis2_data_element_id": "dhis2_element_id",
  "data_element_name": "DHIS2 Data Element Name"
}
```

## Components

### EafyaMapping.jsx
The main component that displays the mapping table and handles all interactions.

### EafyaMappingDemo.jsx
A demo page that showcases the component with navigation and feature explanations.

## Usage

### Basic Usage
```jsx
import EafyaMapping from './EafyaMapping';

function App() {
  return (
    <div>
      <EafyaMapping />
    </div>
  );
}
```

### With Demo Page
```jsx
import EafyaMappingDemo from './EafyaMappingDemo';

function App() {
  return (
    <div>
      <EafyaMappingDemo />
    </div>
  );
}
```

## Styling

The component uses the existing `styles.css` file and follows the established design patterns:

- Consistent padding and spacing (20px horizontal padding)
- White background cards with subtle shadows
- Blue primary buttons (#2196f3)
- Gray secondary buttons (#f5f5f5)
- Responsive table design
- Hover effects on interactive elements

## State Management

The component manages the following state:

- `mappings`: Array of mapping data from the API
- `loading`: Loading state for API calls
- `searchTerm`: Current search filter
- `selectedSection`: Currently selected section filter
- `sections`: Available sections for filtering
- `dialogState`: Modal dialog state (view/edit mode)

## API Integration

The component is ready for full CRUD operations:

- **Read**: Currently implemented (fetches from `/mapping/eafya/commodities`)
- **Update**: Structure ready, needs API endpoint implementation
- **Create**: Can be extended with add functionality
- **Delete**: Can be extended with delete functionality

## Customization

The component can be easily customized by:

1. Modifying the table columns in `renderMappingsTable()`
2. Adding new filter options in `renderControls()`
3. Extending the dialog content in `renderMappingDialog()`
4. Adding new API endpoints for different mapping types

## Dependencies

- React (with hooks)
- React Icons (FaEye, FaEdit, FaPlus, FaTrash)
- Axios for API calls
- Existing CSS styles from `styles.css`
