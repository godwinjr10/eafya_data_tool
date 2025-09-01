import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const AdmissionsDeaths = ({ section, selectedMonth, selectedYear }) => {
  const [admissionsData, setAdmissionsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmissionsData = async () => {
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
        `/hmis108/admission-deaths?report_month=${reportMonth}`
      );
      setAdmissionsData(response.data);
    } catch (error) {
      console.error("Error fetching admission deaths data:", error);
      setAdmissionsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchAdmissionsData();
    }
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-3">Loading admission deaths data...</span>
          </div>
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
                <th rowSpan="2">Diagnosis</th>
                <th colSpan="4">Cases</th>
                <th colSpan="4">Deaths</th>
              </tr>
              <tr>
                <th>0-4 Years Male</th>
                <th>0-4 Years Female</th>
                <th>5+ Years Male</th>
                <th>5+ Years Female</th>
                <th>0-4 Years Male</th>
                <th>0-4 Years Female</th>
                <th>5+ Years Male</th>
                <th>5+ Years Female</th>
              </tr>
            </thead>
            <tbody>
              {admissionsData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>{item.diagnosis}</strong>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["0-4years Male Cases"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["0-4years female Cases"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["5years+ Male Cases"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["5years+ female Cases"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["0-4years Male Deaths"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["0-4years female Deaths"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["5years+ Male Deaths"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item["5years+ female Deaths"] || 0}
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

export default AdmissionsDeaths;
