import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Form,
    Modal,
    Container,
    Row,
    Col,
    Alert,
    Pagination
} from 'react-bootstrap';
import API from "../../helpers/api";

const Facility = () => {
    const [facilities, setFacilities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [facilityName, setFacilityName] = useState('');
    const [dhis2Code, setDhis2Code] = useState('');
    const [editingFacility, setEditingFacility] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFacilities = async () => {
        try {
            const response = await API.get(`/facility?page=${page}&limit=10`);
            setFacilities(response.data.facility);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            showAlert('Error fetching facilities', 'danger');
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, [page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const facilityData = {
                facility_name: facilityName,
                dhis2_code: dhis2Code || null
            };

            if (editingFacility) {
                await API.patch(`/facility/${editingFacility.id}`, facilityData);
                showAlert('Facility updated successfully');
            } else {
                await API.post('/facility', facilityData);
                showAlert('Facility added successfully');
            }
            setShowModal(false);
            setFacilityName('');
            setDhis2Code('');
            setEditingFacility(null);
            fetchFacilities();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error saving facility', 'danger');
        }
    };

    const handleEdit = (facility) => {
        setEditingFacility(facility);
        setFacilityName(facility.facility_name);
        setDhis2Code(facility.dhis2_code || '');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this facility?')) {
            try {
                await API.delete(`/facility/${id}`);
                showAlert('Facility deleted successfully');
                fetchFacilities();
            } catch (error) {
                showAlert('Error deleting facility', 'danger');
            }
        }
    };

    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === page}
                    onClick={() => setPage(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Facilities Management</h2>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditingFacility(null);
                            setFacilityName('');
                            setDhis2Code('');
                            setShowModal(true);
                        }}
                    >
                        Add New Facility
                    </Button>
                </Col>
            </Row>

            {alert.show && (
                <Alert variant={alert.variant} className="mb-3">
                    {alert.message}
                </Alert>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Facility Name</th>
                        <th>DHIS2 Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {facilities.map((facility) => (
                        <tr key={facility.id}>
                            <td>{facility.id}</td>
                            <td>{facility.facility_name}</td>
                            <td>{facility.dhis2_code || '-'}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(facility)}
                                >
                                    <i className="bi bi-pencil"></i> Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(facility.id)}
                                >
                                    <i className="bi bi-trash"></i> Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {renderPagination()}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Facility Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter facility name"
                                value={facilityName}
                                onChange={(e) => setFacilityName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>DHIS2 Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter DHIS2 code (optional)"
                                value={dhis2Code}
                                onChange={(e) => setDhis2Code(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingFacility ? 'Update' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Facility;