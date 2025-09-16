import React, { useState, useEffect, useCallback } from "react";
import API from "../../helpers/api";

const MedicinesForm = ({ selectedMonth, selectedYear, section_id }) => {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const getMonthNumber = (monthName) => {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return months[monthName] || '01';
  };

  const fetchCommodities = useCallback(async () => {
    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);
      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/commodities?report_month=${formattedMonth}&section_id=${section_id}`);
      
      // Format the numbers to remove decimal points and add thousand separators
      const formattedData = (response.data || []).map(item => ({
        ...item,
        "Quantity Consumed": Math.round(parseFloat(item["Quantity Consumed"] || 0)).toLocaleString(),
        "Days out Stock": Math.round(parseFloat(item["Days out Stock"] || 0)).toLocaleString(),
        "Stock on Hand": Math.round(parseFloat(item["Stock on Hand"] || 0)).toLocaleString(),
        "Quantity Expired": Math.round(parseFloat(item["Quantity Expired"] || 0)).toLocaleString()
      }));
      
      setMedicines(formattedData);
    } catch (error) {
      console.error('Error fetching commodities:', error.response || error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, section_id]);

  useEffect(() => {
    if (selectedMonth && section_id) {
      fetchCommodities();
    }
  }, [selectedMonth, section_id, fetchCommodities]);

  // Spinner component
  const Spinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ padding: '2rem' }}>
      <div className="spinner-border text-primary" role="status">
      </div>
    </div>
  );

  // No data card component
  const NoDataCard = () => (
    <div className="card" style={{ margin: '1rem 0', padding: '1rem' }}>
      <div className="card-body text-center">
        <div className="mb-3">
          <i className="fas fa-chart-line fa-3x text-muted"></i>
        </div>
        <h5 className="card-title text-muted">No Commodities Data Available</h5>
        <p className="card-text text-muted">
          No commodities data found for the selected month ({selectedMonth} {selectedYear}). 
          Please check if data has been uploaded for this period.
        </p>
      </div>
    </div>
  );

  // Check if we have any data
  const hasData = medicines.length > 0;

  return (
    <div className="">
      <div className="section-header">
        6 ESSENTIAL MEDICINES AND HEALTH SUPPLIES
      </div>

      <div className="section-subheader mb-3">
        6.1 STOCK STATUS (Out of stock means that there was NONE left in your health unit STORE)
      </div>

      <div className="mb-3">
        <strong>Note:</strong> The primary data sources for this sub-section are the Stock books and Stock Cards
      </div>

      {loading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <>

        <table className="data-entry-table">
          <thead>
            <tr>
              <th>HMIS Data Element Name</th>
              <th>Quantity Consumed</th>
              <th>Days out of stock</th>
              <th>Stock on hand</th>
              <th>Quantity Expired</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(medicine => (
              <tr key={medicine.hmis_code}>
                <td>{medicine.hmis_name}</td>
                <td>
                  <input
                    type="text"
                    value={medicine["Quantity Consumed"]}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine["Days out Stock"]}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine["Stock on Hand"]}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine["Quantity Expired"]}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
        </>
      )}
    </div>
  );
};

export default MedicinesForm; 