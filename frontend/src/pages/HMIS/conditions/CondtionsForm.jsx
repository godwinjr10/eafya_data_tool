import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const ConditionsForm = ({ selectedMonth, getMonthNumber, selectedYear, ageGroups, 
    genders, ageGroupMapping, section_id }) => {

    const [loading, setLoading] = useState(false);
    const [conditions, setConditions] = useState([]);
    
    // Attendance data states
    const [attendanceData, setAttendanceData] = useState([]);
    const [reattendanceData, setReAttendanceData] = useState([]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [reattendanceLoading, setReAttendanceLoading] = useState(false);
    
    // All sections data state
    const [allSectionsData, setAllSectionsData] = useState([]);
    const [allSectionsLoading, setAllSectionsLoading] = useState(false);
    const [sections, setSections] = useState([]);
    

    // Section titles mapping
    const sectionTitles = {
        '1.1': 'Outpatient Attendance',
        '1.2': 'Outpatient Referals',
        '1.3.1': 'Epidemic & Referals',
        '1.3.2': 'Other Infectious / Communicable Diseases',
        '1.3.3': 'Neonatal Diseases',
        '1.3.4': 'Non-Communicable Diseases',
        '1.3.5': 'Oral Diseases',
        '1.3.6': 'ENT Conditions',
        '1.3.7': 'Eye Conditions',
        '1.3.8': 'Mental Health',
        '1.3.9': 'Neurological Disorders',
        '1.3.10': 'Chronic Respiratory',
        '1.3.11': 'Cancers',
        '1.3.12': 'Palliative',
        '1.3.14': 'Disabilities',
        '1.3.15': 'Cardiovascular Diseases',
        '1.3.16': 'Renal Diseases',
        '1.3.17': 'Liver Diseases',
        '1.3.18': 'Endocrine Metabolic Disorders',
        '1.3.19': 'Injuries',
        '1.3.20': 'Minor Operations OPD',
        '1.3.21': 'Neglected Tropical Diseases',
        '1.3.22': 'Maternal Conditions',
        '1.3.24': 'Deaths in OPD',
        '1.3.25': 'Emergency Medical Services',
        '1.3.26': 'TB Screening',
        '1.3.27': 'Leprosy Services',
        '1.3.28': 'Nutrition Services',
        '1.3.29': 'Gender Based Violence Services',
        '2.1': 'Antenatal',
        '2.2': 'Maternity',
        '2.3': 'Postnatal',
        '2.4.1': 'Family Planning Client Visits',
        '2.4.2': 'Contraceptives Dispensed',
        '2.4.3': 'Minor Operations Family Planning',
        '2.4.4': 'Postpartum Family Planning',
        '2.4.5': 'Post Abortion Family Planning',
        '2.4.6': 'Removal of Long Acting',
        '2.4.7': 'Integrated Family Planning'
    };

    // Fetch available sections from the backend
    const fetchSections = useCallback(async () => {
        try {
            const response = await API.get('/datasets');
            const hmisDataset = response.data.datasets.find(dataset => dataset.dataset_id === 'HMIS_105_01');
            if (hmisDataset && hmisDataset.sections) {
                setSections(hmisDataset.sections);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    }, []);

    // Fetch all sections data when no specific section is selected
    const fetchAllSectionsData = useCallback(async () => {
        if (!selectedMonth || section_id) return;
        
        try {
            setAllSectionsLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);
            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            
            // Fetch data for all sections (excluding 1.1 since it's handled by attendance)
            const conditionsSections = sections.filter(section => section.section_id !== '1.1');
            const promises = conditionsSections.map(async (section) => {
                try {
                    const response = await API.get(`/conditions?report_month=${formattedMonth}&section_id=${section.section_id}`);
                    return {
                        sectionId: section.section_id,
                        sectionName: section.section_name,
                        data: response.data || []
                    };
                } catch (error) {
                    console.error(`Error fetching data for section ${section.section_id}:`, error);
                    return {
                        sectionId: section.section_id,
                        sectionName: section.section_name,
                        data: []
                    };
                }
            });
            
            const results = await Promise.all(promises);
            setAllSectionsData(results);
        } catch (error) {
            console.error('Error fetching all sections data:', error);
            setAllSectionsData([]);
        } finally {
            setAllSectionsLoading(false);
        }
    }, [selectedMonth, selectedYear, getMonthNumber, sections, section_id]);

    const fetchConditions = useCallback(async () => {
        if (!section_id || !selectedMonth) return;
        
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

    // Fetch attendance data
    const fetchAttendance = useCallback(async () => {
        if (!selectedMonth) return;
        
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

    // Fetch reattendance data
    const fetchReattendance = useCallback(async () => {
        if (!selectedMonth) return;
        
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
        fetchSections();
    }, [fetchSections]);

    useEffect(() => {
        if (selectedMonth) {
            fetchAttendance();
            fetchReattendance();
        }
    }, [selectedMonth, fetchAttendance, fetchReattendance]);

    useEffect(() => {
        if (selectedMonth && section_id) {
            fetchConditions();
        }
    }, [selectedMonth, section_id, fetchConditions]);

    useEffect(() => {
        if (sections.length > 0) {
            fetchAllSectionsData();
        }
    }, [sections, fetchAllSectionsData]);

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
                <h5 className="card-title text-muted">No Data Available</h5>
                <p className="card-text text-muted">
                    No data found for the selected section and month ({selectedMonth} {selectedYear}). 
                    Please check if data has been uploaded for this period.
                </p>
            </div>
        </div>
    );

    const hasData = conditions.length > 0;
    const hasAttendanceData = attendanceData.length > 0 || reattendanceData.length > 0;
    const hasAllSectionsData = allSectionsData.some(section => section.data.length > 0);
    const currentTitle = section_id ? `${section_id} ${sectionTitles[section_id] || ''}` : '';

    // Helper function to get value for cell
    const getValueForCell = (item, ageGroup, gender, isAttendance = false) => {
        const ageKeyMap = isAttendance ? {
            "0-28d": "0-28d",
            "29d-4y": "29d-4y",
            "5-9y": "5-9y",
            "10-19y": "10-19y",
            "20y+": "20y+"
        } : {
                                    "0-28d": "0_28d",
                                    "29d-4y": "29d_4y",
                                    "5-9y": "5_9y",
                                    "10-19y": "10_19y",
                                    "20y+": "20y_plus"
                                };
                                const key = `${ageKeyMap[ageGroup]}_${gender.toLowerCase() === 'm' ? 'male' : 'female'}`;
                                return item[key] || "0";
                            };

    // Helper function to render table rows
    const renderTableRows = (data, isAttendance = false, categoryName = '') => {
        return data.map(item => (
            <tr key={`${isAttendance ? 'attendance' : 'conditions'}-${item.hmis_code}`}>
                <td className="section-title-bg" style={{ fontWeight: "normal" }}>{categoryName || item.hmis_name}</td>
                                    {Object.keys(ageGroupMapping).map(ageKey =>
                                        genders.map(gender => (
                                            <td key={`${ageKey}-${gender}`} className="text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                className="compact-input"
                                value={getValueForCell(item, ageKey, gender, isAttendance)}
                                                    readOnly
                                                />
                                            </td>
                                        ))
                                    )}
                                </tr>
        ));
    };

    return (
        <div>
            <style jsx>{`
                .compact-input {
                    font-size: 0.65rem !important;
                    padding: 0.2rem 0.3rem !important;
                    height: 24px !important;
                    text-align: center !important;
                    border: 1px solid #ced4da !important;
                }
                .compact-table td {
                    padding: 0.25rem 0.3rem !important;
                    vertical-align: middle !important;
                    font-size: 0.7rem !important;
                    line-height: 1.1 !important;
                }
                .compact-table th {
                    padding: 0.3rem 0.3rem !important;
                    font-size: 0.7rem !important;
                    font-weight: 500 !important;
                }
                .compact-table .ps-4 {
                    padding-left: 0.8rem !important;
                }
                .compact-table .ps-5 {
                    padding-left: 1.2rem !important;
                }
                .compact-table {
                    font-size: 0.7rem !important;
                    width: 100% !important;
                    table-layout: fixed !important;
                }
                .section-subheader {
                    font-size: 0.8rem !important;
                    margin-bottom: 0.4rem !important;
                    font-weight: 500 !important;
                }
                .section-header {
                    font-size: 0.9rem !important;
                    font-weight: 600 !important;
                }
                .data-entry-table {
                    font-size: 0.7rem !important;
                    width: 100% !important;
                    table-layout: fixed !important;
                }
                .table-header-bg {
                    background-color: #f8f9fa !important;
                }
                .section-title-bg {
                    background-color: #f8f9fa !important;
                    color: black !important;
                    font-weight: normal !important;
                }
                .full-width-table {
                    width: 100% !important;
                    min-width: 100% !important;
                }
                .table-container {
                    width: 100% !important;
                    overflow-x: auto !important;
                }
            `}</style>
            
            <div className="section-header mb-3">
                <h4 className="mb-0">HMIS 105:01 - Conditions Report</h4>
            </div>

            {section_id && (
                <div className="mb-3">
                    <h5 className="text-primary">{currentTitle}</h5>
                </div>
            )}

            {!section_id ? (
                // Show all sections with attendance data when no specific section is selected
                <>
                    {/* Attendance Section - Always show when no section is selected */}
                    {(attendanceLoading || reattendanceLoading) ? (
                        <Spinner />
                    ) : (
                        <div className="mb-4">
                            <div className="section-subheader">1.1 - Outpatient Attendance</div>
                            <div className="table-container">
                                <table className="data-entry-table compact-table">
                                    <thead className="table-header-bg">
                                        <tr>
                                            <th rowSpan="2" className="align-middle" style={{ fontWeight: "normal" }}>Category</th>
                                            {ageGroups.map((ag, i) => (
                                                <th key={i} colSpan={2} className="text-center" style={{ fontWeight: "normal" }}>{ag}</th>
                                            ))}
                                        </tr>
                                        <tr>
                                            {ageGroups.map((_, i) => (
                                                genders.map(g => <th key={i + g} className="text-center" style={{ fontWeight: "normal" }}>{g}</th>)
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hasAttendanceData ? (
                                            <>
                                                {renderTableRows(attendanceData, true, 'New Attendance')}
                                                {renderTableRows(reattendanceData, true, 'Re-attendance')}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan={ageGroups.length * 2 + 1} className="text-center text-muted py-3">
                                                    No attendance data available for {selectedMonth} {selectedYear}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* All Conditions Sections */}
                    {allSectionsLoading ? (
                        <Spinner />
                    ) : hasAllSectionsData ? (
                        <div>
                            {allSectionsData.map(section => {
                                if (section.data.length === 0) return null;
                                
                                return (
                                    <div key={section.sectionId} className="mb-4">
                                        <div className="section-subheader">
                                            {section.sectionId} - {section.sectionName}
                                        </div>
                                        <div className="table-container">
                                            <table className="data-entry-table compact-table">
                                                <thead className="table-header-bg">
                                                    <tr>
                                                        <th rowSpan="2" className="align-middle" style={{ fontWeight: "normal" }}>Diagnosis</th>
                                                        {ageGroups.map((ag, i) => (
                                                            <th key={i} colSpan={2} className="text-center" style={{ fontWeight: "normal" }}>{ag}</th>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        {ageGroups.map((_, i) => (
                                                            genders.map(g => <th key={i + g} className="text-center" style={{ fontWeight: "normal" }}>{g}</th>)
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTableRows(section.data, false)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : !hasAllSectionsData ? (
                        <div className="card" style={{ margin: '1rem 0', padding: '1rem' }}>
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    <i className="fas fa-chart-line fa-3x text-muted"></i>
                                </div>
                                <h5 className="card-title text-muted">No Conditions Data Available</h5>
                                <p className="card-text text-muted">
                                    No conditions data found for the selected month ({selectedMonth} {selectedYear}). 
                                    Please check if data has been uploaded for this period.
                                </p>
                            </div>
                        </div>
                    ) : null}
                </>
            ) : section_id === '1.1' ? (
                // Show attendance data for section 1.1
                <>
                    {(attendanceLoading || reattendanceLoading) ? (
                        <Spinner />
                    ) : hasAttendanceData ? (
                        <div className="mb-4">
                            <div className="section-subheader">1.1 - Outpatient Attendance</div>
                            <div className="table-container">
                                <table className="data-entry-table compact-table">
                                    <thead className="table-header-bg">
                                        <tr>
                                            <th rowSpan="2" className="align-middle" style={{ fontWeight: "normal" }}>Category</th>
                                            {ageGroups.map((ag, i) => (
                                                <th key={i} colSpan={2} className="text-center" style={{ fontWeight: "normal" }}>{ag}</th>
                                            ))}
                                        </tr>
                                        <tr>
                                            {ageGroups.map((_, i) => (
                                                genders.map(g => <th key={i + g} className="text-center" style={{ fontWeight: "normal" }}>{g}</th>)
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows(attendanceData, true, 'New Attendance')}
                                        {renderTableRows(reattendanceData, true, 'Re-attendance')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <NoDataCard />
                    )}
                </>
            ) : (
                // Show specific section conditions data
                <>
                    {loading ? (
                        <Spinner />
                    ) : !hasData ? (
                        <NoDataCard />
                    ) : (
                        <div className="table-container">
                            <table className="data-entry-table compact-table">
                                <thead className="table-header-bg">
                                    <tr>
                                        <th rowSpan="2" className="align-middle" style={{ fontWeight: "normal" }}>Diagnosis</th>
                                        {ageGroups.map((ag, i) => (
                                            <th key={i} colSpan={2} className="text-center" style={{ fontWeight: "normal" }}>{ag}</th>
                                        ))}
                                    </tr>
                                    <tr>
                                        {ageGroups.map((_, i) => (
                                            genders.map(g => <th key={i + g} className="text-center" style={{ fontWeight: "normal" }}>{g}</th>)
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows(conditions, false)}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ConditionsForm