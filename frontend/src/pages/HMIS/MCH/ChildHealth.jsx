import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const ChildHealth = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ageGroups = [
    { label: "0-5 Months", key: "0-5m" },
    { label: "6-11 Months", key: "6-11m" },
    { label: "12-59 Months", key: "12-59m" },
    { label: "5-14 Years", key: "5-14y" },
  ];

  const servicePoints = ["Static", "Outreach", "In school"];

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);
      const formattedMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      const response = await API.get(
        `/child-health/child-health?report_month=${formattedMonth}`
      );

      // Transform API data to match the component's structure
      const transformedData = (response.data || []).map((item) => ({
        code: item.vaccine_id,
        label: item.vaccine_name,
        data: {
          Static: {
            "0-5m_male": item["0-5m Male"] || "0",
            "0-5m_female": item["0-5m Female"] || "0",
            "6-11m_male": item["6-11m Male"] || "0",
            "6-11m_female": item["6-11m Female"] || "0",
            "12-59m_male": item["12-59m Male"] || "0",
            "12-59m_female": item["12-59m Female"] || "0",
            "5-14y_male": item["5-14y Male"] || "0",
            "5-14y_female": item["5-14y Female"] || "0",
          },
          Outreach: {
            "0-5m_male": "0",
            "0-5m_female": "0",
            "6-11m_male": "0",
            "6-11m_female": "0",
            "12-59m_male": "0",
            "12-59m_female": "0",
            "5-14y_male": "0",
            "5-14y_female": "0",
          },
          "In school": {
            "0-5m_male": "0",
            "0-5m_female": "0",
            "6-11m_male": "0",
            "6-11m_female": "0",
            "12-59m_male": "0",
            "12-59m_female": "0",
            "5-14y_male": "0",
            "5-14y_female": "0",
          },
        },
      }));

      setVaccines(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching child health data:", err);
      setError("Error fetching data");
      setVaccines([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (
    vaccineCode,
    servicePoint,
    ageGroup,
    gender,
    value
  ) => {
    setVaccines((prevVaccines) => {
      return prevVaccines.map((vaccine) => {
        if (vaccine.code === vaccineCode) {
          const updatedData = {
            ...vaccine.data,
            [servicePoint]: {
              ...vaccine.data[servicePoint],
              [`${ageGroup}_${gender}`]: value,
            },
          };
          return { ...vaccine, data: updatedData };
        }
        return vaccine;
      });
    });
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
        <h5 className="card-title text-muted">No Child Health Data Available</h5>
        <p className="card-text text-muted">
          No child health data found for the selected month ({selectedMonth} {selectedYear}). 
          Please check if data has been uploaded for this period.
        </p>
      </div>
    </div>
  );

  // Check if we have any data
  const hasData = vaccines.length > 0;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="section-header">2.3 CHILD HEALTH</div>

      {loading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th></th>
            {ageGroups.map((group) => (
              <th key={group.label} colSpan="2" className="text-center">
                {group.label}
              </th>
            ))}
          </tr>
          <tr>
            <th>Service Point</th>
            {ageGroups.map(() => (
              <>
                <th className="text-center">M</th>
                <th className="text-center">F</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {vaccines.map((vaccine) => (
            <>
              <tr>
                <td colSpan={ageGroups.length * 2 + 1} className="bg-light">
                  {vaccine.code}. {vaccine.label}
                </td>
              </tr>
              {servicePoints.map((point) => (
                <tr key={`${vaccine.code}-${point}`}>
                  <td>{point}</td>
                  {ageGroups.map((group) => {
                    const data = vaccine.data[point] || {};
                    return (
                      <>
                        <td className="text-center">
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm"
                            value={data[`${group.key}_male`] || ""}
                            onChange={(e) =>
                              handleInputChange(
                                vaccine.code,
                                point,
                                group.key,
                                "male",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm"
                            value={data[`${group.key}_female`] || ""}
                            onChange={(e) =>
                              handleInputChange(
                                vaccine.code,
                                point,
                                group.key,
                                "female",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
        </>
      )}
    </div>
  );
};

export default ChildHealth;
