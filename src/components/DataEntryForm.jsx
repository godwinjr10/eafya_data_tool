import React, { useState, useEffect } from "react";
import API from "../helpers/api";
<<<<<<< HEAD
import '../styles/dhis2.css';
import ConditionsReport from './ConditionsReport';
import CommoditiesReport from './CommoditiesReport';
import LabReport from './LabReport';
=======
import ConditionsReport from "./ConditionsReport";
import CommoditiesReport from "./CommoditiesReport";
import LabReport from "./LabReport";
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459

import MCHForm from "../pages/HMIS/MCH";
import LabTestForm from "../pages/HMIS/LabTestForm";
import MedicinesForm from "../pages/HMIS/MedicinesForm";
import ConditionsForm from "../pages/HMIS/conditions";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Define report configurations
const REPORT_CONFIGS = {
<<<<<<< HEAD
  'HMIS_105_01': {
    endpoint: '/downloads/conditions',
    component: ConditionsReport,
    title: 'Conditions Report'
  },
  'HMIS_105_02': {
    endpoint: '/downloads/mch',
    component: null, // Add MCH report component when ready
    title: 'MCH Report'
  },
  'HMIS_105_06': {
    endpoint: '/downloads/commodities',
    component: CommoditiesReport,
    title: 'Commodities Report'
  },
  'HMIS_105_10': {
    endpoint: '/downloads/labtests',
    component: LabReport,
    title: 'Lab Tests Report'
  }
=======
  HMIS_105_01: {
    endpoint: "/downloads/conditions",
    component: ConditionsReport,
    title: "Conditions Report",
  },
  HMIS_105_02: {
    endpoint: "/downloads/mch",
    component: null, // Add MCH report component when ready
    title: "MCH Report",
  },
  HMIS_105_06: {
    endpoint: "/downloads/commodities",
    component: CommoditiesReport,
    title: "Commodities Report",
  },
  HMIS_105_10: {
    endpoint: "/downloads/labtests",
    component: LabReport,
    title: "Lab Tests Report",
  },
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
};

const DataEntryForm = ({ section, dataSetId, onDataSetChange }) => {
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [reportProps, setReportProps] = useState(null);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    months[currentDate.getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchDatasets = async () => {
    try {
<<<<<<< HEAD
      const response = await API.get('/datasets');
      setDatasets(response.data.datasets);
    } catch (error) {
      console.error('Error fetching hierarchy levels:', error);
=======
      const response = await API.get("/datasets");
      setDatasets(response.data.datasets);
    } catch (error) {
      console.error("Error fetching hierarchy levels:", error);
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handlePrintReport = async () => {
    const reportConfig = REPORT_CONFIGS[dataSetId];
<<<<<<< HEAD
    
    if (!reportConfig || !reportConfig.component) {
      alert('Report generation not yet implemented for this section');
=======

    if (!reportConfig || !reportConfig.component) {
      alert("Report generation not yet implemented for this section");
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
      return;
    }

    try {
      setLoading(true);
      const monthIndex = months.indexOf(selectedMonth) + 1;
<<<<<<< HEAD
      const formattedMonth = monthIndex.toString().padStart(2, '0');
      const reportMonth = `${selectedYear}${formattedMonth}`;

      const response = await API.get(`${reportConfig.endpoint}?report_month=${reportMonth}`);
      
      setReportProps({
        data: response.data,
        reportMonth: reportMonth,
        type: dataSetId
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      alert('Failed to generate report');
=======
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const reportMonth = `${selectedYear}${formattedMonth}`;

      const response = await API.get(
        `${reportConfig.endpoint}?report_month=${reportMonth}`
      );

      setReportProps({
        data: response.data,
        reportMonth: reportMonth,
        type: dataSetId,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      alert("Failed to generate report");
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
    } finally {
      setLoading(false);
    }
  };

  // Effect to clean up reportProps after PDF is generated
  useEffect(() => {
    if (reportProps) {
      const timer = setTimeout(() => {
        setReportProps(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [reportProps]);

  const renderFormHeader = () => (
    <div className="p-4 border rounded mb-4">
      <div className="row g-2 ">
        <div className="col-md-6">
          <label className="form-label">Data Set</label>
          <select
            className="form-select"
            value={dataSetId}
            onChange={(e) => onDataSetChange(e.target.value)}
          >
            {Object.values(datasets).map((dataSet) => (
              <option key={dataSet.dataset_id} value={dataSet.dataset_id}>
                {dataSet.dataset_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="validation-button">
              <i className="bi bi-check2-circle me-2"></i>
              Push To DHIS2
            </button>
<<<<<<< HEAD
            <button 
              className="btn btn-secondary" 
=======
            <button
              className="btn btn-secondary"
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
              onClick={handlePrintReport}
              disabled={loading}
            >
              <i className="bi bi-printer me-2"></i>
<<<<<<< HEAD
              {loading ? 'Generating...' : 'Print Report'}
=======
              {loading ? "Generating..." : "Print Report"}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
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
              const [month, year] = e.target.value.split(" ");
              setSelectedMonth(month);
              setSelectedYear(parseInt(year));
            }}
          >
            {months.map((month) => (
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
      case "HMIS_105_01":
        return (
          <ConditionsForm
            section={section}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
      case "HMIS_105_02":
        return (
          <MCHForm
            section={section}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
      case "HMIS_105_06":
        return (
          <MedicinesForm
            section={section}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            section_id="6.1"
          />
        );
      case "HMIS_105_10":
        return (
          <LabTestForm
            section={section}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            section_id="10.2.1"
          />
        );
      default:
        return <div>Please select a data set</div>;
    }
  };

  const renderReport = () => {
    if (!reportProps) return null;

    const ReportComponent = REPORT_CONFIGS[reportProps.type]?.component;
    if (!ReportComponent) return null;

    return (
<<<<<<< HEAD
      <div style={{ display: 'none' }}>
        <ReportComponent 
          data={reportProps.data} 
          reportMonth={reportProps.reportMonth} 
=======
      <div style={{ display: "none" }}>
        <ReportComponent
          data={reportProps.data}
          reportMonth={reportProps.reportMonth}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
        />
      </div>
    );
  };

  return (
    <div>
      {renderFormHeader()}
      {renderFormContent()}
      {renderReport()}
      {loading && (
<<<<<<< HEAD
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <div style={{
            marginTop: '20px',
            fontSize: '16px',
            color: '#333',
          }}>
=======
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "16px",
              color: "#333",
            }}
          >
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            Generating Report...
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryForm;
