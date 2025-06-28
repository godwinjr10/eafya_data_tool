import React from 'react'

const Contraceptives = () => {

    const contraceptivesDispensed = [
        { code: "CT01", label: "Oral: Lo-Femenal (cycles)" },
        { code: "CT02", label: "Oral: Microgynon (cycles)" },
        { code: "CT03", label: "Oral: Ovrette or other POP (cycles)" },
        { code: "CT04", label: "Oral: Levonogesteral(cycles)" },
        { code: "CT05", label: "Oral: Emergency contraceptives" },
        { code: "CT06", label: "Oral: Others (cycles)" },
        { code: "CT07", label: "Female condoms (pieces)" },
        { code: "CT08", label: "Male condoms (pieces)" },
        { code: "CT09", label: "Injectable 3 months IM (doses)" },
        { code: "CT10", label: "Injectable 3 months SC (doses)" },
        { code: "CT11", label: "Injectable 2 months (doses)" }
    ];

    return (
        <div>
            <>
                <div className="section-header">
                    2.6.1 CONTRACEPTIVES DISPENSED
                </div>

                <table className="data-entry-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th className="text-center">NO. DISP. AT UNIT</th>
                            <th className="text-center">NO. DISP. IN OUTREACH</th>
                            <th className="text-center">NO. DISP. BY CBDs</th>
                            <th className="text-center">NO. DISP. BY PHARMACY/DRUG SHOPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contraceptivesDispensed.map(item => (
                            <tr key={item.code}>
                                <td>{item.code}. {item.label}</td>
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

export default Contraceptives