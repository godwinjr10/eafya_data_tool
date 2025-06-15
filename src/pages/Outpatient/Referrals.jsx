import React, { useState } from 'react';
import { Table, Pagination, Form, Row, Col } from 'react-bootstrap';

// Sample data - replace with actual API call in production
const sampleReferrals = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  patientName: `Patient ${index + 1}`,
  age: Math.floor(Math.random() * 80) + 1,
  gender: Math.random() > 0.5 ? 'Male' : 'Female',
  referralDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
  referredFrom: ['Health Center', 'District Hospital', 'Private Clinic', 'Community Health Worker'][Math.floor(Math.random() * 4)],
  referredTo: ['National Hospital', 'Regional Hospital', 'Specialist Clinic', 'District Hospital'][Math.floor(Math.random() * 4)],
  reason: ['Specialist Consultation', 'Advanced Diagnostics', 'Surgery', 'Emergency Care', 'Specialized Treatment'][Math.floor(Math.random() * 5)],
  priority: ['Urgent', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
  status: ['Pending', 'In Transit', 'Received', 'Completed', 'Cancelled'][Math.floor(Math.random() * 5)]
}));

const Referrals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const itemsPerPage = 20;

  // Filter referrals based on search term and date range
  const filteredReferrals = sampleReferrals.filter(referral => {
    const matchesSearch = referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referredFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referredTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const referralDate = new Date(referral.referralDate);
    const isWithinDateRange = (!fromDate || referralDate >= new Date(fromDate)) &&
      (!toDate || referralDate <= new Date(toDate));

    return matchesSearch && isWithinDateRange;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedReferrals = filteredReferrals.slice(startIndex, startIndex + itemsPerPage);

  // Generate pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Handle date filter changes
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Patient Referrals</h2>
      
      {/* Search and Filter Section */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search by patient name, facility, or reason..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Control
              type="date"
              placeholder="From Date"
              value={fromDate}
              onChange={handleFromDateChange}
              max={toDate || undefined}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Control
              type="date"
              placeholder="To Date"
              value={toDate}
              onChange={handleToDateChange}
              min={fromDate || undefined}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Referrals table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Referral Date</th>
            <th>Referred From</th>
            <th>Referred To</th>
            <th>Reason</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedReferrals.map(referral => (
            <tr key={referral.id}>
              <td>{referral.id}</td>
              <td>{referral.patientName}</td>
              <td>{referral.age}</td>
              <td>{referral.gender}</td>
              <td>{referral.referralDate}</td>
              <td>{referral.referredFrom}</td>
              <td>{referral.referredTo}</td>
              <td>{referral.reason}</td>
              <td>
                <span className={`badge bg-${
                  referral.priority === 'Urgent' ? 'danger' :
                  referral.priority === 'High' ? 'warning' :
                  referral.priority === 'Medium' ? 'info' : 'secondary'
                }`}>
                  {referral.priority}
                </span>
              </td>
              <td>
                <span className={`badge bg-${
                  referral.status === 'Pending' ? 'warning' :
                  referral.status === 'In Transit' ? 'info' :
                  referral.status === 'Received' ? 'primary' :
                  referral.status === 'Completed' ? 'success' : 'danger'
                }`}>
                  {referral.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReferrals.length)} of {filteredReferrals.length} entries
        </div>
        <Pagination>{paginationItems}</Pagination>
      </div>
    </div>
  );
};

export default Referrals;