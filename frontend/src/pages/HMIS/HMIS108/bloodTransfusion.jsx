import React, { useEffect, useState } from "react";
import API from "../../../helpers/api";

const BloodTransfusion = ({ selectedMonth, selectedYear }) => {
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
          `/hmis108/blood-transfusion?report_month=${reportMonth}`
        );
        setRows(data || []);
      } finally {
        setLoading(false);
      }
    };
    if (selectedMonth && selectedYear) load();
  }, [selectedMonth, selectedYear]);

  const s4a = rows.filter((r) => r.section === "4a");
  const s4b = rows.filter((r) => r.section === "4b");

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
            <span className="ms-3">Loading blood transfusion...</span>
          </div>
        ) : (
          <>
            {/* 4a */}
            {s4a.length > 0 && (
              <div className="mb-4">
                <h6>4a: Summary by Product</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Product Type</th>
                        <th>Units Requested</th>
                        <th>Units Received</th>
                        <th>Units Transfused</th>
                        <th>Adverse Reactions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s4a.map((r, i) => (
                        <tr key={i}>
                          <td>{r.blood_product_type || ""}</td>
                          <td>{r.units_requested || 0}</td>
                          <td>{r.units_received || 0}</td>
                          <td>{r.units_transfused || 0}</td>
                          <td>{r.adverse_reactions || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4b */}
            {s4b.length > 0 && (
              <div>
                <h6>4b: Units by Age and Gender</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Product Type</th>
                        <th>Age Group</th>
                        <th>Gender</th>
                        <th>Units</th>
                        <th>Report Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s4b.map((r, i) => (
                        <tr key={i}>
                          <td>{r.blood_product_type || ""}</td>
                          <td>{r.age_group || ""}</td>
                          <td>{r.gender || ""}</td>
                          <td>{r.unit || 0}</td>
                          <td>{r.report_month || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BloodTransfusion;
