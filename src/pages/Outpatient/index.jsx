import React, { useState } from 'react';
import Register from './Register';
import Referrals from './Referrals';

const Outpatient = () => {
    const [selectedReport, setSelectedReport] = useState('Register');

    const handleReportChange = (report) => {
        setSelectedReport(report);
    };

    const reports = [
        { id: 1, name: 'Register' },
        { id: 2, name: 'Referrals' }
    ];

    const renderFormHeader = () => (
        <div className="report-selector mb-4">
            <div className="row">
                <div className="col-md-6">
                    <label className="form-label">DataSet Reports</label>
                    <select
                        className="form-select"
                        value={selectedReport}
                        onChange={(e) => handleReportChange(e.target.value)}
                    >
                        {reports.map(report => (
                            <option key={report.id} value={report.name}>
                                {report.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button className="validation-button">
                            <i className="bi bi-check2-circle me-2"></i>
                            Download
                        </button>
                        <button className="btn btn-secondary">
                            <i className="bi bi-printer me-2"></i>
                            Print PDF
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="row">
                <div className="col-md-4">
                    <label className="form-label">Period</label>
                    <select className="form-select">
                        <option>April 2025</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary me-2">Prev year</button>
                    <button className="btn btn-primary">Next year</button>
                </div>
                </div>
            </div> */}
        </div>
    );

    const renderFormContent = () => {
        switch (selectedReport) {
            case 'Register':
                return <Register />;
            case 'Referrals':
                return <Referrals />;
            default:
                return <div>Please select a data set report</div>;
        }
    };

    return (
        <div>
            {renderFormHeader()}
            {renderFormContent()}
        </div>
    );
}

export default Outpatient