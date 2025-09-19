import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ReportHeader from '../../components/ReportHeader';
import YearStockReport from './YearStockBalance';
import OrderFufillment from './StockMovement';
import api from '../../helpers/api';

const SupplyChain = () => {
    const [selectedReport, setSelectedReport] = useState('OrderFufillment');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPdfReport, setShowPdfReport] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [total, setTotal] = useState(0);

    const reports = [
        { id: 1, name: 'YearStock' },
        { id: 2, name: 'OrderFufillment' }
    ];

    const handleReportChange = (report) => {
        setSelectedReport(report);
        setReportData([]);
        setPage(1);
        fetchReportData(report, 1, limit);
    };

    const handleDateChange = (field, value) => {
        if (field === 'fromDate') {
            setFromDate(value);
        } else {
            setToDate(value);
        }
        setPage(1);
    };

    const clearFilters = () => {
        setFromDate('');
        setToDate('');
        setPage(1);
    };

    const buildQuery = (p = page, l = limit) => {
        const params = new URLSearchParams();
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        if (selectedReport !== 'YearStock') {
            params.append('page', String(p));
            params.append('limit', String(l));
        }
        return params.toString();
    };

    const fetchReportData = async (reportType = selectedReport, p = page, l = limit) => {
        try {
            setLoading(true);
            setError(null);
            const endpoint = reportType === 'YearStock' ? '/commodities/report' : '/commodities/report/movement';
            const qs = buildQuery(p, l);
            const url = qs ? `${endpoint}?${qs}` : endpoint;
            const response = await api.get(url);
            if (reportType === 'YearStock') {
                setReportData(response.data);
                setTotal(response.data?.length || 0);
            } else {
                setReportData(response.data?.data || []);
                setTotal(response.data?.pagination?.total || 0);
            }
        } catch (err) {
            setError(err.message || 'Error fetching report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData(selectedReport, page, limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromDate, toDate, selectedReport, page, limit]);

    const handlePrint = () => {
        setShowPdfReport(true);
    };

    useEffect(() => {
        if (showPdfReport) {
            setShowPdfReport(false);
        }
    }, [showPdfReport]);

    const exportData = (fmt) => {
        const base = selectedReport === 'YearStock' ? '/commodities/report/export' : '/commodities/report/movement/export';
        const qs = buildQuery();
        const url = `${api.defaults.baseURL}${base}${qs ? `?${qs}` : ''}&format=${fmt}`;
        const a = document.createElement('a'); a.href = url; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

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
                    <th>Store ID</th>
                    <th>Store Name</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Product Type</th>
                    <th>Increment</th>
                    <th>Decrement</th>
                    <th>Level</th>
                    <th>Created By</th>
                    <th>Date Created</th>
                    <th>Last Updated</th>
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
                    <td>{row.store_id}</td>
                    <td>{row.store_name}</td>
                    <td>{row.product_id}</td>
                    <td>{row.product_name}</td>
                    <td>{row.product_type}</td>
                    <td>{row.increment}</td>
                    <td>{row.decrement}</td>
                    <td>{row.level}</td>
                    <td>{row.created_by_id}</td>
                    <td>{row.date_created ? format(new Date(row.date_created), 'dd/MM/yyyy') : ''}</td>
                    <td>{row.last_updated ? format(new Date(row.last_updated), 'dd/MM/yyyy') : ''}</td>
                </tr>
            );
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <ReportHeader
                    reports={reports}
                    selectedReport={selectedReport}
                    onReportChange={handleReportChange}
                    fromDate={fromDate}
                    toDate={toDate}
                    onDateChange={handleDateChange}
                    onPrint={handlePrint}
                />
                <div>
                    <button className="btn btn-sm btn-info me-2" onClick={() => exportData('csv')}>Export CSV</button>
                    <button className="btn btn-sm btn-success me-2" onClick={() => exportData('xlsx')}>Export Excel</button>
                    <button className="btn btn-sm btn-warning" onClick={clearFilters}>Clear Filters</button>
                </div>
            </div>

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

                    {selectedReport !== 'YearStock' && (
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                                <span>Page {page} of {totalPages}</span>
                                <button className="btn btn-sm btn-outline-secondary ms-2" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="me-2">Rows per page</label>
                                <select className="form-select form-select-sm" style={{ width: 90 }} value={limit} onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showPdfReport && selectedReport === 'YearStock' && (
                <YearStockReport 
                    data={reportData}
                    reportPeriod={`$${fromDate} - $${toDate}`}
                />
            )}

            {showPdfReport && selectedReport === 'OrderFufillment' && (
                <OrderFufillment 
                    data={reportData}
                    reportPeriod={`$${fromDate} - $${toDate}`}
                />
            )}
        </div>
    );
};

export default SupplyChain;