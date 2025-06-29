import React, { useState, useEffect } from 'react';
import API from '../../../helpers/api';

const Tetanus = () => {
    const [tetanusData, setTetanusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for tetanus vaccination
    const mockTetanusData = [
        {
            code: "TD01",
            label: "Td1-Dose 1",
            data: {
                pregnant: {
                    Static: 25,
                    Outreach: 15
                },
                nonPregnant: {
                    Static: 30,
                    Outreach: 20,
                    School: 40
                }
            }
        },
        {
            code: "TD02",
            label: "Td2-Dose 2",
            data: {
                pregnant: {
                    Static: 20,
                    Outreach: 12
                },
                nonPregnant: {
                    Static: 25,
                    Outreach: 18,
                    School: 35
                }
            }
        },
        {
            code: "TD03",
            label: "Td3-Dose 3",
            data: {
                pregnant: {
                    Static: 18,
                    Outreach: 10
                },
                nonPregnant: {
                    Static: 22,
                    Outreach: 15,
                    School: 30
                }
            }
        },
        {
            code: "TD04",
            label: "Td4-Dose 4",
            data: {
                pregnant: {
                    Static: 15,
                    Outreach: 8
                },
                nonPregnant: {
                    Static: 20,
                    Outreach: 12,
                    School: 25
                }
            }
        },
        {
            code: "TD05",
            label: "Td5-Dose 5",
            data: {
                pregnant: {
                    Static: 12,
                    Outreach: 6
                },
                nonPregnant: {
                    Static: 18,
                    Outreach: 10,
                    School: 20
                }
            }
        }
    ];

    useEffect(() => {
        // Simulate API call with mock data
        const simulateApiCall = () => {
            setTimeout(() => {
                try {
                    setTetanusData(mockTetanusData);
                    setLoading(false);
                } catch (err) {
                    setError("Error processing data");
                    setLoading(false);
                }
            }, 1000);
        };

        simulateApiCall();
    }, []);

    const handleTetanusInputChange = (doseCode, category, servicePoint, value) => {
        setTetanusData(prevData => {
            return prevData.map(dose => {
                if (dose.code === doseCode) {
                    return {
                        ...dose,
                        data: {
                            ...dose.data,
                            [category]: {
                                ...dose.data[category],
                                [servicePoint]: value
                            }
                        }
                    };
                }
                return dose;
            });
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="section-header">
                2.6.2 TETANUS VACCINATION (Td VACCINE)
            </div>

            <table className="data-entry-table">
                <thead>
                    <tr>
                        <th rowSpan="1">Doses</th>
                        <th colSpan="2">Pregnant women</th>
                        <th colSpan="2">Non-pregnant women</th>
                        <th rowSpan="1">Immunization in School</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>Static</th>
                        <th>Outreach</th>
                        <th>Static</th>
                        <th>Outreach</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tetanusData.map(dose => (
                        <tr key={dose.code}>
                            <td>{dose.code}. {dose.label}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={dose.data.pregnant.Static || ''}
                                    onChange={(e) => handleTetanusInputChange(dose.code, 'pregnant', 'Static', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={dose.data.pregnant.Outreach || ''}
                                    onChange={(e) => handleTetanusInputChange(dose.code, 'pregnant', 'Outreach', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={dose.data.nonPregnant.Static || ''}
                                    onChange={(e) => handleTetanusInputChange(dose.code, 'nonPregnant', 'Static', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={dose.data.nonPregnant.Outreach || ''}
                                    onChange={(e) => handleTetanusInputChange(dose.code, 'nonPregnant', 'Outreach', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control form-control-sm"
                                    value={dose.data.nonPregnant.School || ''}
                                    onChange={(e) => handleTetanusInputChange(dose.code, 'nonPregnant', 'School', e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tetanus;