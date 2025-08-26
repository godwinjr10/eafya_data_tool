import React, { useState } from "react";
import { Alert, Spinner } from 'react-bootstrap';
import API from "../../helpers/api";

const AddUsers = ({ close, refresh }) => {
    const [password, setPassword] = useState("");
    const [username, setuserName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setlastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, variant: 'success', message: '' });

        const data = {
            password,
            username,
            role: 'public',
            firstname,
            lastname
        }

        try {
            const response = await API.post("/users/register", data);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            setAlert({ show: true, variant: 'success', message: 'User Added Successfully' });
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            setAlert({ show: true, variant: 'danger', message: 'Error while adding new user' });
        }
    };

    return (
        <div class="card custom-card">
            <div class="card-body">
                {alert.show && (
                    <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                        {alert.message}
                    </Alert>
                )}
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">User Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter User Name"
                                    value={username}
                                    onChange={(e) => setuserName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Password</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter First Name"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Last Name</label>
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
                            {loading ? <Spinner animation="border" variant="primary" /> : "Add New User"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddUsers