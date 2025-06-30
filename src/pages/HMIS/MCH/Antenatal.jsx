import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const Antenatal = ({ selectedMonth, getMonthNumber, selectedYear }) => {
    const [loading, setLoading] = useState(false);
    const [firstData, setFirstData] = useState([]);
    const [fourthData, setFourthData] = useState([]);
    const [eighthData, setEighthData] = useState([]);
    const [totalData, setTotalData] = useState([]);
    const [iptData, setIptData] = useState([]);
    const [anaemiaData, setAnaemiaData] = useState([]);
    const [tabletsData, setTabletsData] = useState([]);
    const [llinsData, setLlinsData] = useState([]);
    const [ultrasoundData, setUltrasoundData] = useState([]);
    const [dewormingData, setDewormingData] = useState([]);
    const [syphilisData, setSyphilisData] = useState([]);
    const [hepatitisData, setHepatitisData] = useState({});
    const [hivData, setHivData] = useState([]);
    const [viralLoadData, setViralLoadData] = useState({});
    const [selfTestingData, setSelfTestingData] = useState({});
    const [malePartnerData, setMalePartnerData] = useState({});
    const [hivMalePartnerData, setHivMalePartnerData] = useState({});
    const [discordantData, setDiscordantData] = useState({});
    const [nutritionData, setNutritionData] = useState({});
    const [tbScreeningData, setTbScreeningData] = useState([]);
    const [arvProphylaxisData, setArvProphylaxisData] = useState({});
    const [malePartnerStatusData, setMalePartnerStatusData] = useState({});

    const defaultData = [
        {
            hmis_code: 'AN01',
            hmis_name: 'ANC 1st contacts/visits for women',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN02',
            hmis_name: 'ANC 4th contacts/visits for women',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN03',
            hmis_name: 'ANC 8th contacts/visits for women',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        }
    ];

    const defaultIptData = [
        {
            hmis_code: 'AN06.1',
            hmis_name: 'First dose IPT (IPT1)',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN06.2',
            hmis_name: 'Second dose IPT (IPT2)',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN06.3',
            hmis_name: 'Third dose IPT (IPT3)',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN06.4',
            hmis_name: 'IPT 4 & 4+ Dose',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        }
    ];

    const defaultAnaemiaData = [
        {
            hmis_code: 'AN08',
            hmis_name: 'No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN09',
            hmis_name: 'No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        }
    ];

    const defaultTabletsData = [
        {
            hmis_code: 'AN10.1',
            hmis_name: 'Folic Acid 0-12 wks of gestation',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN10.2',
            hmis_name: 'Iron & Folic Acid 13+ wks of gestation',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        }
    ];

    const defaultLlinsData = {
        hmis_code: 'AN11',
        hmis_name: 'Pregnant Women receiving LLINs at ANC 1st visit',
        Below_15yrs: "0",
        "15_19yrs": "0",
        "20_24yrs": "0",
        "25_50yrs": "0",
        "50+yrs": "0"
    };

    const defaultUltrasoundData = [
        {
            hmis_code: 'AN12.1',
            hmis_name: 'Total U/S Scan done',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN12.2',
            hmis_name: 'No. done before 24 weeks of gestation',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        }
    ];

    const defaultDewormingData = {
        hmis_code: 'AN13',
        hmis_name: 'No. of pregnant women dewormed',
        value: "0"
    };

    const defaultSyphilisData = {
        hmis_code: 'AN14',
        hmis_name: 'Pregnant Women tested for syphilis',
        first_time: "0",
        newly_tested_positive: "0",
        started_treatment: "0"
    };

    const defaultStisData = {
        hmis_code: 'AN15',
        hmis_name: 'Male partner tested for syphilis',
        total_tested: "0",
        tested_positive: "0"
    };

    const defaultHepatitisData = {
        hmis_code: 'AN16',
        hmis_name: 'No. Pregnant women tested for Hepatitis B.',
        total_tested: "0",
        tested_positive: "0"
    };

    const defaultHivData = [
        {
            hmis_code: 'AN17',
            hmis_name: 'Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)',
            type: 'Total',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN17',
            hmis_name: 'Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)',
            type: 'ANC 1',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN18',
            hmis_name: 'Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit',
            type: 'Total',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN18',
            hmis_name: 'Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit',
            type: 'ANC 1',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_50yrs": "0",
            "50+yrs": "0"
        }
    ];

    const defaultViralLoadData = {
        hmis_code: 'AN23',
        hmis_name: 'HIV+ pregnant women',
        eligible_viral_load: "0",
        samples_collected: "0",
        viral_load_suppressed: "0"
    };

    const defaultSelfTestingData = {
        hmis_code: 'AN24',
        hmis_name: 'Pregnant women given self-testing kits for their male partners',
        total: "0",
        tests_returned_neg: "0",
        tests_returned_pos: "0"
    };

    const defaultMalePartnerData = {
        hmis_code: 'AN25',
        hmis_name: 'Male partners received HIV test results in eMTCT',
        neg: "0",
        pos: "0"
    };

    const defaultHivMalePartnerData = {
        hmis_code: 'AN26',
        hmis_name: 'HIV+ Male partners initiated on ART in the ANC setting',
        known_art: "0",
        new: "0"
    };

    const defaultDiscordantData = {
        hmis_code: 'AN27',
        hmis_name: 'No. of discordant couple identified in ANC',
        value: "0"
    };

    const defaultNutritionData = {
        hmis_code: 'AN28',
        hmis_name: 'Women assessed for nutrition status',
        total: "0",
        mam: "0",
        sam: "0"
    };

    const defaultTbScreeningData = [
        {
            hmis_code: 'AN29.1',
            hmis_name: 'Screened for TB',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0",
            "Total": "0"
        },
        {
            hmis_code: 'AN29.2',
            hmis_name: 'Presumed to have TB',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0",
            "Total": "0"
        },
        {
            hmis_code: 'AN29.3',
            hmis_name: 'Diagnosed with TB',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0",
            "Total": "0"
        }
    ];

    const defaultArvProphylaxisData = {
        hmis_code: 'AN30',
        hmis_name: 'HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC',
        value: "0"
    };

    const defaultMalePartnerStatusData = {
        hmis_code: 'AN31',
        hmis_name: 'Male partners with a known status at their first visit as couple in ANC',
        neg: "0",
        pos: "0"
    };

    const fetchFirst = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/antenatal?report_month=${formattedMonth}`);
            console.log(response);
            setFirstData(response.data.length > 0 ? response.data : [defaultData[0]]);
        } catch (error) {
            console.error('Error fetching Antenatal data:', error);
            setFirstData([defaultData[0]]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFourth = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/antenatal/four?report_month=${formattedMonth}`);
            console.log("Fourth data", response);
            setFourthData(response.data.length > 0 ? response.data : [defaultData[1]]);
        } catch (error) {
            console.error('Error fetching Antenatal data:', error);
            setFourthData([defaultData[1]]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEighth = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/antenatal/eight?report_month=${formattedMonth}`);
            console.log("Eighth data", response);
            setEighthData(response.data.length > 0 ? response.data : [defaultData[2]]);
        } catch (error) {
            console.error('Error fetching Antenatal data:', error);
            setEighthData([defaultData[2]]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotal = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/antenatal/total?report_month=${formattedMonth}`);
            console.log("Total data", response);
            setTotalData(response.data.length > 0 ? response.data : [defaultData[2]]);
        } catch (error) {
            console.error('Error fetching Antenatal data:', error);
            setTotalData([defaultData[2]]);
        } finally {
            setLoading(false);
        }
    };

    const fetchIpt = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/antenatal/ipt?report_month=${formattedMonth}`);
            console.log("IPT data", response);
            setIptData(response.data.length > 0 ? response.data : defaultIptData);
        } catch (error) {
            console.error('Error fetching IPT data:', error);
            setIptData(defaultIptData);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnaemia = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);

            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;
            const response = await API.get(`/antenatal/anaemia?report_month=${formattedMonth}`);
            console.log("Anaemia data", response);
            setAnaemiaData(response.data.length > 0 ? response.data : defaultAnaemiaData);
        } catch (error) {
            console.error('Error fetching Anaemia data:', error);
            setAnaemiaData(defaultAnaemiaData);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdditionalData = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);
            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;

            const [tabletsRes, llinsRes, ultrasoundRes, dewormingRes, syphilisRes, hepatitisRes, hivRes] = await Promise.all([
                API.get(`/antenatal/tablets?report_month=${formattedMonth}`),
                API.get(`/antenatal/llins?report_month=${formattedMonth}`),
                API.get(`/antenatal/ultrasound?report_month=${formattedMonth}`),
                API.get(`/antenatal/deworming?report_month=${formattedMonth}`),
                API.get(`/antenatal/syphilis?report_month=${formattedMonth}`),
                API.get(`/antenatal/hepatitis?report_month=${formattedMonth}`),
                API.get(`/antenatal/hiv?report_month=${formattedMonth}`)
            ]);

            setTabletsData(tabletsRes.data.length > 0 ? tabletsRes.data : defaultTabletsData);
            setLlinsData(llinsRes.data.length > 0 ? llinsRes.data[0] : defaultLlinsData);
            setUltrasoundData(ultrasoundRes.data.length > 0 ? ultrasoundRes.data : defaultUltrasoundData);
            setDewormingData(dewormingRes.data.length > 0 ? dewormingRes.data[0] : defaultDewormingData);
            setSyphilisData(syphilisRes.data.length > 0 ? syphilisRes.data[0] : defaultSyphilisData);
            setHepatitisData(hepatitisRes.data.length > 0 ? hepatitisRes.data[0] : defaultHepatitisData);
            setHivData(hivRes.data.length > 0 ? hivRes.data : defaultHivData);

        } catch (error) {
            console.error('Error fetching additional data:', error);
            setTabletsData(defaultTabletsData);
            setLlinsData(defaultLlinsData);
            setUltrasoundData(defaultUltrasoundData);
            setDewormingData(defaultDewormingData);
            setSyphilisData(defaultSyphilisData);
            setHepatitisData(defaultHepatitisData);
            setHivData(defaultHivData);
        } finally {
            setLoading(false);
        }
    };

    const fetchFinalSections = async () => {
        try {
            setLoading(true);
            const monthNumber = getMonthNumber(selectedMonth);
            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;

            const [
                viralLoadRes,
                selfTestingRes,
                malePartnerRes,
                hivMalePartnerRes,
                discordantRes,
                nutritionRes,
                tbScreeningRes,
                arvProphylaxisRes,
                malePartnerStatusRes
            ] = await Promise.all([
                API.get(`/antenatal/viral-load?report_month=${formattedMonth}`),
                API.get(`/antenatal/self-testing?report_month=${formattedMonth}`),
                API.get(`/antenatal/male-partner?report_month=${formattedMonth}`),
                API.get(`/antenatal/hiv-male-partner?report_month=${formattedMonth}`),
                API.get(`/antenatal/discordant?report_month=${formattedMonth}`),
                API.get(`/antenatal/nutrition?report_month=${formattedMonth}`),
                API.get(`/antenatal/tb-screening?report_month=${formattedMonth}`),
                API.get(`/antenatal/arv-prophylaxis?report_month=${formattedMonth}`),
                API.get(`/antenatal/male-partner-status?report_month=${formattedMonth}`)
            ]);

            setViralLoadData(viralLoadRes.data.length > 0 ? viralLoadRes.data[0] : defaultViralLoadData);
            setSelfTestingData(selfTestingRes.data.length > 0 ? selfTestingRes.data[0] : defaultSelfTestingData);
            setMalePartnerData(malePartnerRes.data.length > 0 ? malePartnerRes.data[0] : defaultMalePartnerData);
            setHivMalePartnerData(hivMalePartnerRes.data.length > 0 ? hivMalePartnerRes.data[0] : defaultHivMalePartnerData);
            setDiscordantData(discordantRes.data.length > 0 ? discordantRes.data[0] : defaultDiscordantData);
            setNutritionData(nutritionRes.data.length > 0 ? nutritionRes.data[0] : defaultNutritionData);
            setTbScreeningData(tbScreeningRes.data.length > 0 ? tbScreeningRes.data : defaultTbScreeningData);
            setArvProphylaxisData(arvProphylaxisRes.data.length > 0 ? arvProphylaxisRes.data[0] : defaultArvProphylaxisData);
            setMalePartnerStatusData(malePartnerStatusRes.data.length > 0 ? malePartnerStatusRes.data[0] : defaultMalePartnerStatusData);

        } catch (error) {
            console.error('Error fetching final sections data:', error);
            setViralLoadData(defaultViralLoadData);
            setSelfTestingData(defaultSelfTestingData);
            setMalePartnerData(defaultMalePartnerData);
            setHivMalePartnerData(defaultHivMalePartnerData);
            setDiscordantData(defaultDiscordantData);
            setNutritionData(defaultNutritionData);
            setTbScreeningData(defaultTbScreeningData);
            setArvProphylaxisData(defaultArvProphylaxisData);
            setMalePartnerStatusData(defaultMalePartnerStatusData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedMonth) {
            fetchFirst();
            fetchFourth();
            fetchEighth();
            fetchTotal();
            fetchIpt();
            fetchAnaemia();
            fetchAdditionalData();
            fetchFinalSections();
        }
    }, [selectedMonth]);

    const getValueForCell = (item, ageGroup) => {
        const key = `${ageGroup}`;
        return item[key] || "0";
    };

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
                            {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map((ag, i) => (
                                <th key={i} className="text-center">{ag}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* First Data */}
                        {firstData.map(item => (
                            <tr key={`attendance-${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Fourth Data */}
                        {fourthData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Eighth Data */}
                        {eighthData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* TotalData */}
                        {totalData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* IPT Header Row */}
                        <tr>
                            <td colSpan="6" className="fw-bold">AN 06. No. of pregnant women who received IPT</td>
                        </tr>

                        {/* IPT Data */}
                        {iptData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td className="ps-4">{item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Anaemia Data */}
                        {anaemiaData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tablets Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map((ag, i) => (
                                    <th key={i} className="text-center">{ag}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* AN10 Header */}
                            <tr>
                                <td colSpan="6" className="fw-bold">AN10. No. of pregnant women receiving atleast 30 Tablets of</td>
                            </tr>

                            {/* Tablets Data */}
                            {tabletsData.map(item => (
                                <tr key={`${item.hmis_code}`}>
                                    <td className="ps-4">{item.hmis_name}</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value={getValueForCell(item, ageGroup)}
                                                readOnly
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* LLINs Data */}
                            <tr>
                                <td>{llinsData.hmis_code}. {llinsData.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(llinsData, ageGroup)}
                                            readOnly
                                        />
                                    </td>
                                ))}
                            </tr>

                            {/* AN12 Header */}
                            <tr>
                                <td colSpan="6" className="fw-bold">AN12. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month</td>
                            </tr>

                            {/* Ultrasound Data */}
                            {ultrasoundData.map(item => (
                                <tr key={`${item.hmis_code}`}>
                                    <td className="ps-4">{item.hmis_name}</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value={getValueForCell(item, ageGroup)}
                                                readOnly
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Single Column Data Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th className="text-center">Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Deworming Data */}
                            <tr>
                                <td>{dewormingData.hmis_code}. {dewormingData.hmis_name}</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={dewormingData.value}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN14 Header */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN14. Pregnant Women tested for syphilis</td>
                            </tr>

                            {/* Syphilis Data */}
                            <tr>
                                <td className="ps-4">First time this pregnancy</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={syphilisData.first_time}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Newly tested Positive</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={syphilisData.newly_tested_positive}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Started on syphilis treatment</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={syphilisData.started_treatment}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN15 Header */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN15. Male partner tested for syphilis</td>
                            </tr>

                            {/* STIs Partner Data */}
                            <tr>
                                <td className="ps-4">Total Tested</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={defaultStisData.total_tested}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Tested Positive</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={defaultStisData.tested_positive}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN16 Header */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN16. No. Pregnant women tested for Hepatitis B.</td>
                            </tr>

                            {/* Hepatitis Data */}
                            <tr>
                                <td className="ps-4">Total Tested</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={hepatitisData.total_tested}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Tested Positive</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={hepatitisData.tested_positive}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* HIV Testing Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Type</th>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map((ag, i) => (
                                    <th key={i} className="text-center">{ag}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* HIV Data */}
                            {hivData.map(item => (
                                <tr key={`${item.hmis_code}-${item.type}`}>
                                    <td>{item.hmis_name}</td>
                                    <td>{item.type}</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value={getValueForCell(item, ageGroup)}
                                                readOnly
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* HIV and Partner Testing Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th className="text-center">Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* AN23 Viral Load Section */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN23. HIV+ pregnant women</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Eligible for a Viral Load during the month</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={viralLoadData.eligible_viral_load}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Viral Load Samples collected during the month</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={viralLoadData.samples_collected}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Viral Load Suppressed during the month</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={viralLoadData.viral_load_suppressed}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN24 Self Testing Section */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN24. Pregnant women given self-testing kits for their male partners</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Total</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={selfTestingData.total}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Tests returned NEG</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={selfTestingData.tests_returned_neg}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Tests returned POS</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={selfTestingData.tests_returned_pos}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN25 Male Partner Results */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN25. Male partners received HIV test results in eMTCT</td>
                            </tr>
                            <tr>
                                <td className="ps-4">NEG</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={malePartnerData.neg}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">POS</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={malePartnerData.pos}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN26 HIV+ Male Partners */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN26. HIV+ Male partners initiated on ART in the ANC setting</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Known ART</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={hivMalePartnerData.known_art}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">New</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={hivMalePartnerData.new}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN27 Discordant Couples */}
                            <tr>
                                <td>{discordantData.hmis_code}. {discordantData.hmis_name}</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={discordantData.value}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN28 Nutrition Assessment */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN28. Women assessed for nutrition status</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Total</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={nutritionData.total}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">Identified malnourished MAM</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={nutritionData.mam}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">SAM</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={nutritionData.sam}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* TB Screening Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs", "Total"].map((ag, i) => (
                                    <th key={i} className="text-center">{ag}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7" className="fw-bold">AN29. TB Screening for ANC Clients</td>
                            </tr>
                            {tbScreeningData.map(item => (
                                <tr key={`${item.hmis_code}`}>
                                    <td className="ps-4">{item.hmis_name}</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs", "Total"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value={getValueForCell(item, ageGroup)}
                                                readOnly
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ARV Prophylaxis and Partner Status Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th className="text-center">Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* AN30 ARV Prophylaxis */}
                            <tr>
                                <td>{arvProphylaxisData.hmis_code}. {arvProphylaxisData.hmis_name}</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={arvProphylaxisData.value}
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN31 Male Partner Status */}
                            <tr>
                                <td colSpan="2" className="fw-bold">AN31. Male partners with a known status at their first visit as couple in ANC</td>
                            </tr>
                            <tr>
                                <td className="ps-4">NEG</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={malePartnerStatusData.neg}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">POS</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={malePartnerStatusData.pos}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        </div>
    )
}

export default Antenatal