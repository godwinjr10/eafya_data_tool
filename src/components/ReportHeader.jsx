import React from 'react';

const ReportHeader = ({ 
    reports, 
    selectedReport, 
    onReportChange,
    fromDate,
    toDate,
    onDateChange,
    onPrint 
}) => {
    return (
        <div className="report-selector mb-4">
            <div className="row">
                <div className="col-md-3">
                    <label className="form-label">eAFYA Reports</label>
                    <select
                        className="form-select"
                        value={selectedReport}
                        onChange={(e) => onReportChange(e.target.value)}
                    >
                        {reports.map(report => (
                            <option key={report.id} value={report.name}>
                                {report.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">From Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => onDateChange('fromDate', e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">To Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => onDateChange('toDate', e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button 
                            className="btn btn-primary"
                            onClick={onPrint}
                        >
                            <i className="bi bi-printer me-2"></i>
                            Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportHeader; 