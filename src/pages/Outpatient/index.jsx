import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import ReportHeader from '../../components/ReportHeader';
import OutpatientReport from './OutpatientReport';
import InpatientReport from './InpatientReport';
import api from '../../helpers/api';

const Outpatient = () => {
    const [selectedReport, setSelectedReport] = useState('OutPatient Register');
    const [fromDate, setFromDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPdfReport, setShowPdfReport] = useState(false);

    const reports = [
        { id: 1, name: 'OutPatient Register' },
        { id: 2, name: 'InPatient Register' }
    ];

    const handleReportChange = (report) => {
        setSelectedReport(report);
        setReportData([]); // Clear existing data when switching reports
        fetchReportData(report); // Fetch new data for the selected report
    };

    const handleDateChange = (field, value) => {
        if (field === 'fromDate') {
            setFromDate(value);
        } else {
            setToDate(value);
        }
    };

    const fetchReportData = async (reportType = selectedReport) => {
        try {
            setLoading(true);
            setError(null);
            const endpoint = reportType === 'OutPatient Register' ? '/outpatient' : '/outpatient/inpatient';
            const response = await api.get(`${endpoint}?from_date=${fromDate}&to_date=${toDate}`);
            setReportData(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [fromDate, toDate, selectedReport]);

    const handlePrint = () => {
        setShowPdfReport(true);
    };

    // Reset PDF report state after it's generated
    useEffect(() => {
        if (showPdfReport) {
            setShowPdfReport(false);
        }
    }, [showPdfReport]);

    const renderTableHeaders = () => {
        if (selectedReport === 'OutPatient Register') {
            return (
                <tr>
                    <th>Patient ID</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Clinic</th>
                    <th>Visit Type</th>
                    <th>Disease</th>
                    <th>Classification</th>
                    <th>Date</th>
                </tr>
            );
        } else {
            return (
                <tr>
                    <th>Patient ID</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Ward</th>
                    <th>Admission Date</th>
                    <th>Discharge Date</th>
                    <th>Diagnosis</th>
                    <th>Outcome</th>
                </tr>
            );
        }
    };

    const renderTableRow = (row, index) => {
        if (selectedReport === 'OutPatient Register') {
            return (
                <tr key={index}>
                    <td>{row.patient_id}</td>
                    <td>{row.age}</td>
                    <td>{row.gender}</td>
                    <td>{row.clinic}</td>
                    <td>{row.visit_type_name}</td>
                    <td>{row.disease_name}</td>
                    <td>{row.classification}</td>
                    <td>{format(new Date(row.date_created), 'dd/MM/yyyy')}</td>
                </tr>
            );
        } else {
            return (
                <tr key={index}>
                    <td>{row.patient_id}</td>
                    <td>{row.age}</td>
                    <td>{row.gender}</td>
                    <td>{row.admission_ward_name}</td>
                    <td>{format(new Date(row.date_created), 'dd/MM/yyyy')}</td>
                    <td>{row.medical_discharge_date ? format(new Date(row.medical_discharge_date), 'dd/MM/yyyy') : '-'}</td>
                    <td>{row.diagnosis || '-'}</td>
                    <td>{row.outcome || '-'}</td>
                </tr>
            );
        }
    };

    return (
        <div className="container-fluid">
            <ReportHeader
                reports={reports}
                selectedReport={selectedReport}
                onReportChange={handleReportChange}
                fromDate={fromDate}
                toDate={toDate}
                onDateChange={handleDateChange}
                onPrint={handlePrint}
            />

            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            {renderTableHeaders()}
                        </thead>
                        <tbody>
                            {reportData.map((row, index) => renderTableRow(row, index))}
                        </tbody>
                    </table>
                </div>
            )}

            {showPdfReport && selectedReport === 'OutPatient Register' && (
                <OutpatientReport 
                    data={reportData}
                    reportPeriod={`${format(new Date(fromDate), 'dd/MM/yyyy')} - ${format(new Date(toDate), 'dd/MM/yyyy')}`}
                />
            )}

            {showPdfReport && selectedReport === 'InPatient Register' && (
                <InpatientReport 
                    data={reportData}
                    reportPeriod={`${format(new Date(fromDate), 'dd/MM/yyyy')} - ${format(new Date(toDate), 'dd/MM/yyyy')}`}
                />
            )}
        </div>
    );
};

export default Outpatient;