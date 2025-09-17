import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const Attedance = ({ selectedMonth, getMonthNumber, selectedYear, ageGroups, genders, ageGroupMapping }) => {

  const [attendanceData, setAttendanceData] = useState([]);
  const [reattendanceData, setReAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [reattendanceLoading, setReAttendanceLoading] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      setAttendanceLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);

      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/attendance?report_month=${formattedMonth}`);
      setAttendanceData(response.data || []);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceData([]);
    } finally {
      setAttendanceLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  const fetchReattendance = useCallback(async () => {
    try {
      setReAttendanceLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);

      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/attendance/reattendance?report_month=${formattedMonth}`);
      setReAttendanceData(response.data || []);
    } catch (error) {
      console.error('Error fetching reattendance data:', error);
      setReAttendanceData([]);
    } finally {
      setReAttendanceLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    if (selectedMonth) {
      fetchAttendance();
      fetchReattendance();
    }
  }, [selectedMonth, fetchAttendance, fetchReattendance]);

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
        <h5 className="card-title text-muted">No Attendance Data Available</h5>
        <p className="card-text text-muted">
          No attendance data found for the selected month ({selectedMonth} {selectedYear}). 
          Please check if data has been uploaded for this period.
        </p>
      </div>
    </div>
  );

  const isLoading = attendanceLoading || reattendanceLoading;
  const hasData = attendanceData.length > 0 || reattendanceData.length > 0;

  return (
    <div>
      <div className="section-header">
        1.1 OUTPATIENT ATTENDANCE
      </div>

      {isLoading ? (
        <Spinner />
      ) : !hasData ? (
        <NoDataCard />
      ) : (
        <table className="data-entry-table">
          <thead>
            <tr>
              <th rowSpan="2">Category</th>
              {ageGroups.map((ag, i) => (
                <th key={i} colSpan={2} className="text-center">{ag}</th>
              ))}
            </tr>
            <tr>
              {ageGroups.map((_, i) => (
                genders.map(g => <th key={i + g} className="text-center">{g}</th>)
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Attendance Data */}
            {attendanceData.map(item => {
              const getValueForCell = (ageGroup, gender) => {
                const ageKeyMap = {
                  "0-28d": "0-28d",
                  "29d-4y": "29d-4y",
                  "5-9y": "5-9y",
                  "10-19y": "10-19y",
                  "20y+": "20y+"
                };
                const key = `${ageKeyMap[ageGroup]}_${gender.toLowerCase() === 'm' ? 'male' : 'female'}`;
                return item[key] || "0";
              };

              return (
                <tr key={`attendance-${item.hmis_code}`}>
                  <td>New Attendance</td>
                  {Object.keys(ageGroupMapping).map(ageKey =>
                    genders.map(gender => (
                      <td key={`${ageKey}-${gender}`} className="text-center">
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-sm"
                          value={getValueForCell(ageKey, gender)}
                          readOnly
                        />
                      </td>
                    ))
                  )}
                </tr>
              );
            })}

            {/* Reattendance Data */}
            {reattendanceData.map(item => {
              const getValueForCell = (ageGroup, gender) => {
                const ageKeyMap = {
                  "0-28d": "0-28d",
                  "29d-4y": "29d-4y",
                  "5-9y": "5-9y",
                  "10-19y": "10-19y",
                  "20y+": "20y+"
                };
                const key = `${ageKeyMap[ageGroup]}_${gender.toLowerCase() === 'm' ? 'male' : 'female'}`;
                return item[key] || "0";
              };

              return (
                <tr key={`reattendance-${item.hmis_code}`}>
                  <td>Re-attendance</td>
                  {Object.keys(ageGroupMapping).map(ageKey =>
                    genders.map(gender => (
                      <td key={`${ageKey}-${gender}`} className="text-center">
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-sm"
                          value={getValueForCell(ageKey, gender)}
                          readOnly
                        />
                      </td>
                    ))
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Attedance