import React, { useState, useEffect, useCallback } from "react";
import API from "../helpers/api";
import ConditionsReport from "./ConditionsReport";
import CommoditiesReport from "./CommoditiesReport";
import LabReport from "./LabReport";
import ConditionsPrintReport from "./ConditionsPrintReport";

import MCHForm from "../pages/HMIS/MCH";
import LabTestForm from "../pages/HMIS/LabTestForm";
import MedicinesForm from "../pages/HMIS/MedicinesForm";
import ConditionsForm from "../pages/HMIS/conditions";
import HMIS108 from "../pages/HMIS/HMIS108";
import HMIS108Report from "./HMIS108Report";
import MCHReport from "./MCHReport";


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
    component: MCHReport,
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
  HMIS_108: {
    endpoint: "/downloads/hmis108",
    component: HMIS108Report,
    title: "HMIS 108 - Inpatient Monthly Report",
    dataset: "HMIS_108",
    dhisEndpoint: "/dhis/sync",
  },
};

const DataEntryForm = ({ section, dataSetId, onDataSetChange, onSectionChange }) => {
  const [loading, setLoading] = useState(false);
  const [pushingToDHIS2, setPushingToDHIS2] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [sections, setSections] = useState([]);
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

  const fetchSections = useCallback(async () => {
    try {
      const response = await API.get("/datasets");
      const currentDataset = response.data.datasets.find(dataset => dataset.dataset_id === dataSetId);
      if (currentDataset && currentDataset.sections) {
        setSections(currentDataset.sections);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  }, [dataSetId]);

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    if (dataSetId) {
      fetchSections();
    }
  }, [dataSetId, fetchSections]);

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

      const response = await API.post('/dhis/sync', {
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

    if (dataSetId === "HMIS_105_01") {
      // Handle conditions report with custom print functionality
      await handleConditionsPrint();
      return;
    }

    if (!reportConfig || !reportConfig.component) {
      alert("Report generation not yet implemented for this section");
      return;
    }

    try {
      setLoading(true);
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const reportMonth = `${selectedYear}${formattedMonth}`;

      // For HMIS 108 and MCH reports, don't send section parameter to get all sections
      const endpoint =
        dataSetId === "HMIS_108" || dataSetId === "HMIS_105_02"
          ? `${reportConfig.endpoint}?report_month=${reportMonth}`
          : `${reportConfig.endpoint}?report_month=${reportMonth}&section=${section}`;

      const response = await API.get(endpoint);

      setReportProps({
        data: response.data,
        reportMonth: reportMonth,
        type: dataSetId,
        section: section,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleConditionsPrint = async () => {
    try {
      setLoading(true);
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const period = `${selectedYear}${formattedMonth}`;

      const promises = [];
      let printData = {
        attendance: [],
        reattendance: [],
        conditions: [],
        allSections: []
      };

      // Fetch attendance data
      promises.push(
        API.get(`/attendance?report_month=${period}`).then(response => {
          printData.attendance = response.data || [];
        }).catch(error => {
          console.error('Error fetching attendance:', error);
          printData.attendance = [];
        })
      );

      // Fetch reattendance data
      promises.push(
        API.get(`/attendance/reattendance?report_month=${period}`).then(response => {
          printData.reattendance = response.data || [];
        }).catch(error => {
          console.error('Error fetching reattendance:', error);
          printData.reattendance = [];
        })
      );

      if (!section || section === '') {
        // Fetch all sections data
        const conditionsPromises = sections.filter(s => s.section_id !== '1.1').map(async (sectionItem) => {
          try {
            const response = await API.get(`/conditions?report_month=${period}&section_id=${sectionItem.section_id}`);
            return {
              sectionId: sectionItem.section_id,
              sectionName: sectionItem.section_name,
              data: response.data || []
            };
          } catch (error) {
            console.error(`Error fetching data for section ${sectionItem.section_id}:`, error);
            return {
              sectionId: sectionItem.section_id,
              sectionName: sectionItem.section_name,
              data: []
            };
          }
        });
        promises.push(Promise.all(conditionsPromises).then(results => {
          printData.allSections = results;
        }));
      } else if (section === '1.1') {
        // Only attendance data for section 1.1
        printData.allSections = [];
      } else {
        // Fetch specific section data
        promises.push(
          API.get(`/conditions?report_month=${period}&section_id=${section}`).then(response => {
            printData.conditions = response.data || [];
          }).catch(error => {
            console.error('Error fetching conditions:', error);
            printData.conditions = [];
          })
        );
      }

      await Promise.all(promises);
      
      // Create a temporary ConditionsPrintReport component to generate PDF directly
      const tempPrintData = {
        ...printData,
        reportMonth: `${selectedMonth} ${selectedYear}`,
        section: section,
        facilityName: "Health Facility",
        printedBy: "System User",
        printDate: new Date().toLocaleDateString()
      };

      // Generate PDF directly without modal
      await generateConditionsPDF(tempPrintData);
    } catch (error) {
      console.error("Error preparing conditions print data:", error);
      alert("Failed to prepare print data");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate PDF directly without modal
  const generateConditionsPDF = async (data) => {
    try {
      // Create a temporary div to render the print component
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Render the print component temporarily
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      
      const React = await import('react');
      root.render(React.createElement(ConditionsPrintReport, {
        data: data,
        reportMonth: data.reportMonth,
        section: data.section,
        facilityName: data.facilityName,
        printedBy: data.printedBy,
        printDate: data.printDate,
        onGeneratePDF: () => {
          // Clean up after PDF generation
          root.unmount();
          document.body.removeChild(tempDiv);
        }
      }));

      // Wait a bit for the component to render, then trigger PDF generation
      setTimeout(() => {
        const printComponent = tempDiv.querySelector('.print-report');
        if (printComponent) {
          generatePDFFromElement(printComponent, data);
        }
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF directly:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Function to generate PDF from HTML element
  const generatePDFFromElement = async (element, data) => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(element, {
        scale: 1.25,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      if (canvas.width === 0 || canvas.height === 0) {
        alert('Failed to capture report content. Please try again.');
        return;
      }

      const imgData = canvas.toDataURL('image/png', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `HMIS_105_01_Conditions_Report_${data.reportMonth.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
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
        <div className="col-md-4">
          <label className="form-label">Data Set</label>
          <select
            className="form-select"
            value={dataSetId}
            onChange={(e) => onDataSetChange(e.target.value)}
          >
            {datasets.map((dataSet, index) => (
              <option
                key={`${dataSet.dataset_id}-${index}`}
                value={dataSet.dataset_id}
              >
                {dataSet.dataset_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Section</label>
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={section}
              onChange={(e) => onSectionChange(e.target.value)}
            >
              <option value="">All Sections</option>
              {sections.map((sectionItem, index) => (
                <option
                  key={`${sectionItem.section_id}-${index}`}
                  value={sectionItem.section_id}
                >
                  {sectionItem.section_id} - {sectionItem.section_name}
                </option>
              ))}
            </select>
            {section && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onSectionChange("")}
                title="Clear selection to show all sections"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-md-4">
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
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-printer me-2"></i>
                  Print Report
                </>
              )}
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
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            section={section}
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
      case "HMIS_108":
        return (
          <HMIS108
            section={section}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
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
          section={reportProps.section}
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
