import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const Attedance = ({ selectedMonth, getMonthNumber, selectedYear, ageGroups, genders, ageGroupMapping }) => {

  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [reattendanceData, setReAttendanceData] = useState([]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);

      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/attendance?report_month=${formattedMonth}`);
      console.log(response);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReattendance = async () => {
    try {
      setLoading(true);
      const monthNumber = getMonthNumber(selectedMonth);

      const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
      const response = await API.get(`/attendance/reattendance?report_month=${formattedMonth}`);
      console.log("Reattednace data", response);
      setReAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchAttendance();
      fetchReattendance();
    }
  }, [selectedMonth]);

  return (
    <div>
      <div className="section-header">
        1.1 OUTPATIENT ATTENDANCE
      </div>

      {loading ? (
        <div>Loading...</div>
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