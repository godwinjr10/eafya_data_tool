import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
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
        const transformedData = response.data.map((item) => ({
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, getMonthNumber]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="section-header">2.3 CHILD HEALTH</div>

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
    </div>
  );
};

export default ChildHealth;
