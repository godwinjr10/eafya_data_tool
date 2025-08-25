import React, { useState, useEffect } from "react";
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

  const fetchCommodities = async () => {
    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);
      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/commodities?report_month=${formattedMonth}&section_id=${section_id}`);
      
      // Format the numbers to remove decimal points
      const formattedData = response.data.map(item => ({
        ...item,
        qty_consumed: Math.round(parseFloat(item.qty_consumed || 0)).toString(),
        days_out_of_stock: Math.round(parseFloat(item.days_out_of_stock || 0)).toString(),
        stock_level: Math.round(parseFloat(item.stock_level || 0)).toString(),
        quantity_expired: Math.round(parseFloat(item.quantity_expired || 0)).toString()
      }));
      
      setMedicines(formattedData);
    } catch (error) {
      console.error('Error fetching commodities:', error.response || error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && section_id) {
      fetchCommodities();
    }
  }, [selectedMonth, section_id]);

  return (
    <div className="">
      <>
        <div className="section-header">
          6 ESSENTIAL MEDICINES AND HEALTH SUPPLIES
        </div>

        <div className="section-subheader mb-3">
          6.1 STOCK STATUS (Out of stock means that there was NONE left in your health unit STORE)
        </div>

        <div className="mb-3">
          <strong>Note:</strong> The primary data sources for this sub-section are the Stock books and Stock Cards
        </div>

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
              <tr key={medicine.hmis_dataelement_code}>
                <td>{medicine.hmis_dataelement_name}</td>
                <td>
                  <input
                    type="text"
                    value={medicine.qty_consumed}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine.days_out_of_stock}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine.stock_level}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine.quantity_expired}
                    readOnly
                    className="form-control form-control-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default MedicinesForm; 