import React from 'react'

const Antenatal = () => {

    const ageGroups = [
        "Below 15 years",
        "15-19 years",
        "20-24 years",
        "25-49 years",
        "50+ years"
    ];

    const antenatalCategories = [
        { code: "AN01", label: "ANC 1st Contact/Visit for women" },
        { code: "AN02", label: "ANC 4th Contact/Visit for women" },
        { code: "AN17", label: "No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit" },
        { code: "AN18", label: "No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit" },
        { code: "AN19", label: "No. of pregnant women who were tested for anaemia using Hb test at ANC after 36 weeks" },
        { code: "AN20", label: "No. of pregnant women with Anaemia (Hb <10g/dl) at ANC after 36 weeks" },
        { code: "AN21", label: "Pregnant Women receiving at least 30 tablets of Folic Acid and Iron Sulphate at ANC 1st contact / visit (Only Folic Acid recommended during 1st trimester)" },
        { code: "AN22", label: "Pregnant Women receiving at least 30 tablets of Folic Acid and Iron Sulphate at ANC after 36 weeks of gestation" },
        { code: "AN23", label: "Pregnant Women receiving LLINs at ANC 1st visit" },
        { code: "AN24", label: "No. of pregnant women who received obstetric ultra sound scan during any ANC visit in the reporting month" }
    ];

    return (
        <div>
            <>
                <div className="section-header">
                    2.0 MATERNAL AND CHILD HEALTH SERVICES
                </div>

                <div className="section-subheader mb-3">
                    2.1 ANTENATAL
                </div>

                <table className="data-entry-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            {ageGroups.map((ag, i) => (
                                <th key={i} className="text-center">{ag}</th>
                            ))}
                            <th>Total</th>
                            <th>No. in 1st Trimester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {antenatalCategories.map(category => (
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

export default Antenatal