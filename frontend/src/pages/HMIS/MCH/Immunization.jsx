import React, { useState, useEffect, useCallback, useMemo } from "react";
import API from "../../../helpers/api";

const Immunization = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [immunizationData, setImmunizationData] = useState([]);

  // Define the complete immunization data structure based on the image
  const immunizationStructure = useMemo(() => [
    // 2.6.3 CHILD IMMUNISATION
    { code: "CL01", label: "BCG", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL02", label: "Hep B zero doze", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL03", label: "Protection At Birth for Td (PAB)", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL04", label: "Polio 0", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL05", label: "Polio 1", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL06", label: "Polio 2", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL07", label: "Polio 3", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL08", label: "IPV1", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL09", label: "IPV2", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL10", label: "DPT-Hep B+Hib 1", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL11", label: "DPT-Hep B+Hib 2", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL12", label: "DPT-Hep B+Hib 3", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL13", label: "PCV 1", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL14", label: "PCV 2", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL15", label: "PCV 3", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL16", label: "Rotavirus 1 Vaccine", applicable: { under1: { static: false, outreach: false }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL17", label: "Rotavirus 2 Vaccine", applicable: { under1: { static: false, outreach: false }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL18", label: "Rotavirus 3 Vaccine", applicable: { under1: { static: false, outreach: false }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL19", label: "Malaria 1", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL20", label: "Malaria 2", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL21", label: "Malaria 3", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL22", label: "Yellow Fever", applicable: { under1: { static: false, outreach: false }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL23", label: "Measles (MR1)", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    { code: "CL24", label: "Fully immunized by 1 year", applicable: { under1: { static: false, outreach: false }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL25", label: "No. received LLINs", applicable: { under1: { static: false, outreach: false }, "1to4": { static: false, outreach: false }, "5to14": { static: true, outreach: true } } },
    // SECOND YEAR OF LIFE
    { code: "CL26", label: "Malaria 4", applicable: { under1: { static: true, outreach: true }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL27", label: "Measles (MR2)", applicable: { under1: { static: true, outreach: true }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } },
    { code: "CL28", label: "Fully immunized by 2 years", applicable: { under1: { static: true, outreach: true }, "1to4": { static: true, outreach: true }, "5to14": { static: true, outreach: true } } }
  ], []);

  const fetchImmunizationData = useCallback(async () => {
    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);
      const formattedMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;
      const response = await API.get(
        `/child-immunization/child-immunization?report_month=${formattedMonth}`
      );

      // Transform API data to match the required format
      const transformedData = immunizationStructure.map((structure) => {
        const apiItem = response.data.find(item => item.vaccine_id === structure.code);
        return {
          code: structure.code,
          label: structure.label,
          applicable: structure.applicable,
          data: {
            under1: {
              static: apiItem?.["Under1y"] || "0",
              outreach: "0",
            },
            "1to4": {
              static: apiItem?.["1-4y"] || "0",
              outreach: "0",
            },
            "5to14": {
              static: apiItem?.["5-14y"] || "0",
              outreach: "0",
            },
          },
        };
      });

      setImmunizationData(transformedData);
    } catch (error) {
      console.error("Error fetching immunization data:", error);
      // Set default data in case of error
      setImmunizationData(immunizationStructure.map(structure => ({
        code: structure.code,
        label: structure.label,
        applicable: structure.applicable,
        data: {
          under1: { static: "0", outreach: "0" },
          "1to4": { static: "0", outreach: "0" },
          "5to14": { static: "0", outreach: "0" },
        },
      })));
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber, immunizationStructure]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchImmunizationData();
    }
  }, [selectedMonth, selectedYear, fetchImmunizationData]);

  // State for form values (currently not used but kept for future functionality)
  // const [formData, setFormData] = useState({});

  // const handleInputChange = (code, ageGroup, type, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [`${code}_${ageGroup}_${type}`]: value,
  //   }));
  // };

  const getValueForCell = (item, ageGroup, type) => {
    return item.data[ageGroup][type] || "0";
  };

  // Form input component with consistent styling
  const FormInput = ({ value, onChange, placeholder = "0", disabled = false }) => (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control form-control-sm compact-input"
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

  // No data card component
  const NoDataCard = () => (
    <div className="card" style={{ margin: '1rem 0', padding: '1rem' }}>
      <div className="card-body text-center">
        <div className="mb-3">
          <i className="fas fa-chart-line fa-3x text-muted"></i>
        </div>
        <h5 className="card-title text-muted">No Immunization Data Available</h5>
        <p className="card-text text-muted">
          No immunization data found for the selected month ({selectedMonth} {selectedYear}). 
          Please check if data has been uploaded for this period.
        </p>
      </div>
    </div>
  );

  // Check if we have any data
  const hasData = immunizationData.length > 0;

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
        .disabled-cell {
          background-color: #f8f9fa !important;
          color: #6c757d !important;
        }
        .disabled-input {
          background-color: #f8f9fa !important;
          color: #6c757d !important;
          cursor: not-allowed !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        2.6.3 CHILD IMMUNISATION
      </div>

      {loading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <div className="table-container mb-4">
          <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Doses</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>Under 1</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>1-4 Years</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5-14 Years</th>
              </tr>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}></th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Static</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Outreach</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Static</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Outreach</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Static</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Outreach</th>
              </tr>
            </thead>
            <tbody>
              {immunizationData.map((vaccine, index) => (
                <tr key={vaccine.code}>
                  <td>
                    {vaccine.code}. {vaccine.label}
                  </td>
                  <td className={`text-center ${!vaccine.applicable.under1.static ? 'disabled-cell' : ''}`}>
                    <FormInput 
                      value={getValueForCell(vaccine, "under1", "static")} 
                      disabled={!vaccine.applicable.under1.static}
                    />
                  </td>
                  <td className={`text-center ${!vaccine.applicable.under1.outreach ? 'disabled-cell' : ''}`}>
                    <FormInput 
                      value={getValueForCell(vaccine, "under1", "outreach")} 
                      disabled={!vaccine.applicable.under1.outreach}
                    />
                  </td>
                  <td className={`text-center ${!vaccine.applicable["1to4"].static ? 'disabled-cell' : ''}`}>
                    <FormInput 
                      value={getValueForCell(vaccine, "1to4", "static")} 
                      disabled={!vaccine.applicable["1to4"].static}
                    />
                  </td>
                  <td className={`text-center ${!vaccine.applicable["1to4"].outreach ? 'disabled-cell' : ''}`}>
                    <FormInput 
                      value={getValueForCell(vaccine, "1to4", "outreach")} 
                      disabled={!vaccine.applicable["1to4"].outreach}
                    />
                  </td>
                  <td className={`text-center ${!vaccine.applicable["5to14"].static ? 'disabled-cell' : ''}`}>
                    <FormInput 
                      value={getValueForCell(vaccine, "5to14", "static")} 
                      disabled={!vaccine.applicable["5to14"].static}
                    />
                  </td>
                  <td className={`text-center ${!vaccine.applicable["5to14"].outreach ? 'disabled-cell' : ''}`}>
                    <FormInput 
                      value={getValueForCell(vaccine, "5to14", "outreach")} 
                      disabled={!vaccine.applicable["5to14"].outreach}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Immunization;
