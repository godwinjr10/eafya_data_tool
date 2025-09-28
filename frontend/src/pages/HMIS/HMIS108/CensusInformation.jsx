import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const CensusInformation = ({ section, selectedMonth, selectedYear }) => {
  const [censusData, setCensusData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCensusData = useCallback(async () => {
    try {
      setLoading(true);
      const monthIndex =
        [
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
        ].indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const reportMonth = `${selectedYear}${formattedMonth}`;

      const response = await API.get(
        `/hmis108/census-information?report_month=${reportMonth}`
      );
      setCensusData(response.data);
    } catch (error) {
      console.error("Error fetching census data:", error);
      setCensusData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchCensusData();
    }
  }, [selectedMonth, selectedYear, fetchCensusData]);

  // Form input component with consistent styling
  const FormInput = ({ value, onChange, placeholder = "0" }) => (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control form-control-sm compact-input"
      min="0"
      readOnly
    />
  );

  // Spinner component
  const Spinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ padding: '2rem' }}>
      <div className="spinner-border text-primary" role="status">
      </div>
    </div>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <style jsx>{`
        .compact-input {
          font-size: 0.65rem !important;
          padding: 0.2rem 0.3rem !important;
          height: 24px !important;
          text-align: center !important;
          border: 1px solid #ced4da !important;
        }
        .compact-table td {
          padding: 0.25rem 0.3rem !important;
          vertical-align: middle !important;
          font-size: 0.7rem !important;
          line-height: 1.1 !important;
        }
        .compact-table th {
          padding: 0.3rem 0.3rem !important;
          font-size: 0.7rem !important;
          font-weight: 500 !important;
        }
        .compact-table {
          font-size: 0.7rem !important;
          width: 100% !important;
          table-layout: fixed !important;
        }
        .section-subheader {
          font-size: 0.8rem !important;
          margin-bottom: 0.4rem !important;
          font-weight: 500 !important;
        }
        .section-header {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
        }
        .data-entry-table {
          font-size: 0.7rem !important;
          width: 100% !important;
          table-layout: fixed !important;
        }
        .table-header-bg {
          background-color: #f8f9fa !important;
        }
        .section-title-bg {
          background-color: #6c757d !important;
          color: white !important;
          font-weight: bold !important;
        }
        .full-width-table {
          width: 100% !important;
          min-width: 100% !important;
        }
        .table-container {
          width: 100% !important;
          overflow-x: auto !important;
        }
        .compact-table th:first-child,
        .compact-table td:first-child {
          width: 25% !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: auto !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
      `}</style>

      <div className="section-header mb-3">
        2.8 CENSUS INFORMATION
      </div>

      <div className="table-container mb-4">
        <table className="data-entry-table compact-table full-width-table">
          <thead>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}>Ward</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Number of Beds</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Admissions</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Deaths</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Patient Days</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Average Length of Stay (Days)</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Average Occupancy</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Bed Occupancy (%)</th>
            </tr>
          </thead>
          <tbody>
            {censusData.map((ward, index) => (
              <tr key={index}>
                <td>
                  {ward.Wards}
                </td>
                <td className="text-center">
                  <FormInput value={ward["A Cl01. No. of beds"] || "0"} />
                </td>
                <td className="text-center">
                  <FormInput value={ward["B Cl02. No. of admissions"] || "0"} />
                </td>
                <td className="text-center">
                  <FormInput value={ward["C Cl03. No. of deaths"] || "0"} />
                </td>
                <td className="text-center">
                  <FormInput value={ward["D Cl04. Patient days"] || "0"} />
                </td>
                <td className="text-center">
                  <FormInput value={ward["E Cl05. Average length of stay (E=D/B)"] || "0"} />
                </td>
                <td className="text-center">
                  <FormInput value={ward["F Cl06. Average occupancy (F=D/30 days)"] || "0"} />
                </td>
                <td className="text-center">
                  <FormInput value={ward["G Cl07. Bed occupancy (F/A)x100"] || "0"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CensusInformation;
