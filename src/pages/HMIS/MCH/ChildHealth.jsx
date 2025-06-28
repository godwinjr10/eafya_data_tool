import React from 'react'

const ChildHealth = () => {

    const childHealthCategories = [
        { code: "CH01", label: "No. of babies born alive" },
        { code: "CH02", label: "No. of babies born with low birth weight (<2.5kg)" },
        { code: "CH03", label: "No. of babies born with birth asphyxia" },
        { code: "CH04", label: "No. of babies born with birth defects" },
        { code: "CH05", label: "No. of babies initiated on KMC" },
        { code: "CH06", label: "No. of babies discharged alive on KMC" },
        { code: "CH07", label: "No. of babies who died while on KMC" },
        { code: "CH08", label: "No. of babies born to HIV positive mothers" },
        { code: "CH09", label: "No. of babies born to HIV positive mothers given ARVs within 72 hours" }
    ];

    return (
        <div>
            <>
                <div className="section-header">
                    2.3 CHILD HEALTH
                </div>

                <table className="data-entry-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Male</th>
                            <th>Female</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {childHealthCategories.map(category => (
                            <tr key={category.code}>
                                <td>{category.code}. {category.label}</td>
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        </div>
    )
}

export default ChildHealth