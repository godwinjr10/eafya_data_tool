import React, { useState, useEffect } from "react";
import API from "../helpers/api";
import ConditionsReport from "./ConditionsReport";
import CommoditiesReport from "./CommoditiesReport";
import LabReport from "./LabReport";

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
  HMIS_105_01: {
    endpoint: "/downloads/conditions",
    component: ConditionsReport,
    title: "Conditions Report",
    dataset: "RtEYsASU7PG",
    dhisEndpoint: "/dhis/sync",
  },
  HMIS_105_02: {
    endpoint: "/downloads/mch",
    component: null,
    title: "MCH Report",
    dataset: "RtEYsASU7PG",
    dhisEndpoint: "/dhis/sync",
  },
  HMIS_105_06: {
    endpoint: "/downloads/commodities",
    component: CommoditiesReport,
    title: "Commodities Report",
    dataset: "VDhwrW9DiC1",
    dhisEndpoint: "/dhis/commodities",
  },
  HMIS_105_10: {
    endpoint: "/downloads/labtests",
    component: LabReport,
    title: "Lab Tests Report",
    dataset: "RtEYsASU7PG",
    dhisEndpoint: "/dhis/sync",
  },
};

const DataEntryForm = ({ section, dataSetId, onDataSetChange }) => {
  const [loading, setLoading] = useState(false);
  const [pushingToDHIS2, setPushingToDHIS2] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [reportProps, setReportProps] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: "", text: "" });

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    months[currentDate.getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchDatasets = async () => {
    try {
      const response = await API.get("/datasets");
      setDatasets(response.data.datasets);
    } catch (error) {
      console.error("Error fetching hierarchy levels:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handlePushToDHIS2 = async () => {
    try {
      setPushingToDHIS2(true);
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const period = `${selectedYear}${formattedMonth}`;

      const reportConfig = REPORT_CONFIGS[dataSetId];
      if (!reportConfig) {
        throw new Error("Dataset configuration not found");
      }

      const response = await API.post(reportConfig.dhisEndpoint, {
        dataset: reportConfig.dataset,
        period: period,
      });

      if (response.data.status === "success") {
        setModalMessage({
          type: "success",
          text: `Successfully pushed ${
            response.data.details?.total || 0
          } records to DHIS2`,
        });
      } else {
        setModalMessage({
          type: "error",
          text:
            response.data.failureDetails?.[0]?.error ||
            "Unknown error occurred while pushing data",
        });
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error pushing to DHIS2:", error);
      setModalMessage({
        type: "error",
        text: error.message || "Failed to push data to DHIS2",
      });
      setShowModal(true);
    } finally {
      setPushingToDHIS2(false);
    }
  };

  const handlePrintReport = async () => {
    const reportConfig = REPORT_CONFIGS[dataSetId];

    if (!reportConfig || !reportConfig.component) {
      alert("Report generation not yet implemented for this section");
      return;
    }

    try {
      setLoading(true);
      const monthIndex = months.indexOf(selectedMonth) + 1;
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
            {Object.values(datasets).map((dataSet, index) => (
              <option
                key={`${dataSet.dataset_id}-${index}`}
                value={dataSet.dataset_id}
              >
                {dataSet.dataset_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="validation-button"
              onClick={handlePushToDHIS2}
              disabled={pushingToDHIS2}
            >
              <i className="bi bi-check2-circle me-2"></i>
              {pushingToDHIS2 ? "Pushing to DHIS2..." : "Push To DHIS2"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handlePrintReport}
              disabled={loading}
            >
              <i className="bi bi-printer me-2"></i>
              {loading ? "Generating..." : "Print Report"}
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

  const renderMessageModal = () => {
    if (!showModal) return null;

    const isSuccess = modalMessage.type === "success";
    const icon = isSuccess ? "check-circle-fill" : "exclamation-circle-fill";
    const themeColor = isSuccess ? "#28a745" : "#dc3545";

    return (
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className="modal-dialog modal-sm"
          style={{
            marginTop: "20px",
            maxWidth: "320px",
          }}
        >
          <div
            className="modal-content border-0 shadow"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              className="modal-body p-0"
              style={{
                backgroundColor: "#f8f9fa",
              }}
            >
              <div
                className="d-flex flex-column align-items-center text-center p-4"
                style={{
                  backgroundColor: "white",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    color: themeColor,
                    fontSize: "3rem",
                    marginBottom: "0.5rem",
                    lineHeight: 1,
                  }}
                >
                  <i className={`bi bi-${icon}`}></i>
                </div>
                <h5
                  style={{
                    color: themeColor,
                    margin: "0.5rem 0",
                    fontWeight: "600",
                  }}
                >
                  {isSuccess ? "Success!" : "Error"}
                </h5>
              </div>
              <div className="p-3">
                <p
                  className="mb-3 text-center"
                  style={{
                    fontSize: "0.95rem",
                    color: "#666",
                  }}
                >
                  {modalMessage.text}
                </p>
                <button
                  type="button"
                  className="btn w-100"
                  style={{
                    backgroundColor: themeColor,
                    color: "white",
                    border: "none",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    if (!reportProps) return null;

    const ReportComponent = REPORT_CONFIGS[reportProps.type]?.component;
    if (!ReportComponent) return null;

    return (
      <div style={{ display: "none" }}>
        <ReportComponent
          data={reportProps.data}
          reportMonth={reportProps.reportMonth}
        />
      </div>
    );
  };

  return (
    <div>
      {renderFormHeader()}
      {renderFormContent()}
      {renderReport()}
      {renderMessageModal()}
    </div>
  );
};

export default DataEntryForm;
