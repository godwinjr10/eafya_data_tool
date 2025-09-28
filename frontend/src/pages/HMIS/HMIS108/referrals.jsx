import React, { useEffect, useState, useCallback } from "react";
// import API from "../../../helpers/api"; // Commented out to avoid errors

const Referrals = ({ selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(false);

  const fetchReferralsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Commented out API call to avoid errors
      // const monthIndex = [
      //   "January", "February", "March", "April", "May", "June",
      //   "July", "August", "September", "October", "November", "December"
      // ].indexOf(selectedMonth) + 1;
      // const reportMonth = `${selectedYear}${monthIndex.toString().padStart(2, "0")}`;
      // const { data } = await API.get(`/hmis108/referrals?report_month=${reportMonth}`);
      
      console.log("Referrals data would be fetched for month:", selectedMonth, "year:", selectedYear);
    } catch (error) {
      console.error("Error fetching referrals data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchReferralsData();
    }
  }, [selectedMonth, selectedYear, fetchReferralsData]);

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
          width: 80% !important;
          text-align: left !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: 20% !important;
          text-align: center !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        REFERRALS
      </div>

      <div className="table-container mb-4">
        <table className="data-entry-table compact-table full-width-table">
          <thead>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}>Category</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>NUMBERS</th>
            </tr>
          </thead>
          <tbody>
            {/* REFERRALS */}
            <tr className="section-title-bg">
              <td colSpan="2"><strong>REFERRALS</strong></td>
            </tr>
            
            <tr>
              <td>RF01. No. of Inpatients referred out from this health unit</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
            <tr>
              <td>RF02. No. of Inpatients referred in to the health unit</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
            <tr>
              <td>RF03. No. of inpatients who have self-referred</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
            <tr>
              <td>RF04. No. of inpatients who have run-away</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Referrals;
