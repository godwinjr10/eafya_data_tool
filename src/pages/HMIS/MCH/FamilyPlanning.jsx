import React from 'react'

const FamilyPlanning = () => {

    const familyPlanningMethods = [
        { code: "FP01", label: "Oral: Lo-Femenal" },
        { code: "FP02", label: "Oral: Microgynon" },
        { code: "FP11", label: "4 year implant (e.g. Sino plant)" },
        { code: "FP12", label: "5 year implant (e.g. Jadelle)" }
    ];

    return (
        <div><>
            <div className="section-header">
                2.6 FAMILY PLANNING METHODS
            </div>

            <table className="data-entry-table">
                <thead>
                    <tr>
                        <th rowSpan="2">Category</th>
                        <th colSpan="2" className="text-center">Below 15 years</th>
                        <th colSpan="2" className="text-center">15-19 years</th>
                        <th colSpan="2" className="text-center">20-24 years</th>
                        <th colSpan="2" className="text-center">25-49 years</th>
                        <th colSpan="2" className="text-center">50+ years</th>
                    </tr>
                    <tr>
                        {Array(5).fill().map((_, i) => (
                            <React.Fragment key={i}>
                                <th className="text-center">NEW USERS</th>
                                <th className="text-center">REVISITS</th>
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {familyPlanningMethods.map(method => (
                        <tr key={method.code}>
                            <td>{method.code}. {method.label}</td>
                            {Array(5).fill().map((_, i) => (
                                <React.Fragment key={i}>
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                        />
                                    </td>
                                </React.Fragment>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </></div>
    )
}

export default FamilyPlanning