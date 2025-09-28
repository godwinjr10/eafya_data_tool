import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const ChildHealth = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [childHealthData, setChildHealthData] = useState([]);

  // Map backend data to frontend display format
  const mapChildHealthData = (data) => {
    return data.map((item, index) => ({
      hmis_code: item.hmis_code || `CH${String(index + 1).padStart(2, '0')}`,
      intervention_name: item.intervention_name || item.vaccine_name,
      static_0_5m_male: item["0-5m Male"] || "0",
      static_0_5m_female: item["0-5m Female"] || "0",
      static_6_11m_male: item["6-11m Male"] || "0",
      static_6_11m_female: item["6-11m Female"] || "0",
      static_12_59m_male: item["12-59m Male"] || "0",
      static_12_59m_female: item["12-59m Female"] || "0",
      static_5_14y_male: item["5-14y Male"] || "0",
      static_5_14y_female: item["5-14y Female"] || "0",
      outreach_0_5m_male: "0",
      outreach_0_5m_female: "0",
      outreach_6_11m_male: "0",
      outreach_6_11m_female: "0",
      outreach_12_59m_male: "0",
      outreach_12_59m_female: "0",
      outreach_5_14y_male: "0",
      outreach_5_14y_female: "0",
      inschool_0_5m_male: "0",
      inschool_0_5m_female: "0",
      inschool_6_11m_male: "0",
      inschool_6_11m_female: "0",
      inschool_12_59m_male: "0",
      inschool_12_59m_female: "0",
      inschool_5_14y_male: "0",
      inschool_5_14y_female: "0"
    }));
  };

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthNumber = getMonthNumber(selectedMonth);
      const reportMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      const response = await API.get(
        `/child-health/child-health?report_month=${reportMonth}`
      );

      // Update data with mapping
      const mappedData = mapChildHealthData(response.data || []);
      setChildHealthData(mappedData);
    } catch (error) {
      console.error("Error fetching child health data:", error);
      setChildHealthData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData();
    }
  }, [selectedMonth, selectedYear, fetchData]);

  const getValueForCell = (item, field) => {
    return item[field] || "0";
  };

  // Check if a cell should be shaded based on the matrix logic
  const shouldShadeCell = (interventionIndex, servicePoint, ageGroup) => {
    // Based on the screenshot matrix logic:
    // CH01 (Vit A supplement 1st dose) - not applicable (white)
    // CH02 (Vit A supplement 2nd dose) - shaded for 6-11m, 12-59m, 5-14y (except inschool for 6-11m, 12-59m)
    // CH03 (Dewormed 1st dose) - shaded for 6-11m, 12-59m (except 5-14y for static/outreach, and 5-14y for inschool)
    // CH04 (Dewormed 2nd dose) - same as CH03
    
    if (interventionIndex === 0) return false; // CH01 - not applicable
    
    if (interventionIndex === 1) { // CH02 - Vit A supplement 2nd dose
      if (ageGroup === "0-5m") return false;
      if (ageGroup === "5-14y" && servicePoint === "inschool") return true;
      if (ageGroup === "6-11m" || ageGroup === "12-59m") {
        return servicePoint !== "inschool";
      }
      return true;
    }
    
    if (interventionIndex === 2 || interventionIndex === 3) { // CH03, CH04 - Dewormed
      if (ageGroup === "0-5m") return false;
      if (ageGroup === "5-14y") {
        return servicePoint === "inschool";
      }
      if (ageGroup === "6-11m" || ageGroup === "12-59m") {
        return servicePoint !== "inschool";
      }
      return false;
    }
    
    return false;
  };

  // Form input component with consistent styling
  const FormInput = ({ value, onChange, placeholder = "0", isShaded = false }) => (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-control form-control-sm compact-input ${isShaded ? 'shaded-cell' : ''}`}
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
        .shaded-cell {
          background-color: #e9ecef !important;
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
        .intervention-row {
          background-color: #f8f9fa !important;
          font-weight: 500 !important;
        }
        .service-point-cell {
          padding-left: 1rem !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        2.3 CHILD HEALTH INTERVENTIONS
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="table-container">
          <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Intervention</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>0-5 Months</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>6-11 Months</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>12-59 Months</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>5-14 Years</th>
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
              </tr>
            </thead>
            <tbody>
              {childHealthData.map((intervention, interventionIndex) => (
                <React.Fragment key={interventionIndex}>
                  <tr className="intervention-row">
                    <td colSpan="9">{intervention.hmis_code}. {intervention.intervention_name}</td>
                  </tr>
                  <tr>
                    <td className="service-point-cell">Static</td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_0_5m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "0-5m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_0_5m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "0-5m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_6_11m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "6-11m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_6_11m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "6-11m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_12_59m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "12-59m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_12_59m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "12-59m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_5_14y_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "5-14y")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "static_5_14y_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "static", "5-14y")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="service-point-cell">Outreach</td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_0_5m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "0-5m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_0_5m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "0-5m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_6_11m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "6-11m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_6_11m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "6-11m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_12_59m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "12-59m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_12_59m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "12-59m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_5_14y_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "5-14y")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "outreach_5_14y_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "outreach", "5-14y")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="service-point-cell">In school</td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_0_5m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "0-5m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_0_5m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "0-5m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_6_11m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "6-11m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_6_11m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "6-11m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_12_59m_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "12-59m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_12_59m_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "12-59m")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_5_14y_male")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "5-14y")}
                      />
                    </td>
                    <td className="text-center">
                      <FormInput 
                        value={getValueForCell(intervention, "inschool_5_14y_female")} 
                        isShaded={shouldShadeCell(interventionIndex, "inschool", "5-14y")}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChildHealth;
