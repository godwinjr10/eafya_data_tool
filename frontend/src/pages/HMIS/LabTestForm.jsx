import React, { useState, useEffect } from "react";
import API from "../../helpers/api";

const LabTestForm = ({ selectedMonth, selectedYear, section_id }) => {
  const [loading, setLoading] = useState(false);
  const [labTests, setLabTests] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const getMonthNumber = (monthName) => {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return months[monthName] || '01';
  };

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const monthNumber = getMonthNumber(selectedMonth);
      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/labtests?report_month=${formattedMonth}&section_id=${section_id}`);
      
      setLabTests(response.data);
      
      // Initialize form data with fetched values
      const initialFormData = {};
      response.data.forEach(test => {
        initialFormData[test.hmis_code] = {
          total_cases: test.total_cases || 0,
          positive_cases: test.positive_cases || 0
        };
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error fetching lab tests:', error.response || error);
      setError('Failed to fetch lab tests data. Please try again.');
      setLabTests([]);
      setFormData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && section_id) {
      fetchLabTests();
    }
  }, [selectedMonth, section_id]);

  const handleInputChange = (hmisCode, field, value) => {
    setFormData(prev => ({
      ...prev,
      [hmisCode]: {
        ...prev[hmisCode],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const renderClientVisitsSection = () => (
    <>
      <div className="section-header">
        10.1 CLIENT VISITS AND SPECIMEN COLLECTION
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Out Patient</th>
            <th>In Patient</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10.1.1. Total Number of laboratory client visits</td>
            <td>
              <input type="number" min="0" className="form-control form-control-sm" />
            </td>
            <td>
              <input type="number" min="0" className="form-control form-control-sm" />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="section-subheader mt-4">
        10.1.2. Number of Specimen Collected at Facility and Received from other facilities
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Blood</th>
            <th>Stool/Rectal swab</th>
            <th>Urine</th>
            <th>Sputum</th>
            <th>CSF</th>
            <th>Biopsy</th>
            <th>Pus Swab</th>
            <th>Genital Swab</th>
            <th>Skin Snip</th>
            <th>Others</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SC01. Collected(IN)</td>
            {Array(10).fill().map((_, i) => (
              <td key={i}>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            ))}
          </tr>
          <tr>
            <td>SC02. Received(OUT)</td>
            {Array(10).fill().map((_, i) => (
              <td key={i}>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderLabTestsSection = () => (
    <div className="col-12 mb-4">
      <div className="section-header">
        {section_id === '10.2' ? '10.2 LABORATORY TESTS' : '10.2.1 LABORATORY ROUTINE TESTS'}
      </div>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>HMIS Code</th>
            <th>Lab Test Name</th>
            <th>Number Done</th>
            <th>Number Positive</th>
          </tr>
        </thead>
        <tbody>
          {labTests.map(test => (
            <tr key={test.hmis_code}>
              <td>{test.category}</td>
              <td>{test.hmis_code}</td>
              <td>{test.hmis_name}</td>
              <td>
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm"
                  value={formData[test.hmis_code]?.total_cases || 0}
                  onChange={(e) => handleInputChange(test.hmis_code, 'total_cases', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm"
                  value={formData[test.hmis_code]?.positive_cases || 0}
                  onChange={(e) => handleInputChange(test.hmis_code, 'positive_cases', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lab-test-container">
      {renderClientVisitsSection()}
      <div className="row">
        {renderLabTestsSection()}
      </div>
    </div>
  );
};

export default LabTestForm; 