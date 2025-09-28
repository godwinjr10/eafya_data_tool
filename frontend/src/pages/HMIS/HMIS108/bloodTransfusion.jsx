import React, { useEffect, useState, useCallback } from "react";
// import API from "../../../helpers/api"; // Commented out to avoid errors

const BloodTransfusion = ({ selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(false);

  const fetchBloodTransfusionData = useCallback(async () => {
      try {
        setLoading(true);
      
      // Commented out API call to avoid errors
      // const monthIndex = [
      //   "January", "February", "March", "April", "May", "June",
      //   "July", "August", "September", "October", "November", "December"
      // ].indexOf(selectedMonth) + 1;
      // const reportMonth = `${selectedYear}${monthIndex.toString().padStart(2, "0")}`;
      // const { data } = await API.get(`/hmis108/blood-transfusion?report_month=${reportMonth}`);
      
      console.log("Blood transfusion data would be fetched for month:", selectedMonth, "year:", selectedYear);
    } catch (error) {
      console.error("Error fetching blood transfusion data:", error);
      } finally {
        setLoading(false);
      }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchBloodTransfusionData();
    }
  }, [selectedMonth, selectedYear, fetchBloodTransfusionData]);

  // Form input component with consistent styling
  const FormInput = ({ value, onChange, placeholder = "0", disabled = false }) => (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-control form-control-sm compact-input ${disabled ? 'disabled-input' : ''}`}
      min="0"
      readOnly
      disabled={disabled}
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
          width: 100% !important;
          min-width: 40px !important;
        }
        .disabled-input {
          background-color: #6c757d !important;
          color: white !important;
          border-color: #6c757d !important;
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
          width: 25% !important;
          text-align: left !important;
          min-width: 200px !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: auto !important;
          text-align: center !important;
          min-width: 45px !important;
          max-width: 60px !important;
        }
        .wide-table-container {
          width: 100% !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
          border: 1px solid #dee2e6 !important;
        }
        .wide-table {
          min-width: 1400px !important;
          width: max-content !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        BLOOD TRANSFUSION SERVICES
            </div>

      {/* 4a. Blood Transfusion Services */}
      <div className="section-subheader mb-2">4a. Blood Transfusion Services</div>
      <div className="table-container mb-4">
        <table className="data-entry-table compact-table full-width-table">
          <thead>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}>Category</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Whole blood</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Packed cells</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Platelets</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Fresh Frozen Plasma</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Cryo precipitates</th>
                      </tr>
                    </thead>
                    <tbody>
            <tr>
              <td>UT01. No of units requested</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
            <tr>
              <td>UT02. No. of units received</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
            <tr>
              <td>UT03. No. of units transfused</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
            </tr>
            <tr>
              <td>UT04. No. of adverse Blood reactions in the facility</td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
              <td className="text-center">
                <FormInput value="0" />
              </td>
                        </tr>
                    </tbody>
                  </table>
                </div>

      {/* 4b. Reasons for transfusion */}
      <div className="section-subheader mb-2">4b. Reasons for transfusion</div>
      <div className="mb-2">
        <small className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Scroll horizontally to view all columns
        </small>
      </div>
      <div className="wide-table-container mb-4">
        <table className="data-entry-table compact-table wide-table">
          <thead>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}>Reasons for Transfusion</th>
              <th colSpan="4" className="text-center" style={{ fontWeight: "normal" }}>Whole blood</th>
              <th colSpan="4" className="text-center" style={{ fontWeight: "normal" }}>Packed cells</th>
              <th colSpan="4" className="text-center" style={{ fontWeight: "normal" }}>Platelets</th>
              <th colSpan="4" className="text-center" style={{ fontWeight: "normal" }}>Fresh Frozen Plasma</th>
              <th colSpan="4" className="text-center" style={{ fontWeight: "normal" }}>Cryo precipitates</th>
            </tr>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}></th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-4yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5+yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-4yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5+yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-4yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5+yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-4yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5+yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-4yrs</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5+yrs</th>
            </tr>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}></th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>M</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>F</th>
                      </tr>
                    </thead>
                    <tbody>
            <tr>
              <td>RT01. Severe malaria</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT02. Obstetrics</td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT03. Gynaecology</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" disabled={true} /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT04. Accidents</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT05. Cancer cases</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT06. Sickle cell Anaemia</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT07. Iron Deficiency Anaemia (IDA)</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT08. Other Coagulopathies</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td>RT09. Other surgeries</td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
            </tr>
            <tr className="section-title-bg">
              <td><strong>Total units of blood Transfused</strong></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
              <td className="text-center"><FormInput value="0" /></td>
                        </tr>
                    </tbody>
                  </table>
      </div>
    </div>
  );
};

export default BloodTransfusion;

