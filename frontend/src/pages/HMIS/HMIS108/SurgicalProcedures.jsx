import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const SurgicalProcedures = ({ section, selectedMonth, selectedYear }) => {
  const [surgicalData, setSurgicalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSurgicalData = async () => {
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
        `/hmis108/surgical-procedures?report_month=${reportMonth}`
      );
      setSurgicalData(response.data);
    } catch (error) {
      console.error("Error fetching surgical procedures data:", error);
      setSurgicalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchSurgicalData();
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
            <span className="ms-3">Loading surgical procedures data...</span>
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
                <th>Section</th>
                <th>Code</th>
                <th>Procedure</th>
                <th>Report Month</th>
                <th>Procedure Count</th>
              </tr>
            </thead>
            <tbody>
              {surgicalData.map((procedure, index) => (
                <tr key={index}>
                  <td>
                    <strong>{procedure.section}</strong>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {procedure.code || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {procedure.procedure || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {procedure.report_month || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {procedure.procedure_count || 0}
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

export default SurgicalProcedures;
