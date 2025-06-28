import React, { useState, useEffect } from "react";
import API from "../helpers/api";
import '../styles/dhis2.css';

import MCHForm from '../pages/HMIS/MCH';
import LabTestForm from '../pages/HMIS/LabTestForm';
import MedicinesForm from '../pages/HMIS/MedicinesForm';
import ConditionsForm from '../pages/HMIS/conditions';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DataEntryForm = ({ section, dataSetId, onDataSetChange }) => {

  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState([]);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(months[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchDatasets = async () => {
    try {
        const response = await API.get('/datasets');
        setDatasets(response.data.datasets);
    } catch (error) {
        console.error('Error fetching hierarchy levels:', error);
    }
};

useEffect(() => {
  fetchDatasets();
}, []);

  const renderFormHeader = () => (
    <div className="report-selector mb-4">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Data Set</label>
          <select
            className="form-select"
            value={dataSetId}
            onChange={(e) => onDataSetChange(e.target.value)}
          >
            {Object.values(datasets).map(dataSet => (
              <option key={dataSet.dataset_id} value={dataSet.dataset_id}>
                {dataSet.dataset_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="validation-button">
              <i className="bi bi-check2-circle me-2"></i>
              Push To DHIS2
            </button>
            <button className="btn btn-secondary">
              <i className="bi bi-printer me-2"></i>
              Print Report
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <label className="form-label">Period</label>
          <select 
            className="form-select"
            value={`${selectedMonth} ${selectedYear}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split(' ');
              setSelectedMonth(month);
              setSelectedYear(parseInt(year));
            }}
          >
            {months.map(month => (
              <option key={month} value={`${month} ${selectedYear}`}>
                {month} {selectedYear}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button 
            className="btn btn-primary me-2"
            onClick={() => setSelectedYear(selectedYear - 1)}
          >
            Prev year
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const currentYear = new Date().getFullYear();
              if (selectedYear < currentYear) {
                setSelectedYear(selectedYear + 1);
              }
            }}
            disabled={selectedYear >= new Date().getFullYear()}
          >
            Next year
          </button>
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (dataSetId) {
      case 'HMIS_105_01':
        return <ConditionsForm section={section} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
      case 'HMIS_105_02':
        return <MCHForm section={section} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
      case 'HMIS_105_06':
        return <MedicinesForm section={section} selectedMonth={selectedMonth} selectedYear={selectedYear} section_id='6.1' />;
      case 'HMIS_105_10':
        return <LabTestForm section={section} selectedMonth={selectedMonth} selectedYear={selectedYear} section_id='10.2.1' />;
      default:
        return <div>Please select a data set</div>;
    }
  };

  return (
    <div>
      {renderFormHeader()}
      {renderFormContent()}
    </div>
  );
};

export default DataEntryForm;