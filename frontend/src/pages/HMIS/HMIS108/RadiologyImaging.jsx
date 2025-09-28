import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const RadiologyImaging = ({ section, selectedMonth, selectedYear }) => {
  const [imagingData, setImagingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImagingData = useCallback(async () => {
    try {
      setLoading(true);
      const monthIndex = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ].indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const reportMonth = `${selectedYear}${formattedMonth}`;

      const response = await API.get(
        `/hmis108/patient-imaging?report_month=${reportMonth}`
      );
      setImagingData(response.data || []);
      console.log("Radiology imaging data:", response.data);
    } catch (error) {
      console.error("Error fetching radiology imaging data:", error);
      setImagingData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchImagingData();
    }
  }, [selectedMonth, selectedYear, fetchImagingData]);

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
          font-size: 0.6rem !important;
          padding: 0.15rem 0.2rem !important;
          height: 22px !important;
          text-align: center !important;
          border: 1px solid #ced4da !important;
          width: 60px !important;
          min-width: 60px !important;
          max-width: 60px !important;
        }
        .compact-table td {
          padding: 0.2rem 0.25rem !important;
          vertical-align: middle !important;
          font-size: 0.7rem !important;
          line-height: 1.1 !important;
        }
        .compact-table th {
          padding: 0.25rem 0.25rem !important;
          font-size: 0.7rem !important;
          font-weight: 500 !important;
        }
        .compact-table .ps-4 {
          padding-left: 0.8rem !important;
        }
        .compact-table .ps-5 {
          padding-left: 1.2rem !important;
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
          background-color: #f8f9fa !important;
          color: black !important;
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
          width: 60% !important;
          text-align: left !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: 10% !important;
          text-align: center !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        RADIOLOGY AND IMAGING
      </div>

      <div className="table-container">
        <table className="table table-bordered compact-table full-width-table">
          <thead className="table-header-bg">
            <tr>
              <th style={{ fontWeight: "normal" }}>Category</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-4 years</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5 and over</th>
            </tr>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}></th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Male</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Female</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Male</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Female</th>
            </tr>
          </thead>
          <tbody>
            {imagingData.length > 0 ? (
              imagingData.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.imaging_name}
                  </td>
                  <td className="text-center">
                    <FormInput value={item.male_0_4 || 0} />
                  </td>
                  <td className="text-center">
                    <FormInput value={item.female_0_4 || 0} />
                  </td>
                  <td className="text-center">
                    <FormInput value={item.male_5_plus || 0} />
                  </td>
                  <td className="text-center">
                    <FormInput value={item.female_5_plus || 0} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No radiology imaging data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RadiologyImaging;
