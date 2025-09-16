import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const Immunization = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [immunizationData, setImmunizationData] = useState([]);

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
      const transformedData = response.data.map((item) => ({
        code: item.vaccine_id,
        label: item.vaccine_name,
        data: {
          under1: {
            static: item["Under1y"] || "0",
            outreach: "0",
          },
          "1to4": {
            static: item["1-4y"] || "0",
            outreach: "0",
          },
          "5to14": {
            static: item["5-14y"] || "0",
            outreach: "0",
          },
        },
      }));

      setImmunizationData(transformedData);
    } catch (error) {
      console.error("Error fetching immunization data:", error);
      // Set default data in case of error
      setImmunizationData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchImmunizationData();
    }
  }, [selectedMonth, selectedYear, fetchImmunizationData]);

  // State for form values
  const [formData, setFormData] = useState({});

  const handleInputChange = (code, ageGroup, type, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${code}_${ageGroup}_${type}`]: value,
    }));
  };

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
      <div className="section-header">2.6.3 CHILD IMMUNISATION</div>

      {loading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Doses</th>
            <th colSpan={2}>Under 1</th>
            <th colSpan={2}>1-4 Years</th>
            <th colSpan={2}>5-14 Years</th>
          </tr>
          <tr>
            <th></th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
          </tr>
        </thead>
        <tbody>
          {immunizationData.map((vaccine) => (
            <tr key={vaccine.code}>
              <td>
                {vaccine.code}. {vaccine.label}
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={vaccine.data.under1.static}
                  readOnly
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={vaccine.data.under1.outreach}
                  readOnly
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={vaccine.data["1to4"].static}
                  readOnly
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={vaccine.data["1to4"].outreach}
                  readOnly
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={vaccine.data["5to14"].static}
                  readOnly
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={vaccine.data["5to14"].outreach}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </>
      )}
    </div>
  );
};

export default Immunization;
