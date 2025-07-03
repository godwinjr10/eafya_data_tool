import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import ReportHeader from '../../components/ReportHeader';
import YearStockReport from './YearStockBalance';
import OrderFufillment from './StockMovement';
import api from '../../helpers/api';

const SupplyChain = () => {
    const [selectedReport, setSelectedReport] = useState('YearStock');
    const [fromDate, setFromDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPdfReport, setShowPdfReport] = useState(false);

    const reports = [
        { id: 1, name: 'YearStock' },
        { id: 2, name: 'OrderFufillment' }
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
            const endpoint = reportType === 'YearStock' ? '/commodities/report' : '/commodities/report/movement';
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
        if (selectedReport === 'YearStock') {
            return (
                <tr>
                    <th>Month</th>
                    <th>Store</th>
                    <th>Product</th>
                    <th>Stock Level</th>
                    <th>Last Update</th>
                </tr>
            );
        } else {
            return (
                <tr>
                    <th>Order ID</th>
                    <th>Store</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Order Date</th>
                </tr>
            );
        }
    };

    const renderTableRow = (row, index) => {
        if (selectedReport === 'YearStock') {
            return (
                <tr key={index}>
                    <td>{row.report_month}</td>
                    <td>{row.store_name}</td>
                    <td>{row.product_name}</td>
                    <td>{row.stock_level}</td>
                    <td>{format(new Date(row.last_update), 'dd/MM/yyyy')}</td>
                </tr>
            );
        } else {
            return (
                <tr key={index}>
                    <td>{row.order_id}</td>
                    <td>{row.store_name}</td>
                    <td>{row.product_name}</td>
                    <td>{row.quantity}</td>
                    <td>{row.status}</td>
                    <td>{format(new Date(row.order_date), 'dd/MM/yyyy')}</td>
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

            {showPdfReport && selectedReport === 'YearStock' && (
                <YearStockReport 
                    data={reportData}
                    reportPeriod={`${format(new Date(fromDate), 'dd/MM/yyyy')} - ${format(new Date(toDate), 'dd/MM/yyyy')}`}
                />
            )}

            {showPdfReport && selectedReport === 'OrderFufillment' && (
                <OrderFufillment 
                    data={reportData}
                    reportPeriod={`${format(new Date(fromDate), 'dd/MM/yyyy')} - ${format(new Date(toDate), 'dd/MM/yyyy')}`}
                />
            )}
        </div>
    );
};

export default SupplyChain;