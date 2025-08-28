import React, { useEffect, useState } from 'react';
import API from '../../../helpers/api';

const Maternity = ({ selectedMonth, selectedYear }) => {
    const [maternityData, setMaternityData] = useState({
        totals: [],
        deliveries: [],
        livebirths: [],
        deaths: [],
        uterotonics: [],
        uter_treatment: []
    });

    const getMonthNumber = (monthName) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months.indexOf(monthName) + 1;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const monthNumber = getMonthNumber(selectedMonth);
                const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;

                const totals = await API.get(`/maternity/totals?report_month=${formattedMonth}`);
                const deliveries = await API.get(`/maternity/deliveries?report_month=${formattedMonth}`);
                const livebirths = await API.get(`/maternity/livebirths?report_month=${formattedMonth}`);
                const deaths = await API.get(`/maternity/deaths?report_month=${formattedMonth}`);
                const uterotonics = await API.get(`/maternity/uterotonics?report_month=${formattedMonth}`);
                const uter_treatment = await API.get(`/maternity/uter_treatment?report_month=${formattedMonth}`);

                setMaternityData({
                    totals: totals.data,
                    deliveries: deliveries.data,
                    livebirths: livebirths.data,
                    deaths: deaths.data,
                    uterotonics: uterotonics.data,
                    uter_treatment: uter_treatment.data
                });
            } catch (error) {
                console.error('Error fetching maternity data:', error);
            }
        };

        if (selectedMonth && selectedYear) {
            fetchData();
        }
    }, [selectedMonth, selectedYear]);

    // Split data into two arrays for left and right columns
    // const leftColumnData = [
    //     { code: "MA01", label: "Admissions", type: "single" },
    //     { 
    //         code: "MA02",
    //         label: "Referrals to maternity unit",
    //         type: "group",
    //         subItems: [
    //             { label: "Total" },
    //             { label: "From community" }
    //         ]
    //     },
    //     { code: "MA03", label: "Referrals from maternity", type: "single" },
    //     {
    //         code: "MA04",
    //         label: "Total deliveries in the unit",
    //         type: "age_groups"
    //     },
    //     {
    //         code: "MA05",
    //         label: "Births in the unit",
    //         type: "group",
    //         subItems: [
    //             {
    //                 code: "MA05a",
    //                 label: "Live births",
    //                 subItems: [
    //                     { label: "Total" },
    //                     { label: "<2.5kgs" }
    //                 ]
    //             },
    //             {
    //                 code: "MA05b",
    //                 label: "Fresh still birth",
    //                 subItems: [
    //                     { label: "Total" },
    //                     { label: "<2.5kgs" }
    //                 ]
    //             },
    //             {
    //                 code: "MA05c",
    //                 label: "Macerated still birth",
    //                 subItems: [
    //                     { label: "Total" },
    //                     { label: "<2.5kgs" }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         code: "MA14",
    //         label: "No. of mothers who initiated breastfeeding within the 1st hour after delivery",
    //         type: "group",
    //         subItems: [
    //             { label: "Total" },
    //             { label: "HIV POS" }
    //         ]
    //     },
    //     {
    //         code: "MA15",
    //         label: "Women tested for HIV in labour 1st time this Pregnancy",
    //         type: "group",
    //         subItems: [
    //             { label: "NEG" },
    //             { label: "POS" }
    //         ]
    //     },
    //     {
    //         code: "MA16",
    //         label: "Women re-tested for HIV in labour",
    //         type: "group",
    //         subItems: [
    //             { label: "NEG" },
    //             { label: "POS" }
    //         ]
    //     },
    //     { code: "MA17", label: "HIV+ women initiating ART in maternity", type: "single" },
    //     {
    //         code: "MA18",
    //         label: "Male partners received HIV test results in the maternity setting",
    //         type: "group",
    //         subItems: [
    //             { label: "NEG" },
    //             { label: "POS" }
    //         ]
    //     },
    //     { code: "MA19", label: "HIV+ male partners initiated on ART in the maternity setting", type: "single" },
    //     { code: "MA20", label: "No. of discordant couples identified in maternity", type: "single" },
    //     {
    //         code: "MA21",
    //         label: "Deliveries to HIV+ women in unit",
    //         type: "group",
    //         subItems: [
    //             { label: "Total" },
    //             { label: "Live births" }
    //         ]
    //     },
    //     {
    //         code: "MA22",
    //         label: "HIV Exposed infants given ARVs",
    //         type: "group",
    //         subItems: [
    //             { label: "Total number" },
    //             { label: "No. of high-risk infants" }
    //         ]
    //     }
    // ];

    // const rightColumnData = [
    //     {
    //         code: "MA06",
    //         label: "Mothers admitted with preterm labour",
    //         type: "group",
    //         subItems: [
    //             { label: "Total" },
    //             { label: "Given Corticosteroids" }
    //         ]
    //     },
    //     {
    //         code: "MA07",
    //         label: "Pre-terms births in the unit",
    //         type: "group",
    //         subItems: [
    //             { label: "Total" },
    //             { label: "Alive" }
    //         ]
    //     },
    //     { code: "MA08", label: "No. of pre-term low birth weight babies (<2.5 Kg) initiated on kangaroo (KMC)", type: "single" },
    //     { code: "MA09", label: "Live babies at discharge", type: "single" },
    //     { code: "MA10", label: "No. of Babies received LLINs", type: "single" },
    //     {
    //         code: "MA11",
    //         label: "Total No. of Babies born with defects",
    //         type: "group",
    //         subItems: [
    //             { label: "Clubfoot" },
    //             { label: "Other defects" }
    //         ]
    //     },
    //     { code: "MA12", label: "Newborn deaths (0-7 days)", type: "single" },
    //     {
    //         code: "MA13",
    //         label: "Maternal deaths",
    //         type: "age_groups"
    //     },
    //     { code: "MA23", label: "No. of babies with Birth asphyxia", type: "single" },
    //     { code: "MA24", label: "No. of Live babies Successfully Resuscitated", type: "single" },
    //     {
    //         code: "MA25",
    //         label: "No. received PNC check at 6 hours after birth",
    //         type: "group",
    //         subItems: [
    //             { label: "Baby" },
    //             { label: "Mother" }
    //         ]
    //     },
    //     {
    //         code: "MA26",
    //         label: "No. received PNC within 24 hours after birth",
    //         type: "group",
    //         subItems: [
    //             { label: "Baby" },
    //             { label: "Mother" }
    //         ]
    //     },
    //     {
    //         code: "MA27",
    //         label: "No. of women who received Uterotonic in management of 3rd stage of labour",
    //         type: "group",
    //         subItems: [
    //             { label: "Oxytocin" },
    //             { label: "Misoprostol" },
    //             { label: "Heat stable Carbetocin" },
    //             { label: "Ergometrine" }
    //         ]
    //     },
    //     {
    //         code: "MA28",
    //         label: "No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)",
    //         type: "group",
    //         subItems: [
    //             { label: "Oxytocin" },
    //             { label: "Misoprostol" },
    //             { label: "Tranexamic" },
    //             { label: "Ergometrine" }
    //         ]
    //     }
    // ];

    const renderRow = (item) => (
        <tr>
            <td>{item.hmis_code}. {item.indicator}</td>
            <td className="text-center">{item.value}</td>
        </tr>
    );

    const renderLiveBirthsRow = (item) => (
        <>
            <tr>
                <td>{item.hmis_code === 'MA05a' ? 'Live Births' : item.hmis_code === 'MA05b' ? 'Fresh Still Birth' : 'Macerated Still Birth'}</td>
                <td></td>
            </tr>
            <tr>
                <td className="ps-4">Total Births</td>
                <td className="text-center">{item.total_births}</td>
            </tr>
            <tr>
                <td className="ps-4">Births Under 2.5kgs</td>
                <td className="text-center">{item.births_under_2_5kgs}</td>
            </tr>
        </>
    );

    const renderAgeGroupRow = (item) => (
        <>
            <tr>
                <td>{item.hmis_code}. Deliveries</td>
                <td></td>
            </tr>
            <tr>
                <td className="ps-4">Below 15 Years</td>
                <td className="text-center">{item.below_15_years}</td>
            </tr>
            <tr>
                <td className="ps-4">15-19 Years</td>
                <td className="text-center">{item["15-19_years"]}</td>
            </tr>
            <tr>
                <td className="ps-4">20-24 Years</td>
                <td className="text-center">{item["20-24_years"]}</td>
            </tr>
            <tr>
                <td className="ps-4">25-49 Years</td>
                <td className="text-center">{item["25-49_years"]}</td>
            </tr>
            <tr>
                <td className="ps-4">50+ Years</td>
                <td className="text-center">{item["50+_years"]}</td>
            </tr>
        </>
    );

    const renderMaternalDeathsRow = (item) => (
        <>
            <tr>
                <td>{item.hmis_code}. Maternal Deaths</td>
                <td></td>
            </tr>
            <tr>
                <td className="ps-4">Under 15 Years</td>
                <td className="text-center">{item.under_15_years}</td>
            </tr>
            <tr>
                <td className="ps-4">15-19 Years</td>
                <td className="text-center">{item["15_to_19_years"]}</td>
            </tr>
            <tr>
                <td className="ps-4">20-24 Years</td>
                <td className="text-center">{item["20_to_24_years"]}</td>
            </tr>
            <tr>
                <td className="ps-4">25-49 Years</td>
                <td className="text-center">{item["25_to_49_years"]}</td>
            </tr>
            <tr>
                <td className="ps-4">50+ Years</td>
                <td className="text-center">{item["50_plus_years"]}</td>
            </tr>
        </>
    );

    const renderUterotonicsRow = (item) => (
        <>
            <tr>
                <td>{item.hmis_code}. Women Received Uterotonics (Labour)</td>
                <td></td>
            </tr>
            <tr>
                <td className="ps-4">Oxytocin</td>
                <td className="text-center">{item.oxytocin}</td>
            </tr>
            <tr>
                <td className="ps-4">Misoprostol</td>
                <td className="text-center">{item.misoprostol}</td>
            </tr>
            <tr>
                <td className="ps-4">Carbetocin</td>
                <td className="text-center">{item.carbetocin}</td>
            </tr>
            <tr>
                <td className="ps-4">Ergometrine</td>
                <td className="text-center">{item.ergometrine}</td>
            </tr>
        </>
    );

    const renderUterineTreatmentRow = (item) => (
        <>
            <tr>
                <td>{item.hmis_code}. Women Received Uterotonics (PPH)</td>
                <td></td>
            </tr>
            <tr>
                <td className="ps-4">Oxytocin</td>
                <td className="text-center">{item.oxytocin}</td>
            </tr>
            <tr>
                <td className="ps-4">Misoprostol</td>
                <td className="text-center">{item.misoprostol}</td>
            </tr>
            <tr>
                <td className="ps-4">Tranexamic Acid</td>
                <td className="text-center">{item.tranexamic_acid}</td>
            </tr>
            <tr>
                <td className="ps-4">Ergometrine</td>
                <td className="text-center">{item.ergometrine}</td>
            </tr>
        </>
    );

    const renderTable = (data, title) => (
        <table className="data-entry-table" style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '75%', textAlign: 'left' }}>{title}</th>
                    <th style={{ width: '25%', textAlign: 'center' }}>Total</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <React.Fragment key={idx}>
                        {item.hmis_code === 'MA04' ? renderAgeGroupRow(item) : item.hmis_code.startsWith('MA05') ? renderLiveBirthsRow(item) : item.hmis_code === 'MA13' ? renderMaternalDeathsRow(item) : item.hmis_code === 'MA27' ? renderUterotonicsRow(item) : item.hmis_code === 'MA28' ? renderUterineTreatmentRow(item) : renderRow(item)}
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
                    {renderTable(maternityData.totals, 'Totals')}
                    {renderTable(maternityData.deliveries, 'Total Deliveries in Unit')}
                    {renderTable(maternityData.livebirths, 'Births in Unit')}
                </div>
                <div className="col-6" style={{ paddingLeft: '15px' }}>
                    {renderTable(maternityData.deaths, 'Maternal Deaths')}
                    {renderTable(maternityData.uterotonics, 'Women Received Uterotonics (Labour)')}
                    {renderTable(maternityData.uter_treatment, 'Women Received Uterotonics (PPH)')}
                </div>
            </div>
        </div>
    );
}

export default Maternity