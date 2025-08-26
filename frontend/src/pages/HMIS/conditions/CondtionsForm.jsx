import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const ConditionsForm = ({ selectedMonth, getMonthNumber, selectedYear, ageGroups, 
    genders, ageGroupMapping, section_id, title }) => {

    const [loading, setLoading] = useState(false);
    const [conditions, setConditions] = useState([]);

    const fetchConditions = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/conditions?report_month=${formattedMonth}&section_id=${section_id}`);
            console.log(response);
            setConditions(response.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedMonth && section_id) {
            fetchConditions();
        }
    }, [selectedMonth, section_id]);

    return (
        <div>
            <div className="section-header">
                {title}
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="data-entry-table">
                    <thead>
                        <tr>
                            <th rowSpan="2">Diagnosis</th>
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
                        {conditions.map(item => {
                            const getValueForCell = (ageGroup, gender) => {
                                const ageKeyMap = {
                                    "0-28d": "0_28d",
                                    "29d-4y": "29d_4y",
                                    "5-9y": "5_9y",
                                    "10-19y": "10_19y",
                                    "20y+": "20y_plus"
                                };
                                const key = `${ageKeyMap[ageGroup]}_${gender.toLowerCase() === 'm' ? 'male' : 'female'}`;
                                return item[key] || "0";
                            };

                            return (
                                <tr key={`attendance-${item.hmis_code}`}>
                                    <td>{item.hmis_name}</td>
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

export default ConditionsForm