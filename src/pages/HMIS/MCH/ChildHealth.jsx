import React, { useState, useEffect } from 'react';
import API from '../../../helpers/api';

const ChildHealth = () => {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const ageGroups = [
        { label: "0-5 Months", key: "0-5m" },
        { label: "6-11 Months", key: "6-11m" },
        { label: "12-59 Months", key: "12-59m" },
        { label: "5-14 Years", key: "5-14y" }
    ];

    const servicePoints = ["Static", "Outreach", "In school"];

    // Simulated API response data
    const mockData = [
        {
            report_month: "2024-03",
            section_id: "2.3",
            section_name: "Child Health",
            hmis_code: "CH01",
            hmis_name: "Vit A supplement (1st dose)",
            "0-5m_male": 45,
            "0-5m_female": 52,
            "6-11m_male": 38,
            "6-11m_female": 41,
            "12-59m_male": 65,
            "12-59m_female": 58,
            "5-14y_male": 0,
            "5-14y_female": 0,
            service_point: "Static"
        },
        {
            report_month: "2024-03",
            section_id: "2.3",
            section_name: "Child Health",
            hmis_code: "CH01",
            hmis_name: "Vit A supplement (1st dose)",
            "0-5m_male": 25,
            "0-5m_female": 28,
            "6-11m_male": 22,
            "6-11m_female": 24,
            "12-59m_male": 35,
            "12-59m_female": 32,
            "5-14y_male": 0,
            "5-14y_female": 0,
            service_point: "Outreach"
        },
        {
            report_month: "2024-03",
            section_id: "2.3",
            section_name: "Child Health",
            hmis_code: "CH02",
            hmis_name: "Vit A supplement (2nd dose)",
            "0-5m_male": 0,
            "0-5m_female": 0,
            "6-11m_male": 42,
            "6-11m_female": 45,
            "12-59m_male": 55,
            "12-59m_female": 58,
            "5-14y_male": 0,
            "5-14y_female": 0,
            service_point: "Static"
        },
        {
            report_month: "2024-03",
            section_id: "2.3",
            section_name: "Child Health",
            hmis_code: "CH03",
            hmis_name: "Dewormed (1st dose)",
            "0-5m_male": 0,
            "0-5m_female": 0,
            "6-11m_male": 35,
            "6-11m_female": 38,
            "12-59m_male": 48,
            "12-59m_female": 52,
            "5-14y_male": 62,
            "5-14y_female": 58,
            service_point: "Static"
        },
        {
            report_month: "2024-03",
            section_id: "2.3",
            section_name: "Child Health",
            hmis_code: "CH04",
            hmis_name: "Dewormed (2nd dose)",
            "0-5m_male": 0,
            "0-5m_female": 0,
            "6-11m_male": 32,
            "6-11m_female": 35,
            "12-59m_male": 45,
            "12-59m_female": 48,
            "5-14y_male": 58,
            "5-14y_female": 55,
            service_point: "Static"
        }
    ];

    useEffect(() => {
        // Simulate API call with mock data
        const simulateApiCall = () => {
            setTimeout(() => {
                try {
                    // Group the mock data by vaccine (hmis_code)
                    const groupedData = mockData.reduce((acc, curr) => {
                        if (!acc[curr.hmis_code]) {
                            acc[curr.hmis_code] = {
                                code: curr.hmis_code,
                                label: curr.hmis_name,
                                data: {}
                            };
                        }
                        acc[curr.hmis_code].data[curr.service_point] = curr;
                        return acc;
                    }, {});
                    setVaccines(Object.values(groupedData));
                    setLoading(false);
                } catch (err) {
                    setError("Error processing data");
                    setLoading(false);
                }
            }, 1000);
        };

        simulateApiCall();
    }, []);

    const handleInputChange = (vaccineCode, servicePoint, ageGroup, gender, value) => {
        setVaccines(prevVaccines => {
            return prevVaccines.map(vaccine => {
                if (vaccine.code === vaccineCode) {
                    const updatedData = {
                        ...vaccine.data,
                        [servicePoint]: {
                            ...vaccine.data[servicePoint],
                            [`${ageGroup}_${gender}`]: value
                        }
                    };
                    return { ...vaccine, data: updatedData };
                }
                return vaccine;
            });
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="section-header">
                2.3 CHILD HEALTH
            </div>

            <table className="data-entry-table">
                <thead>
                    <tr>
                        <th></th>
                        {ageGroups.map(group => (
                            <th key={group.label} colSpan="2" className="text-center">
                                {group.label}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        <th>Service Point</th>
                        {ageGroups.map(() => (
                            <>
                                <th className="text-center">M</th>
                                <th className="text-center">F</th>
                            </>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {vaccines.map(vaccine => (
                        <>
                            <tr>
                                <td colSpan={ageGroups.length * 2 + 1} className="bg-light">
                                    {vaccine.code}. {vaccine.label}
                                </td>
                            </tr>
                            {servicePoints.map(point => (
                                <tr key={`${vaccine.code}-${point}`}>
                                    <td>{point}</td>
                                    {ageGroups.map(group => {
                                        const data = vaccine.data[point] || {};
                                        return (
                                            <>
                                                <td className="text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="form-control form-control-sm"
                                                        value={data[`${group.key}_male`] || ''}
                                                        onChange={(e) => handleInputChange(
                                                            vaccine.code,
                                                            point,
                                                            group.key,
                                                            'male',
                                                            e.target.value
                                                        )}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="form-control form-control-sm"
                                                        value={data[`${group.key}_female`] || ''}
                                                        onChange={(e) => handleInputChange(
                                                            vaccine.code,
                                                            point,
                                                            group.key,
                                                            'female',
                                                            e.target.value
                                                        )}
                                                    />
                                                </td>
                                            </>
                                        );
                                    })}
                                </tr>
                            ))}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChildHealth;