import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const FamilyPlanning = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [visitsData, setVisitsData] = useState([]);
  const [contraceptivesData, setContraceptivesData] = useState([]);
  const [theatreData, setTheatreData] = useState([]);

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthNumber = getMonthNumber(selectedMonth);
      const reportMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      // Fetch data from all family planning endpoints
      const [visitsResponse, contraceptivesResponse, theatreResponse] =
        await Promise.all([
          API.get(`/family-planning/visits?report_month=${reportMonth}`),
          API.get(
            `/family-planning/contraceptives?report_month=${reportMonth}`
          ),
          API.get(`/family-planning/theatre?report_month=${reportMonth}`),
        ]);

      // Update visits data
      if (visitsResponse.data && visitsResponse.data.length > 0) {
        setVisitsData(visitsResponse.data);
      } else {
        setVisitsData([]);
      }

      // Update contraceptives data
      if (
        contraceptivesResponse.data &&
        contraceptivesResponse.data.length > 0
      ) {
        setContraceptivesData(contraceptivesResponse.data);
      } else {
        setContraceptivesData([]);
      }

      // Update theatre data
      if (theatreResponse.data && theatreResponse.data.length > 0) {
        setTheatreData(theatreResponse.data);
      } else {
        setTheatreData([]);
      }
    } catch (error) {
      console.error("Error fetching family planning data:", error);
      // Keep default values on error
      setVisitsData([]);
      setContraceptivesData([]);
      setTheatreData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData();
    }
  }, [selectedMonth, selectedYear, fetchData]);

  const getValueForCell = (item, field) => {
    return item[field] || "0";
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
        <h5 className="card-title text-muted">No Family Planning Data Available</h5>
        <p className="card-text text-muted">
          No family planning data found for the selected month ({selectedMonth} {selectedYear}). 
          Please check if data has been uploaded for this period.
        </p>
      </div>
    </div>
  );

  // Check if we have any data
  const hasData = visitsData.length > 0 || contraceptivesData.length > 0 || theatreData.length > 0;

  return (
    <div>
      <div className="section-header">2.4 FAMILY PLANNING METHODS</div>

      {loading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <>

      {/* Family Planning Client Visits Table */}
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th rowSpan="3">2.4.1 Family Planning Client Visits</th>
            <th colSpan="2">Below 15 Yrs</th>
            <th colSpan="2">15-19 Yrs</th>
            <th colSpan="2">20-24 Yrs</th>
            <th colSpan="2">25-49 Yrs</th>
            <th colSpan="2">50+ Yrs</th>
          </tr>
          <tr>
            <th>New users</th>
            <th>Revisits</th>
            <th>New users</th>
            <th>Revisits</th>
            <th>New users</th>
            <th>Revisits</th>
            <th>New users</th>
            <th>Revisits</th>
            <th>New users</th>
            <th>Revisits</th>
          </tr>
        </thead>
        <tbody>
          {visitsData.length > 0 ? (
            visitsData.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.hmis_code}. {row.family_planning_name}
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "under_15_new")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "under_15_revisit")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "15_19_new")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "15_19_revisit")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "20_24_new")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "20_24_revisit")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "25_49_new")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "25_49_revisit")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "50_plus_new")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "50_plus_revisit")}
                    readOnly
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center text-muted">
                No family planning visits data available for the selected period
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Family Planning Contraceptives Dispensed Table */}
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th>2.4.2 Family Planning Contraceptives Dispensed</th>
            <th>Total Dispensed</th>
          </tr>
        </thead>
        <tbody>
          {contraceptivesData.length > 0 ? (
            contraceptivesData.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.hmis_code}. {row.family_planning_name}
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "total_dispensed")}
                    readOnly
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No contraceptives data available for the selected period
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Family Planning Theatre Procedures Table */}
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th>2.4.3 Family Planning Theatre Procedures</th>
            <th>25-49 Female Tubal</th>
            <th>50+ Female Tubal</th>
            <th>25-49 Male Vasectomy</th>
            <th>50+ Male Vasectomy</th>
          </tr>
        </thead>
        <tbody>
          {theatreData.length > 0 ? (
            theatreData.map((row, index) => (
              <tr key={index}>
                <td>{row.major_theatre_name}</td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "25_49_female_tubal")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "50plus_female_tubal")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "25_49_male_vasectomy")}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, "50plus_male_vasectomy")}
                    readOnly
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No theatre procedures data available for the selected period
              </td>
            </tr>
          )}
        </tbody>
      </table>
        </>
      )}
    </div>
  );
};

export default FamilyPlanning;
