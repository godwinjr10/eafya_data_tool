import React from 'react'

const FamilyPlanning = () => {
    return (
        <div>
            <div className="section-header">
                2.4 FAMILY PLANNING METHODS
            </div>

            <table className="data-entry-table">
                <thead>
                    <tr>
                        <th rowSpan="3">2.4.1 Family Planning Client Visits</th>
                        <th colSpan="2">Below 15 Yrs</th>
                        <th colSpan="2">15-19 Yrs</th>
                        <th colSpan="2">20-24 Yrs</th>
                        <th colSpan="2">25-49 Yrs</th>
                        <th colSpan="2">50+ Yrs</th>
                    </tr>
                    <tr>
                        <th>New users</th>
                        <th>Revisits</th>
                        <th>New users</th>
                        <th>Revisits</th>
                        <th>New users</th>
                        <th>Revisits</th>
                        <th>New users</th>
                        <th>Revisits</th>
                        <th>New users</th>
                        <th>Revisits</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>FP01. Combined Oral Contraceptives Pills (COCs)</td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                    </tr>
                    <tr>
                        <td>FP02. Progesterone Only Pills (POP)</td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                    </tr>
                    <tr>
                        <td>FP03. Emergency Contraceptive Pills (ECP)</td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                        <td><input type="number" className="form-control form-control-sm" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default FamilyPlanning