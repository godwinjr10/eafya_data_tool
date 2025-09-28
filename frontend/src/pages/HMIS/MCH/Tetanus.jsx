import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const Tetanus = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [tetanusData, setTetanusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTetanusData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);
      const formattedMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      const response = await API.get(
        `/tetanus-vaccination/tetanus-vaccination?report_month=${formattedMonth}`
      );

      // Transform API data to match the component's structure
      const transformedData = (response.data || []).map((item) => ({
        code: item.vaccine_id,
        label: item.vaccine_name,
        data: {
          pregnant: {
            Static: Number(item.pregnant || 0),
            Outreach: 0,
          },
          nonPregnant: {
            Static: Number(item.non_pregnant || 0),
            Outreach: 0,
            School: 0,
          },
        },
      }));

      setTetanusData(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching tetanus data:", err);
      setError(err.message || "Error fetching tetanus data");
      setTetanusData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchTetanusData();
    }
  }, [selectedMonth, selectedYear, fetchTetanusData]);

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

  if (error) return <div>Error: {error}</div>;

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
      `}</style>
      
      <div className="section-header mb-3">
        2.6.2 TETANUS VACCINATION (Td VACCINE)
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
              <thead>
                <tr className="table-header-bg">
                  <th style={{ fontWeight: "normal" }}>Doses</th>
                  <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>Pregnant women</th>
                  <th colSpan="3" className="text-center" style={{ fontWeight: "normal" }}>Non-pregnant women</th>
                </tr>
                <tr className="table-header-bg">
                  <th style={{ fontWeight: "normal" }}></th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Static</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Outreach</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Static</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Outreach</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Immunization in School</th>
                </tr>
              </thead>
              <tbody>
                {tetanusData.map((dose) => (
                  <tr key={dose.code}>
                    <td>{dose.code}. {dose.label}</td>
                    <td className="text-center">
                      <FormInput value={dose.data.pregnant.Static || "0"} />
                    </td>
                    <td className="text-center">
                      <FormInput value={dose.data.pregnant.Outreach || "0"} />
                    </td>
                    <td className="text-center">
                      <FormInput value={dose.data.nonPregnant.Static || "0"} />
                    </td>
                    <td className="text-center">
                      <FormInput value={dose.data.nonPregnant.Outreach || "0"} />
                    </td>
                    <td className="text-center">
                      <FormInput value={dose.data.nonPregnant.School || "0"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tetanus;
