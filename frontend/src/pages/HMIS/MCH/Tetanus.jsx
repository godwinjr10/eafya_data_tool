import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const Tetanus = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [tetanusData, setTetanusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformApiData = (apiData) => {
    const doses = [
      {
        code: "TD01",
        label: "Td1-Dose 1",
        pregKey: "td1_preg",
        nonPregKey: "td1_non_preg",
      },
      {
        code: "TD02",
        label: "Td2-Dose 2",
        pregKey: "td2_preg",
        nonPregKey: "td2_non_preg",
      },
      {
        code: "TD03",
        label: "Td3-Dose 3",
        pregKey: "td3_preg",
        nonPregKey: "td3_non_preg",
      },
      {
        code: "TD04",
        label: "Td4-Dose 4",
        pregKey: "td4_preg",
        nonPregKey: "td4_non_preg",
      },
      {
        code: "TD05",
        label: "Td5-Dose 5",
        pregKey: "td5_preg",
        nonPregKey: "td5_non_preg",
      },
    ];

    // Use the most recent month's data
    const latestData = apiData[0] || {};

    return doses.map((dose) => ({
      code: dose.code,
      label: dose.label,
      data: {
        pregnant: {
          Static: Number(latestData[dose.pregKey] || 0),
          Outreach: 0,
        },
        nonPregnant: {
          Static: Number(latestData[dose.nonPregKey] || 0),
          Outreach: 0,
          School: 0,
        },
      },
    }));
  };

  const fetchTetanusData = useCallback(async () => {
    if (!selectedMonth) return;

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
    fetchTetanusData();
  }, [fetchTetanusData]);

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
        <h5 className="card-title text-muted">No Tetanus Data Available</h5>
        <p className="card-text text-muted">
          No tetanus data found for the selected month ({selectedMonth} {selectedYear}). 
          Please check if data has been uploaded for this period.
        </p>
      </div>
    </div>
  );

  // Check if we have any data
  const hasData = tetanusData.length > 0;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="section-header">
        2.6.2 TETANUS VACCINATION (Td VACCINE)
      </div>

      {loading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th rowSpan="1">Doses</th>
            <th colSpan="2">Pregnant women</th>
            <th colSpan="2">Non-pregnant women</th>
            <th rowSpan="1">Immunization in School</th>
          </tr>
          <tr>
            <th></th>
            <th>Static</th>
            <th>Outreach</th>
            <th>Static</th>
            <th>Outreach</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tetanusData.map((dose) => (
            <tr key={dose.code}>
              <td>
                {dose.code}. {dose.label}
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={dose.data.pregnant.Static || 0}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={dose.data.pregnant.Outreach || 0}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={dose.data.nonPregnant.Static || 0}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={dose.data.nonPregnant.Outreach || 0}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={dose.data.nonPregnant.School || 0}
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

export default Tetanus;
