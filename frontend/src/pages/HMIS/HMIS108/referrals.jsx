import React, { useEffect, useState } from "react";
import API from "../../../helpers/api";

const Referrals = ({ selectedMonth, selectedYear }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
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
        const reportMonth = `${selectedYear}${monthIndex
          .toString()
          .padStart(2, "0")}`;
        const { data } = await API.get(
          `/hmis108/referrals?report_month=${reportMonth}`
        );
        setRows(data || []);
      } finally {
        setLoading(false);
      }
    };
    if (selectedMonth && selectedYear) load();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-3">Loading referrals...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Report Month</th>
                  <th>Outgoing Referrals</th>
                  <th>Incoming Referrals</th>
                  <th>Self Referrals</th>
                  <th>Runaway Patients</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.report_month}</td>
                    <td>{r["Outgoing Referrals"] || 0}</td>
                    <td>{r["Incoming Referrals"] || 0}</td>
                    <td>{r["Self Referrals"] || 0}</td>
                    <td>{r["Runaway Patients"] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;
