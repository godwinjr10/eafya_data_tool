import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const ConditionsForm = ({ selectedMonth, getMonthNumber, selectedYear, ageGroups, 
    genders, ageGroupMapping, section_id, title }) => {

    const [loading, setLoading] = useState(false);
    const [conditions, setConditions] = useState([]);

    const fetchConditions = useCallback(async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/conditions?report_month=${formattedMonth}&section_id=${section_id}`);
            console.log(response);
            setConditions(response.data || []);
        } catch (error) {
            console.error('Error fetching conditions data:', error);
            setConditions([]);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear, getMonthNumber, section_id]);

    useEffect(() => {
        if (selectedMonth && section_id) {
            fetchConditions();
        }
    }, [selectedMonth, section_id, fetchConditions]);

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
                <h5 className="card-title text-muted">No {title} Data Available</h5>
                <p className="card-text text-muted">
                    No {title.toLowerCase()} data found for the selected month ({selectedMonth} {selectedYear}). 
                    Please check if data has been uploaded for this period.
                </p>
            </div>
        </div>
    );

    const hasData = conditions.length > 0;

    return (
        <div>
            <div className="section-header">
                {title}
            </div>

            {loading ? (
                <Spinner />
            ) : !hasData ? (
                <NoDataCard />
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