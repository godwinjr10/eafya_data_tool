import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const Immunization = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [immunizationData, setImmunizationData] = useState([]);

  const fetchImmunizationData = async () => {
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
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchImmunizationData();
    }
  }, [selectedMonth, selectedYear]);

  // State for form values
  const [formData, setFormData] = useState({});

  const handleInputChange = (code, ageGroup, type, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${code}_${ageGroup}_${type}`]: value,
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="section-header">2.6.3 CHILD IMMUNISATION</div>

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
    </div>
  );
};

export default Immunization;
