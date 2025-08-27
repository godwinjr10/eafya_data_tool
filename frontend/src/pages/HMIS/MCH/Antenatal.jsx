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
    const [bloodGroupingData, setBloodGroupingData] = useState([]);
    const [tabletsData, setTabletsData] = useState([]);
    const [llinsData, setLlinsData] = useState([]);
    const [ultrasoundData, setUltrasoundData] = useState([]);
    const [dewormingData, setDewormingData] = useState([]);
    const [syphilisData, setSyphilisData] = useState([]);
    const [hepatitisData, setHepatitisData] = useState([]);
    const [hivData, setHivData] = useState([]);
    const [hivAssessmentData, setHivAssessmentData] = useState([]);
    const [hivArtData, setHivArtData] = useState([]);
    const [hivStatusData, setHivStatusData] = useState([]);
    const [hivRetestData, setHivRetestData] = useState([]);

    // Mock data for demonstration - no backend integration yet
    const mockFirstData = [
        {
            hmis_code: 'AN01',
            hmis_name: 'ANC 1st contacts/visits for women',
            type: 'Total',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN01',
            hmis_name: 'ANC 1st contacts/visits for women',
            type: 'No. in 1st Trimester',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockFourthData = [
        {
            hmis_code: 'AN02',
            hmis_name: 'ANC 4th contacts/visits for women',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockEighthData = [
        {
            hmis_code: 'AN03',
            hmis_name: 'ANC 8th contacts/visits for women',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockTotalData = [
        {
            hmis_code: 'AN04',
            hmis_name: 'Total ANC contacts/visits',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN05',
            hmis_name: 'Referrals from community',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockIptData = [
        {
            hmis_code: 'AN06.1',
            hmis_name: 'First dose IPT (IPT1)',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN06.2',
            hmis_name: 'Second dose IPT (IPT2)',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN06.3',
            hmis_name: 'Third dose IPT (IPT3)',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN06.4',
            hmis_name: 'IPT 4 & 4+ Dose',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockBloodGroupingData = [
        { hmis_code: 'AN07', group: 'O', rhesus: 'Rhesus O+', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'O', rhesus: 'Rhesus O-', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'A', rhesus: 'Rhesus A+', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'A', rhesus: 'Rhesus A-', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'B', rhesus: 'Rhesus B+', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'B', rhesus: 'Rhesus B-', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'AB', rhesus: 'Rhesus AB+', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" },
        { hmis_code: 'AN07', group: 'AB', rhesus: 'Rhesus AB-', Below_15yrs: "0", "15_19yrs": "0", "20_24yrs": "0", "25_49yrs": "0", "50+yrs": "0" }
    ];

    const mockAnaemiaData = [
        {
            hmis_code: 'AN08',
            hmis_name: 'No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN09',
            hmis_name: 'No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockTabletsData = [
        {
            hmis_code: 'AN10.1',
            hmis_name: 'Folic Acid 0-12 wks of gestation',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN10.2',
            hmis_name: 'Iron & Folic Acid 13+ wks of gestation',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockLlinsData = {
        hmis_code: 'AN11',
        hmis_name: 'Pregnant Women receiving LLINs at ANC 1st visit',
        Below_15yrs: "0",
        "15_19yrs": "0",
        "20_24yrs": "0",
        "25_49yrs": "0",
        "50+yrs": "0"
    };

    const mockUltrasoundData = [
        {
            hmis_code: 'AN12.1',
            hmis_name: 'Total U/S Scan done',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN12.2',
            hmis_name: 'No. done before 24 weeks of gestation',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockDewormingData = {
        hmis_code: 'AN13',
        hmis_name: 'No. of pregnant women dewormed',
        value: "0"
    };

    const mockSyphilisData = {
        hmis_code: 'AN14',
        hmis_name: 'Pregnant Women tested for syphilis',
        first_time: "0",
        newly_tested_positive: "0",
        started_treatment: "0"
    };

    const mockStisData = {
        hmis_code: 'AN15',
        hmis_name: 'Male partner tested for syphilis',
        total_tested: "0",
        tested_positive: "0"
    };

    const mockHepatitisData = {
        hmis_code: 'AN16',
        hmis_name: 'No. Pregnant women tested for Hepatitis B.',
        total_tested: "0",
        tested_positive: "0"
    };

    const mockHivData = [
        {
            hmis_code: 'AN17',
            hmis_name: 'Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)',
            type: 'Total',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN17',
            hmis_name: 'Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)',
            type: 'ANC 1',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockHivAssessmentData = [
        {
            hmis_code: 'AN18',
            hmis_name: 'Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit',
            type: 'Total',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN18',
            hmis_name: 'Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit',
            type: 'ANC 1',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockHivStatusData = [
        {
            hmis_code: 'AN21',
            hmis_name: 'Pregnant Women who knew status before 1st ANC',
            type: 'NEG',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN21',
            hmis_name: 'Pregnant Women who knew status before 1st ANC',
            type: 'POS',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    const mockHivRetestData = [
        {
            hmis_code: 'AN22',
            hmis_name: 'Pregnant women who re-tested later in pregnancy',
            type: 'NEG',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        },
        {
            hmis_code: 'AN22',
            hmis_name: 'Pregnant women who re-tested later in pregnancy',
            type: 'POS',
            Below_15yrs: "0",
            "15_19yrs": "0",
            "20_24yrs": "0",
            "25_49yrs": "0",
            "50+yrs": "0"
        }
    ];

    // Initialize with mock data
    useEffect(() => {
        setFirstData(mockFirstData);
        setFourthData(mockFourthData);
        setEighthData(mockEighthData);
        setTotalData(mockTotalData);
        setIptData(mockIptData);
        setBloodGroupingData(mockBloodGroupingData);
        setAnaemiaData(mockAnaemiaData);
        setTabletsData(mockTabletsData);
        setLlinsData(mockLlinsData);
        setUltrasoundData(mockUltrasoundData);
        setDewormingData(mockDewormingData);
        setSyphilisData(mockSyphilisData);
        setHepatitisData(mockHepatitisData);
        setHivData(mockHivData);
        setHivAssessmentData(mockHivAssessmentData);
        setHivStatusData(mockHivStatusData);
        setHivRetestData(mockHivRetestData);
    }, []);

    const getValueForCell = (item, ageGroup) => {
        const key = `${ageGroup}`;
        return item[key] || "0";
    };

    const computeTotal = (item, ageKeys) => {
        return ageKeys.reduce((sum, key) => {
            const value = Number(item[key] || 0);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
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
                            <th style={{ fontWeight: 'normal' }}>Category</th>
                            {["Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years", "Total"].map((ag, i) => (
                                <th key={i} className="text-center" style={{ fontWeight: 'normal' }}>{ag}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* AN01 - ANC 1st contacts with sub-rows */}
                        <tr>
                            <td colSpan="6">AN01. ANC 1st contacts/visits for women</td>
                        </tr>
                        {firstData.map((item, idx) => (
                            <tr key={`AN01-${idx}`}>
                                <td className="ps-4">{item.type}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* AN02 - ANC 4th contacts */}
                        {fourthData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* AN03 - ANC 8th contacts */}
                        {eighthData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* AN04 & AN05 - Total ANC contacts and Referrals */}
                        {totalData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* IPT Header Row */}
                        <tr>
                            <td colSpan="6">AN 06. No. of pregnant women who received IPT</td>
                        </tr>

                        {/* IPT Data */}
                        {iptData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td className="ps-4">{item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* AN07 Blood Grouping */}
                        <tr>
                            <td colSpan="6">AN07. No. of pregnant women who were tested for blood grouping</td>
                        </tr>
                        {bloodGroupingData.map((item, idx) => (
                            <tr key={`AN07-${idx}`}>
                                <td className="ps-4">{`Blood Group (${item.group}) ${item.rhesus}`}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={getValueForCell(item, ageGroup)}
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                        style={{ backgroundColor: 'white' }} // White background for total cells
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* Anaemia Data */}
                        {anaemiaData.map(item => (
                            <tr key={`${item.hmis_code}`}>
                                <td>{item.hmis_code}. {item.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ANTENATAL (Continued) Section */}
                <div className="mt-4">
                    <div className="section-subheader mb-3">
                        ANTENATAL (Continued)
                    </div>
                    
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th style={{ fontWeight: 'normal' }}>Category</th>
                                {["Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years", "Total"].map((ag, i) => (
                                    <th key={i} className="text-center" style={{ fontWeight: 'normal' }}>{ag}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* AN10 - Tablets */}
                            <tr>
                                <td colSpan="6">AN10. No. of pregnant women receiving atleast 30 Tablets of</td>
                            </tr>
                            {tabletsData.map(item => (
                                <tr key={`${item.hmis_code}`}>
                                    <td className="ps-4">{item.hmis_name}</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }} // Grey background for total cells
                                        />
                                    </td>
                                </tr>
                            ))}

                            {/* AN11 - LLINs */}
                            <tr>
                                <td>{llinsData.hmis_code}. {llinsData.hmis_name}</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value={computeTotal(llinsData, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                        readOnly
                                        style={{ backgroundColor: '#f8f9fa' }} // Grey background for total cells
                                    />
                                </td>
                            </tr>

                            {/* AN12 - Ultrasound */}
                            <tr>
                                <td colSpan="6">AN12. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month</td>
                            </tr>
                            {ultrasoundData.map(item => (
                                <tr key={`${item.hmis_code}`}>
                                    <td className="ps-4">{item.hmis_name}</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
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
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value={computeTotal(item, ["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"])}
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }} // Grey background for total cells
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Section - Side by Side Tables */}
                <div className="mt-4">
                    <div className="row">
                        {/* Left Table - AN13 & AN14 */}
                        <div className="col-md-6">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                        <th style={{ fontWeight: 'normal' }}>Category</th>
                                <th className="text-center" style={{ fontWeight: 'normal' }}>Number</th>
                            </tr>
                        </thead>
                        <tbody>
                                    {/* AN13 - Deworming */}
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

                                    {/* AN14 - Syphilis */}
                            <tr>
                                        <td colSpan="2">{syphilisData.hmis_code}. {syphilisData.hmis_name}</td>
                            </tr>
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
                                </tbody>
                            </table>
                        </div>

                        {/* Right Table - AN15 & AN16 */}
                        <div className="col-md-6">
                            <table className="data-entry-table">
                                <thead>
                            <tr>
                                        <th style={{ fontWeight: 'normal' }}>Category</th>
                                        <th className="text-center" style={{ fontWeight: 'normal' }}>Number</th>
                            </tr>
                                </thead>
                                <tbody>
                                    {/* AN15 - Male partner syphilis */}
                                    <tr>
                                        <td colSpan="2">{mockStisData.hmis_code}. {mockStisData.hmis_name}</td>
                                    </tr>
                            <tr>
                                <td className="ps-4">Total Tested</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value={mockStisData.total_tested}
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
                                                value={mockStisData.tested_positive}
                                        readOnly
                                    />
                                </td>
                            </tr>

                                    {/* AN16 - Hepatitis B */}
                            <tr>
                                        <td colSpan="2">{hepatitisData.hmis_code}. {hepatitisData.hmis_name}</td>
                            </tr>
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
                    </div>
                </div>

                {/* HIV Testing and Management Section */}
                <div className="mt-4">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                <th style={{ fontWeight: 'normal' }}>Category</th>
                                {["Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years", "Total"].map((ag, i) => (
                                    <th key={i} className="text-center" style={{ fontWeight: 'normal' }}>{ag}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* AN17 - HIV Testing */}
                            <tr>
                                <td colSpan="6">AN17. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Total</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                            value="0"
                                                readOnly
                                            />
                                        </td>
                                    ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                                </tr>
                            <tr>
                                <td className="ps-4">ANC 1</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN18 - HIV Positive Testing */}
                            <tr>
                                <td colSpan="6">AN18. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Total</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">ANC 1</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN19 - CD4 Assessment */}
                            <tr>
                                <td>AN19. HIV+ Pregnant women assessed by CD4</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN20 - ART Initiation */}
                            <tr>
                                <td>AN20. HIV+ pregnant women initiated on ART for eMTCT at any visit irrespective of when tested HIV POS and HIV POS not yet started ART</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN21 - Known Status Before ANC */}
                            <tr>
                                <td colSpan="6">AN21. Pregnant Women who knew status before 1st ANC</td>
                            </tr>
                            <tr>
                                <td className="ps-4">NEG</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">POS</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                            {/* AN22 - Re-testing Later in Pregnancy */}
                            <tr>
                                <td colSpan="6">AN22. Pregnant women who re-tested later in pregnancy</td>
                            </tr>
                            <tr>
                                <td className="ps-4">NEG</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">POS</td>
                                {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                    <td key={ageGroup} className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                        value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Additional Antenatal Sections (AN23-AN31) */}
                <div className="mt-4">
                    <div className="section-subheader mb-3">
                        ANTENATAL (Continued)
                    </div>
                    
                    {/* Top Block - Single Column Sections */}
                    <div className="row">
                        {/* Left Table - AN23, AN24, AN25, AN26, AN27 */}
                        <div className="col-md-6">
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                        <th style={{ fontWeight: 'normal' }}>Category</th>
                                <th className="text-center" style={{ fontWeight: 'normal' }}>Number</th>
                            </tr>
                        </thead>
                        <tbody>
                                    {/* AN23 - HIV+ pregnant women */}
                            <tr>
                                        <td colSpan="2">AN23. HIV+ pregnant women:</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Eligible for a Viral Load during the month</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
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
                                                value="0"
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
                                                value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                                    {/* AN24 - Self-testing kits */}
                                    <tr>
                                        <td colSpan="2">AN24. Pregnant women given self-testing kits for their male partners:</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Tests returned NEG</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
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
                                                value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                                    {/* AN25 - Male partners HIV test results */}
                            <tr>
                                        <td colSpan="2">AN25. Male partners received HIV test results in eMTCT:</td>
                            </tr>
                            <tr>
                                <td className="ps-4">NEG</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
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
                                                value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                                    {/* AN26 - HIV+ Male partners ART */}
                            <tr>
                                        <td colSpan="2">AN26. HIV+ Male partners initiated on ART in the ANC setting:</td>
                            </tr>
                            <tr>
                                <td className="ps-4">Known ART</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
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
                                                value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>

                                    {/* AN27 - Discordant couples */}
                            <tr>
                                        <td>AN27. No. of discordant couple identified in ANC</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right Table - AN28 */}
                        <div className="col-md-6">
                            <table className="data-entry-table">
                                <thead>
                            <tr>
                                        <th style={{ fontWeight: 'normal' }}>Category</th>
                                        <th className="text-center" style={{ fontWeight: 'normal' }}>Total</th>
                                        <th colSpan="2" className="text-center" style={{ fontWeight: 'normal' }}>Identified malnourished</th>
                            </tr>
                            <tr>
                                        <th></th>
                                        <th></th>
                                        <th className="text-center" style={{ fontWeight: 'normal' }}>MAM</th>
                                        <th className="text-center" style={{ fontWeight: 'normal' }}>SAM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* AN28 - Nutrition assessment */}
                                    <tr>
                                        <td>AN28. Women assessed for nutrition status</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
                                        readOnly
                                    />
                                </td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
                                        readOnly
                                    />
                                </td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                                value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                        </div>
                </div>

                    {/* Bottom Block - Age Group Breakdown Sections */}
                <div className="mt-4">
                        {/* AN29 - TB Screening */}
                    <table className="data-entry-table">
                        <thead>
                            <tr>
                                    <th style={{ fontWeight: 'normal' }}>Category</th>
                                    {["Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years", "Total"].map((ag, i) => (
                                        <th key={i} className="text-center" style={{ fontWeight: 'normal' }}>{ag}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                    <td colSpan="6">AN29. TB Screening for ANC Clients:</td>
                            </tr>
                                <tr>
                                    <td className="ps-4">Screened for TB</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value="0"
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                            />
                                        </td>
                                    ))}
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Presumed to have TB</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value="0"
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                            />
                                        </td>
                                    ))}
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Diagnosed with TB</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value="0"
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                            />
                                        </td>
                                    ))}
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm"
                                            value="0"
                                            readOnly
                                        />
                                    </td>
                                </tr>
                        </tbody>
                    </table>

                        {/* AN30 - ARV Prophylaxis */}
                        <table className="data-entry-table mt-3">
                        <thead>
                            <tr>
                                    <th style={{ fontWeight: 'normal' }}>Category</th>
                                    {["Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years", "Total"].map((ag, i) => (
                                        <th key={i} className="text-center" style={{ fontWeight: 'normal' }}>{ag}</th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td>AN30. HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value="0"
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                            />
                                        </td>
                                    ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                            value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        {/* AN31 - Male partners known status */}
                        <table className="data-entry-table mt-3">
                            <thead>
                                <tr>
                                    <th style={{ fontWeight: 'normal' }}>Category</th>
                                    {["Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years", "Total"].map((ag, i) => (
                                        <th key={i} className="text-center" style={{ fontWeight: 'normal' }}>{ag}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="6">AN31. Male partners with a known status at their first visit as a couple in ANC:</td>
                            </tr>
                            <tr>
                                <td className="ps-4">NEG</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value="0"
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                            />
                                        </td>
                                    ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                            value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="ps-4">POS</td>
                                    {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(ageGroup => (
                                        <td key={ageGroup} className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value="0"
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa' }} // Grey background for age cells
                                            />
                                        </td>
                                    ))}
                                <td className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control form-control-sm"
                                            value="0"
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </>
        </div>
    )
}

export default Antenatal