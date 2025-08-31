import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const CensusInformation = ({ section, selectedMonth, selectedYear }) => {
  const [censusData, setCensusData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCensusData = async () => {
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
        `/hmis108/census-information?report_month=${reportMonth}`
      );
      setCensusData(response.data);
    } catch (error) {
      console.error("Error fetching census data:", error);
      setCensusData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchCensusData();
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
            <span className="ms-3">Loading census data...</span>
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
                <th>Ward</th>
                <th>Number of Beds</th>
                <th>Admissions</th>
                <th>Deaths</th>
                <th>Patient Days</th>
                <th>Average Length of Stay (Days)</th>
                <th>Average Occupancy</th>
                <th>Bed Occupancy (%)</th>
              </tr>
            </thead>
            <tbody>
              {censusData.map((ward, index) => (
                <tr key={index}>
                  <td>
                    <strong>{ward.Wards}</strong>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["A Cl01. No. of beds"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["B Cl02. No. of admissions"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["C Cl03. No. of deaths"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["D Cl04. Patient days"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["E Cl05. Average length of stay (E=D/B)"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["F Cl06. Average occupancy (F=D/30 days)"] || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {ward["G Cl07. Bed occupancy (F/A)x100"] || 0}%
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

export default CensusInformation;
