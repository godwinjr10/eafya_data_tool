import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import API from "../../helpers/api"
import Adduser from './AddUser';
import EditUser from './EditUser';
import { Modal, Table, Button, Spinner } from 'react-bootstrap';

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    
    const handleEditShow = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };
    const handleEditClose = () => {
        setSelectedUser(null);
        setShowEditModal(false);
    };
    
    const handleDeleteShow = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };
    const handleDeleteClose = () => {
        setSelectedUser(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        
        setLoading(true);
        try {
            await API.delete(`/users/${selectedUser.id}`);
            handleDeleteClose();
            loadUsers();
        } catch (error) {
            console.log("error", error);
        }
        setLoading(false);
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/users`);
            console.log(res)
            setUsers(res?.data.users);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const tableColumns = [
        { key: 'username', label: 'Username' },
        { key: 'firstname', label: 'First Name' },
        { key: 'lastname', label: 'lastname' },
        { key: 'role', label: 'role' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <Fragment>
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Adduser close={handleClose} refresh={loadUsers} />
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={handleEditClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditUser close={handleEditClose} refresh={loadUsers} user={selectedUser} />
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete user {selectedUser?.username}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="row">
                <div className="col-12">
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-4 mt-4 font-size-18">Data Tool Facility Users</h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><Link to="/ict/assets">Users</Link></li>
                                <li className="breadcrumb-item active">Listing</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            {loading && !showDeleteModal ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                        <input type="text" className="form-control" id="searchTableList" placeholder="Search..." />
                                        <i className="bx bx-search-alt search-icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="text-sm-end">
                                    <Button variant="primary" onClick={handleShow}>
                                        Add New User
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    {tableColumns.map((column) => (
                                        <th key={column.key}>{column.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        {tableColumns.map((column) => {
                                            if (column.key === 'actions') {
                                                return (
                                                    <td key={column.key}>
                                                        <Button 
                                                            variant="info" 
                                                            size="sm" 
                                                            className="me-2"
                                                            onClick={() => handleEditShow(user)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleDeleteShow(user)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                );
                                            }
                                            return <td key={column.key}>{user[column.key]}</td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default Users