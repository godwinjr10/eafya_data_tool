import React, { useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ConditionsPrintReport = forwardRef(({ 
    data, 
    reportMonth, 
    section, 
    facilityName = "Health Facility",
    printedBy = "System User",
    printDate = new Date().toLocaleDateString(),
    onGeneratePDF
}, ref) => {
    const reportRef = useRef(null);
    const ageGroups = [
        "0-28 days", "29days - 4Yrs", "5 - 9Yrs", "10 - 19Yrs", "20Yrs & above"
    ];
    const genders = ["M", "F"];

    const generatePDF = useCallback(async () => {
        console.log('generatePDF called');
        if (!reportRef.current) {
            console.log('reportRef.current is null');
            alert('Report element not found. Please try again.');
            return;
        }

        try {
            console.log('Starting html2canvas...');
            const canvas = await html2canvas(reportRef.current, {
                scale: 1.25,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: true,
                width: reportRef.current.scrollWidth,
                height: reportRef.current.scrollHeight
            });

            console.log('Canvas created:', canvas.width, 'x', canvas.height);
            
            if (canvas.width === 0 || canvas.height === 0) {
                console.error('Canvas has zero dimensions');
                alert('Failed to capture report content. Please try again.');
                return;
            }

            const imgData = canvas.toDataURL('image/png', 0.8);
            console.log('Image data generated, length:', imgData.length);
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            console.log('PDF instance created');
            
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            console.log('Adding image to PDF...');
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const fileName = `HMIS_105_01_Conditions_Report_${reportMonth.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            console.log('Saving PDF with filename:', fileName);
            pdf.save(fileName);
            console.log('PDF saved successfully');
            
            if (onGeneratePDF) {
                onGeneratePDF();
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert(`Error generating PDF: ${error.message}`);
        }
    }, [reportMonth, onGeneratePDF]);

    // Expose generatePDF function to parent component
    useImperativeHandle(ref, () => ({
        generatePDF
    }), [generatePDF]);

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
                <td className="print-cell">{categoryName || item.hmis_name}</td>
                {Object.keys({
                    "0-28d": "0-28 days",
                    "29d-4y": "29days - 4Yrs",
                    "5-9y": "5 - 9Yrs",
                    "10-19y": "10 - 19Yrs",
                    "20y+": "20Yrs & above"
                }).map(ageKey =>
                    genders.map(gender => (
                        <td key={`${ageKey}-${gender}`} className="print-cell text-center">
                            {getValueForCell(item, ageKey, gender, isAttendance)}
                        </td>
                    ))
                )}
            </tr>
        ));
    };

    const getSectionTitle = (sectionId) => {
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
        return sectionTitles[sectionId] || sectionId;
    };

    return (
        <div className="print-report" ref={reportRef}>
            <style jsx>{`
                .print-report {
                    font-family: Arial, sans-serif;
                    color: black;
                    background: white;
                    padding: 20px;
                    max-width: 100%;
                }
                
                .print-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    flex-direction: column;
                }
                
                .print-logo {
                    height: 80px;
                    width: auto;
                }
                
                .print-header-content {
                    flex: 1;
                }
                
                .ministry-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1e3a8a;
                    margin-bottom: 5px;
                }
                
                .hospital-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #dc2626;
                    margin-bottom: 10px;
                }
                
                .print-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .print-subtitle {
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                
                .print-info {
                    font-size: 12px;
                    color: #666;
                }
                
                .print-section {
                    margin-bottom: 25px;
                    page-break-inside: avoid;
                }
                
                .print-section-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    background-color: #f5f5f5;
                    padding: 8px;
                    border-left: 4px solid #007bff;
                }
                
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                    font-size: 11px;
                }
                
                .print-table th,
                .print-table td {
                    border: 1px solid #333;
                    padding: 4px 6px;
                    text-align: left;
                }
                
                .print-table th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    text-align: center;
                }
                
                .print-cell {
                    font-size: 10px;
                }
                
                .print-footer {
                    margin-top: 30px;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                }
                
                @media print {
                    .print-report {
                        margin: 0;
                        padding: 15px;
                    }
                    
                    .print-table {
                        font-size: 9px;
                    }
                    
                    .print-cell {
                        font-size: 8px;
                        padding: 2px 4px;
                    }
                    
                    .print-section {
                        page-break-inside: avoid;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="print-header">
                <img 
                    src="/logo.png" 
                    alt="Ministry of Health Logo" 
                    className="print-logo"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.marginLeft = '0';
                    }}
                />
                <div className="print-header-content">
                    <div className="ministry-title">MINISTRY OF HEALTH</div>
                    <div className="ministry-title">REPUBLIC OF UGANDA</div>
                    <div className="hospital-name">{facilityName.toUpperCase()}</div>
                    <div className="print-title">HMIS 105:01 - OPD Monthly Report</div>
                    <div className="print-subtitle">(Attendances, Referrals, Conditions)</div>
                    <div className="print-info">
                        Report Period: {reportMonth} | Generated on: {printDate}
                    </div>
                </div>
            </div>

            {/* Content */}
            {!section || section === '' ? (
                // Show all sections
                <>
                    {/* Attendance Section */}
                    {data.attendance && (data.attendance.length > 0 || data.reattendance?.length > 0) && (
                        <div className="print-section">
                            <div className="print-section-title">1.1 - Outpatient Attendance</div>
                            <table className="print-table">
                                <thead>
                                    <tr>
                                        <th rowSpan="2" style={{ width: '25%' }}>Category</th>
                                        {ageGroups.map((ag, i) => (
                                            <th key={i} colSpan={2} className="text-center" style={{ fontSize: '10px' }}>{ag}</th>
                                        ))}
                                    </tr>
                                    <tr>
                                        {ageGroups.map((_, i) => (
                                            genders.map(g => <th key={i + g} className="text-center" style={{ fontSize: '9px' }}>{g}</th>)
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.attendance && data.attendance.length > 0 && renderTableRows(data.attendance, true, 'New Attendance')}
                                    {data.reattendance && data.reattendance.length > 0 && renderTableRows(data.reattendance, true, 'Re-attendance')}
                                    {(!data.attendance || data.attendance.length === 0) && (!data.reattendance || data.reattendance.length === 0) && (
                                        <tr>
                                            <td colSpan={ageGroups.length * 2 + 1} className="text-center" style={{ fontStyle: 'italic' }}>
                                                No attendance data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* All Conditions Sections */}
                    {data.allSections && data.allSections.map(sectionData => {
                        if (!sectionData.data || sectionData.data.length === 0) return null;
                        
                        return (
                            <div key={sectionData.sectionId} className="print-section">
                                <div className="print-section-title">
                                    {sectionData.sectionId} - {sectionData.sectionName}
                                </div>
                                <table className="print-table">
                                    <thead>
                                        <tr>
                                            <th rowSpan="2" style={{ width: '25%' }}>Diagnosis</th>
                                            {ageGroups.map((ag, i) => (
                                                <th key={i} colSpan={2} className="text-center" style={{ fontSize: '10px' }}>{ag}</th>
                                            ))}
                                        </tr>
                                        <tr>
                                            {ageGroups.map((_, i) => (
                                                genders.map(g => <th key={i + g} className="text-center" style={{ fontSize: '9px' }}>{g}</th>)
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows(sectionData.data, false)}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </>
            ) : section === '1.1' ? (
                // Show attendance data for section 1.1
                <div className="print-section">
                    <div className="print-section-title">1.1 - Outpatient Attendance</div>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th rowSpan="2" style={{ width: '25%' }}>Category</th>
                                {ageGroups.map((ag, i) => (
                                    <th key={i} colSpan={2} className="text-center" style={{ fontSize: '10px' }}>{ag}</th>
                                ))}
                            </tr>
                            <tr>
                                {ageGroups.map((_, i) => (
                                    genders.map(g => <th key={i + g} className="text-center" style={{ fontSize: '9px' }}>{g}</th>)
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.attendance && data.attendance.length > 0 && renderTableRows(data.attendance, true, 'New Attendance')}
                            {data.reattendance && data.reattendance.length > 0 && renderTableRows(data.reattendance, true, 'Re-attendance')}
                            {(!data.attendance || data.attendance.length === 0) && (!data.reattendance || data.reattendance.length === 0) && (
                                <tr>
                                    <td colSpan={ageGroups.length * 2 + 1} className="text-center" style={{ fontStyle: 'italic' }}>
                                        No attendance data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                // Show specific section conditions data
                <div className="print-section">
                    <div className="print-section-title">
                        {section} - {getSectionTitle(section)}
                    </div>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th rowSpan="2" style={{ width: '25%' }}>Diagnosis</th>
                                {ageGroups.map((ag, i) => (
                                    <th key={i} colSpan={2} className="text-center" style={{ fontSize: '10px' }}>{ag}</th>
                                ))}
                            </tr>
                            <tr>
                                {ageGroups.map((_, i) => (
                                    genders.map(g => <th key={i + g} className="text-center" style={{ fontSize: '9px' }}>{g}</th>)
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.conditions && data.conditions.length > 0 ? (
                                renderTableRows(data.conditions, false)
                            ) : (
                                <tr>
                                    <td colSpan={ageGroups.length * 2 + 1} className="text-center" style={{ fontStyle: 'italic' }}>
                                        No data available for this section
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Footer */}
            <div className="print-footer">
                <div>Report generated by: {printedBy}</div>
                <div>Generated on: {printDate}</div>
                <div style={{ marginTop: '10px', fontSize: '9px' }}>
                    This report contains confidential health information and should be handled according to facility data protection policies.
                </div>
            </div>
        </div>
    );
});

ConditionsPrintReport.displayName = 'ConditionsPrintReport';

export default ConditionsPrintReport;
