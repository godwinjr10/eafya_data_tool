import React, { useState, useEffect } from "react";
import { Alert, Spinner } from 'react-bootstrap';
import API from "../../helpers/api";

const EditUser = ({ close, refresh, user }) => {
    const [username, setuserName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setlastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });

    useEffect(() => {
        if (user) {
            setuserName(user.username || "");
            setFirstName(user.firstname || "");
            setlastName(user.lastname || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, variant: 'success', message: '' });

        const data = {
            username,
            firstname,
            lastname
        }

        try {
            const response = await API.patch(`/users/${user.id}`, data);
            setLoading(false);
            close();
            refresh();
            setAlert({ show: true, variant: 'success', message: 'User Updated Successfully' });
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            setAlert({ show: true, variant: 'danger', message: 'Error while updating user' });
        }
    };

    return (
        <div className="card custom-card">
            <div className="card-body">
                {alert.show && (
                    <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                        {alert.message}
                    </Alert>
                )}
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" className="body current" aria-hidden="false">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="kycselectcity-input" className="form-label">User Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter User Name"
                                    value={username}
                                    onChange={(e) => setuserName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="kycselectcity-input" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter First Name"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="kycselectcity-input" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Last Name"
                                    value={lastname}
                                    onChange={(e) => setlastName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <Spinner animation="border" variant="primary" /> : "Update User"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default EditUser; 