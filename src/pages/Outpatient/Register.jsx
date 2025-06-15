import React, { useState } from 'react';
import { Table, Pagination, Form, Row, Col } from 'react-bootstrap';

// Sample data - replace with actual API call in production
const samplePatients = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Patient ${index + 1}`,
  age: Math.floor(Math.random() * 80) + 1,
  gender: Math.random() > 0.5 ? 'Male' : 'Female',
  dateRegistered: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
  visitType: Math.random() > 0.5 ? 'New Visit' : 'Follow-up',
  diagnosis: ['Malaria', 'Hypertension', 'Diabetes', 'RTI', 'Pneumonia'][Math.floor(Math.random() * 5)],
  status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)]
}));

const Register = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const itemsPerPage = 20;

  // Filter patients based on search term and date range
  const filteredPatients = samplePatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const patientDate = new Date(patient.dateRegistered);
    const isWithinDateRange = (!fromDate || patientDate >= new Date(fromDate)) &&
      (!toDate || patientDate <= new Date(toDate));

    return matchesSearch && isWithinDateRange;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

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
      <h2 className="mb-4">Outpatient Register</h2>
      
      {/* Search and Filter Section */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search by patient name or diagnosis..."
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

      {/* Patient table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Date Registered</th>
            <th>Visit Type</th>
            <th>Diagnosis</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.dateRegistered}</td>
              <td>{patient.visitType}</td>
              <td>{patient.diagnosis}</td>
              <td>{patient.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} entries
        </div>
        <Pagination>{paginationItems}</Pagination>
      </div>
    </div>
  );
};

export default Register;