import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const MentalHealth = ({ section, selectedMonth, selectedYear }) => {
  const [mentalHealthData, setMentalHealthData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMentalHealthData = async () => {
    try {
      setLoading(true);
      const monthIndex =
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const reportMonth = `${selectedYear}${formattedMonth}`;

      const response = await API.get(
        `/hmis108/mental-health?report_month=${reportMonth}`
      );
      setMentalHealthData(response.data);
    } catch (error) {
      console.error("Error fetching mental health data:", error);
      setMentalHealthData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMentalHealthData();
    }
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
        <div className="card-body">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-3">Loading mental health data...</span>
          </div>
        </div>
    );
  }

  return (
    <div className="card mb-4">

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th rowSpan="2">Mental Health Condition</th>
                <th colSpan="2">Under 5 Years</th>
                <th colSpan="2">5-9 Years</th>
                <th colSpan="2">10-19 Years</th>
                <th colSpan="2">20-34 Years</th>
                <th colSpan="2">35-59 Years</th>
                <th colSpan="2">60+ Years</th>
              </tr>
              <tr>
                <th>Male</th>
                <th>Female</th>
                <th>Male</th>
                <th>Female</th>
                <th>Male</th>
                <th>Female</th>
                <th>Male</th>
                <th>Female</th>
                <th>Male</th>
                <th>Female</th>
                <th>Male</th>
                <th>Female</th>
              </tr>
            </thead>
            <tbody>
              {mentalHealthData.map((condition, index) => (
                <tr key={index}>
                  <td>
                    <strong>{condition.diagnosis}</strong>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["<5Y Male"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["<5Y Female"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["5-9Y Male"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["5-9Y Female"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["10-19Y Male"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["10-19Y Female"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["20-34Y Male"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["20-34Y Female"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["35-59Y Male"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["35-59Y Female"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["60+Y Male"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {condition["60+Y Female"] || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
