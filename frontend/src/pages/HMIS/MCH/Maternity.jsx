import React from 'react'

const Maternity = () => {
    const ageGroups = [
        "Below 15 Years",
        "15-19 Years",
        "20-24 Years",
        "25-49 Years",
        "50+ Years"
    ];

    // Split data into two arrays for left and right columns
    const leftColumnData = [
        { code: "MA01", label: "Admissions", type: "single" },
        { 
            code: "MA02",
            label: "Referrals to maternity unit",
            type: "group",
            subItems: [
                { label: "Total" },
                { label: "From community" }
            ]
        },
        { code: "MA03", label: "Referrals from maternity", type: "single" },
        {
            code: "MA04",
            label: "Total deliveries in the unit",
            type: "age_groups"
        },
        {
            code: "MA05",
            label: "Births in the unit",
            type: "group",
            subItems: [
                {
                    code: "MA05a",
                    label: "Live births",
                    subItems: [
                        { label: "Total" },
                        { label: "<2.5kgs" }
                    ]
                },
                {
                    code: "MA05b",
                    label: "Fresh still birth",
                    subItems: [
                        { label: "Total" },
                        { label: "<2.5kgs" }
                    ]
                },
                {
                    code: "MA05c",
                    label: "Macerated still birth",
                    subItems: [
                        { label: "Total" },
                        { label: "<2.5kgs" }
                    ]
                }
            ]
        },
        {
            code: "MA14",
            label: "No. of mothers who initiated breastfeeding within the 1st hour after delivery",
            type: "group",
            subItems: [
                { label: "Total" },
                { label: "HIV POS" }
            ]
        },
        {
            code: "MA15",
            label: "Women tested for HIV in labour 1st time this Pregnancy",
            type: "group",
            subItems: [
                { label: "NEG" },
                { label: "POS" }
            ]
        },
        {
            code: "MA16",
            label: "Women re-tested for HIV in labour",
            type: "group",
            subItems: [
                { label: "NEG" },
                { label: "POS" }
            ]
        },
        { code: "MA17", label: "HIV+ women initiating ART in maternity", type: "single" },
        {
            code: "MA18",
            label: "Male partners received HIV test results in the maternity setting",
            type: "group",
            subItems: [
                { label: "NEG" },
                { label: "POS" }
            ]
        },
        { code: "MA19", label: "HIV+ male partners initiated on ART in the maternity setting", type: "single" },
        { code: "MA20", label: "No. of discordant couples identified in maternity", type: "single" },
        {
            code: "MA21",
            label: "Deliveries to HIV+ women in unit",
            type: "group",
            subItems: [
                { label: "Total" },
                { label: "Live births" }
            ]
        },
        {
            code: "MA22",
            label: "HIV Exposed infants given ARVs",
            type: "group",
            subItems: [
                { label: "Total number" },
                { label: "No. of high-risk infants" }
            ]
        }
    ];

    const rightColumnData = [
        {
            code: "MA06",
            label: "Mothers admitted with preterm labour",
            type: "group",
            subItems: [
                { label: "Total" },
                { label: "Given Corticosteroids" }
            ]
        },
        {
            code: "MA07",
            label: "Pre-terms births in the unit",
            type: "group",
            subItems: [
                { label: "Total" },
                { label: "Alive" }
            ]
        },
        { code: "MA08", label: "No. of pre-term low birth weight babies (<2.5 Kg) initiated on kangaroo (KMC)", type: "single" },
        { code: "MA09", label: "Live babies at discharge", type: "single" },
        { code: "MA10", label: "No. of Babies received LLINs", type: "single" },
        {
            code: "MA11",
            label: "Total No. of Babies born with defects",
            type: "group",
            subItems: [
                { label: "Clubfoot" },
                { label: "Other defects" }
            ]
        },
        { code: "MA12", label: "Newborn deaths (0-7 days)", type: "single" },
        {
            code: "MA13",
            label: "Maternal deaths",
            type: "age_groups"
        },
        { code: "MA23", label: "No. of babies with Birth asphyxia", type: "single" },
        { code: "MA24", label: "No. of Live babies Successfully Resuscitated", type: "single" },
        {
            code: "MA25",
            label: "No. received PNC check at 6 hours after birth",
            type: "group",
            subItems: [
                { label: "Baby" },
                { label: "Mother" }
            ]
        },
        {
            code: "MA26",
            label: "No. received PNC within 24 hours after birth",
            type: "group",
            subItems: [
                { label: "Baby" },
                { label: "Mother" }
            ]
        },
        {
            code: "MA27",
            label: "No. of women who received Uterotonic in management of 3rd stage of labour",
            type: "group",
            subItems: [
                { label: "Oxytocin" },
                { label: "Misoprostol" },
                { label: "Heat stable Carbetocin" },
                { label: "Ergometrine" }
            ]
        },
        {
            code: "MA28",
            label: "No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)",
            type: "group",
            subItems: [
                { label: "Oxytocin" },
                { label: "Misoprostol" },
                { label: "Tranexamic" },
                { label: "Ergometrine" }
            ]
        }
    ];

    const renderInputCell = () => (
        <td className="text-center" style={{ paddingLeft: '10px' }}>
            <input
                type="number"
                min="0"
                className="form-control form-control-sm"
                style={{ width: '80px', margin: '0 auto' }}
            />
        </td>
    );

    const renderRow = (item, indent = false) => {
        if (item.type === "age_groups") {
            return (
                <>
                    <tr className="bg-light">
                        <td className={indent ? "ps-4" : ""} style={{ paddingRight: '20px' }}>
                            {item.code && `${item.code}. `}{item.label}
                        </td>
                        <td></td>
                    </tr>
                    {ageGroups.map((age, idx) => (
                        <tr key={idx}>
                            <td className="ps-4" style={{ paddingRight: '20px' }}>{age}</td>
                            {renderInputCell()}
                        </tr>
                    ))}
                </>
            );
        }

        if (item.type === "group" && item.subItems) {
            return (
                <>
                    <tr className="bg-light">
                        <td className={indent ? "ps-4" : ""} style={{ paddingRight: '20px' }}>
                            {item.code && `${item.code}. `}{item.label}
                        </td>
                        <td></td>
                    </tr>
                    {item.subItems.map((subItem, idx) => (
                        subItem.subItems ? 
                            renderRow(subItem, true) :
                            <tr key={idx}>
                                <td className="ps-4" style={{ paddingRight: '20px' }}>{subItem.label}</td>
                                {renderInputCell()}
                            </tr>
                    ))}
                </>
            );
        }

        return (
            <tr className={item.code ? "bg-light" : ""}>
                <td className={indent ? "ps-4" : ""} style={{ paddingRight: '20px' }}>
                    {item.code && `${item.code}. `}{item.label}
                </td>
                {renderInputCell()}
            </tr>
        );
    };

    const renderTable = (data, title) => (
        <table className="data-entry-table" style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '75%', textAlign: 'left' }}>Category</th>
                    <th style={{ width: '25%', textAlign: 'center' }}>Total</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <React.Fragment key={idx}>
                        {renderRow(item)}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            <div className="section-header mb-3">
                2.2 MATERNITY
            </div>

            <div className="row">
                <div className="col-6" style={{ paddingRight: '15px' }}>
                    {renderTable(leftColumnData)}
                </div>
                <div className="col-6" style={{ paddingLeft: '15px' }}>
                    {renderTable(rightColumnData)}
                </div>
            </div>
        </div>
    )
}

export default Maternity