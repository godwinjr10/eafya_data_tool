import React from 'react'

const Maternity = () => {

    const ageGroups = [
        "Below 15 years",
        "15-19 years",
        "20-24 years",
        "25-49 years",
        "50+ years"
    ];

    const maternityCategories = [
        { code: "MT01", label: "No. of deliveries in unit" },
        { code: "MT02", label: "No. of deliveries with skilled attendance" },
        { code: "MT03", label: "No. of deliveries with unskilled attendance" },
        { code: "MT04", label: "No. of mothers with Pre-Eclampsia/Eclampsia" },
        { code: "MT05", label: "No. of mothers with Obstructed Labour" },
        { code: "MT06", label: "No. of mothers with Ruptured Uterus" },
        { code: "MT07", label: "No. of mothers with Post-Partum Hemorrhage (PPH)" },
        { code: "MT08", label: "No. of mothers with Post-Partum Sepsis" },
        { code: "MT09", label: "No. of mothers referred out during labour" }
    ];

    return (
        <div>
            <>
                <div className="section-header">
                    2.2 MATERNITY
                </div>

                <table className="data-entry-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            {ageGroups.map((ag, i) => (
                                <th key={i} className="text-center">{ag}</th>
                            ))}
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maternityCategories.map(category => (
                            <tr key={category.code}>
                                <td>{category.code}. {category.label}</td>
                                {ageGroups.map((_, i) => (
                                    <td key={i} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                        />
                                    </td>
                                ))}
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

export default Maternity