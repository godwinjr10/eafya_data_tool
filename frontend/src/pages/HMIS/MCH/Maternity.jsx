import React, { useEffect, useState, useCallback } from 'react';
import API from '../../../helpers/api';

const Maternity = ({ selectedMonth, selectedYear }) => {
    const [loading, setLoading] = useState(false);
    const [maternityData, setMaternityData] = useState({
        // Left section data (MA01-MA13)
        admissions: 0,
        referralsToMaternity: { total: 0, fromCommunity: 0 },
        referralsFromMaternity: 0,
        totalDeliveries: {
            below15: 0,
            age15to19: 0,
            age20to24: 0,
            age25to49: 0,
            age50plus: 0
        },
        birthsInUnit: {
            liveBirths: { total: 0, under25kgs: 0 },
            freshStillBirth: { total: 0, under25kgs: 0 },
            maceratedStillBirth: { total: 0, under25kgs: 0 }
        },
        // Right section data (MA06-MA13)
        pretermLabour: { total: 0, givenCorticosteroids: 0 },
        pretermBirths: { total: 0, alive: 0 },
        kangarooCare: 0,
        liveBabiesAtDischarge: 0,
        babiesReceivedLLINs: 0,
        babiesWithDefects: { clubfoot: 0, otherDefects: 0 },
        newbornDeaths: 0,
        maternalDeaths: {
            below15: 0,
            age15to19: 0,
            age20to24: 0,
            age25to49: 0,
            age50plus: 0
        },
        // Additional left section data (MA14-MA22)
        breastfeeding: { total: 0, hivPos: 0 },
        hivTestedLabour: { neg: 0, pos: 0 },
        hivRetestedLabour: { neg: 0, pos: 0 },
        hivWomenArtMaternity: 0,
        malePartnersHivResults: { neg: 0, pos: 0 },
        hivMalePartnersArt: 0,
        discordantCouples: 0,
        deliveriesHivWomen: { total: 0, liveBirths: 0 },
        hivExposedInfantsArv: { totalNumber: 0, highRiskInfants: 0 },
        // Additional right section data (MA23-MA28)
        birthAsphyxia: 0,
        liveBabiesResuscitated: 0,
        pncCheck6Hours: { baby: 0, mother: 0 },
        pncCheck24Hours: { baby: 0, mother: 0 },
        uterotonicsLabour: { oxytocin: 0, misoprostol: 0, carbetocin: 0, ergometrine: 0 },
        uterotonicsPph: { oxytocin: 0, misoprostol: 0, tranexamic: 0, ergometrine: 0 }
    });

    const getMonthNumber = (monthName) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months.indexOf(monthName) + 1;
    };

    const fetchData = useCallback(async () => {
        if (!selectedMonth || !selectedYear) return;

        setLoading(true);
        try {
            const monthNumber = getMonthNumber(selectedMonth);
            const formattedMonth = `${selectedYear}${monthNumber.toString().padStart(2, '0')}`;

            // Fetch all maternity data endpoints
            const [totals, deliveries, livebirths, deaths] = await Promise.all([
                API.get(`/maternity/totals?report_month=${formattedMonth}`),
                API.get(`/maternity/deliveries?report_month=${formattedMonth}`),
                API.get(`/maternity/livebirths?report_month=${formattedMonth}`),
                API.get(`/maternity/deaths?report_month=${formattedMonth}`)
            ]);

            // Process the data to match the new structure
            const processedData = {
                // Left section data
                admissions: totals.data?.[0]?.value || 0,
                referralsToMaternity: { 
                    total: totals.data?.[1]?.value || 0, 
                    fromCommunity: totals.data?.[1]?.from_community || 0 
                },
                referralsFromMaternity: totals.data?.[2]?.value || 0,
                totalDeliveries: {
                    below15: deliveries.data?.[0]?.below_15_years || 0,
                    age15to19: deliveries.data?.[0]?.["15-19_years"] || 0,
                    age20to24: deliveries.data?.[0]?.["20-24_years"] || 0,
                    age25to49: deliveries.data?.[0]?.["25-49_years"] || 0,
                    age50plus: deliveries.data?.[0]?.["50+_years"] || 0
                },
                birthsInUnit: {
                    liveBirths: { 
                        total: livebirths.data?.[0]?.total_births || 0, 
                        under25kgs: livebirths.data?.[0]?.births_under_2_5kgs || 0 
                    },
                    freshStillBirth: { 
                        total: livebirths.data?.[1]?.total_births || 0, 
                        under25kgs: livebirths.data?.[1]?.births_under_2_5kgs || 0 
                    },
                    maceratedStillBirth: { 
                        total: livebirths.data?.[2]?.total_births || 0, 
                        under25kgs: livebirths.data?.[2]?.births_under_2_5kgs || 0 
                    }
                },
                // Right section data
                pretermLabour: { 
                    total: totals.data?.[3]?.value || 0, 
                    givenCorticosteroids: totals.data?.[3]?.given_corticosteroids || 0 
                },
                pretermBirths: { 
                    total: totals.data?.[4]?.value || 0, 
                    alive: totals.data?.[4]?.alive || 0 
                },
                kangarooCare: totals.data?.[5]?.value || 0,
                liveBabiesAtDischarge: totals.data?.[6]?.value || 0,
                babiesReceivedLLINs: totals.data?.[7]?.value || 0,
                babiesWithDefects: { 
                    clubfoot: totals.data?.[8]?.clubfoot || 0, 
                    otherDefects: totals.data?.[8]?.other_defects || 0 
                },
                newbornDeaths: totals.data?.[9]?.value || 0,
                maternalDeaths: {
                    below15: deaths.data?.[0]?.under_15_years || 0,
                    age15to19: deaths.data?.[0]?.["15_to_19_years"] || 0,
                    age20to24: deaths.data?.[0]?.["20_to_24_years"] || 0,
                    age25to49: deaths.data?.[0]?.["25_to_49_years"] || 0,
                    age50plus: deaths.data?.[0]?.["50_plus_years"] || 0
                }
            };

            setMaternityData(processedData);
        } catch (error) {
            console.error('Error fetching maternity data:', error);
            // Reset to default values on error
            setMaternityData({
                admissions: 0,
                referralsToMaternity: { total: 0, fromCommunity: 0 },
                referralsFromMaternity: 0,
                totalDeliveries: {
                    below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0
                },
                birthsInUnit: {
                    liveBirths: { total: 0, under25kgs: 0 },
                    freshStillBirth: { total: 0, under25kgs: 0 },
                    maceratedStillBirth: { total: 0, under25kgs: 0 }
                },
                pretermLabour: { total: 0, givenCorticosteroids: 0 },
                pretermBirths: { total: 0, alive: 0 },
                kangarooCare: 0,
                liveBabiesAtDischarge: 0,
                babiesReceivedLLINs: 0,
                babiesWithDefects: { clubfoot: 0, otherDefects: 0 },
                newbornDeaths: 0,
                maternalDeaths: {
                    below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0
                }
            });
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchData();
        }
    }, [selectedMonth, selectedYear, fetchData]);

    // Form input component with consistent styling
    const FormInput = ({ value, onChange, placeholder = "0" }) => (
        <input
            type="number"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-control form-control-sm compact-input"
            min="0"
            readOnly
        />
    );

    // Spinner component
    const Spinner = () => (
        <div className="d-flex justify-content-center align-items-center" style={{ padding: '2rem' }}>
            <div className="spinner-border text-primary" role="status">
            </div>
        </div>
    );

    // Safe accessor functions
    const getNestedValue = (parentField, childField) => {
        return maternityData[parentField]?.[childField] || 0;
    };

    const getDeepNestedValue = (parentField, childField, grandChildField) => {
        return maternityData[parentField]?.[childField]?.[grandChildField] || 0;
    };

    // Handle input changes with proper null checks
    const handleInputChange = (field, value) => {
        setMaternityData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = (parentField, childField, value) => {
        setMaternityData(prev => ({
            ...prev,
            [parentField]: {
                ...(prev[parentField] || {}),
                [childField]: value
            }
        }));
    };

    const handleDeepNestedInputChange = (parentField, childField, grandChildField, value) => {
        setMaternityData(prev => ({
            ...prev,
            [parentField]: {
                ...(prev[parentField] || {}),
                [childField]: {
                    ...(prev[parentField]?.[childField] || {}),
                    [grandChildField]: value
                }
            }
        }));
    };

    return (
        <div>
            <style jsx>{`
                .compact-input {
                    font-size: 0.65rem !important;
                    padding: 0.2rem 0.3rem !important;
                    height: 24px !important;
                    text-align: center !important;
                    border: 1px solid #ced4da !important;
                }
                .compact-table td {
                    padding: 0.25rem 0.3rem !important;
                    vertical-align: middle !important;
                    font-size: 0.7rem !important;
                    line-height: 1.1 !important;
                }
                .compact-table th {
                    padding: 0.3rem 0.3rem !important;
                    font-size: 0.7rem !important;
                    font-weight: 500 !important;
                }
                .compact-table .ps-4 {
                    padding-left: 0.8rem !important;
                }
                .compact-table .ps-5 {
                    padding-left: 1.2rem !important;
                }
                .compact-table {
                    font-size: 0.7rem !important;
                }
                .section-subheader {
                    font-size: 0.8rem !important;
                    margin-bottom: 0.4rem !important;
                    font-weight: 500 !important;
                }
                .section-header {
                    font-size: 0.9rem !important;
                    font-weight: 600 !important;
                }
                .data-entry-table {
                    font-size: 0.7rem !important;
                }
            `}</style>
            
            <div className="section-header mb-3">
                2.2 MATERNITY
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Left Section */}
                    <div style={{ flex: 1 }}>
                        <table className="data-entry-table compact-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ fontWeight: "normal" }}>Category</th>
                                    <th className="text-center" style={{ fontWeight: "normal" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* MA01. Admissions */}
                                <tr>
                                    <td>MA01. Admissions</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.admissions}
                                            onChange={(e) => handleInputChange('admissions', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA02. Referrals to maternity unit */}
                                <tr>
                                    <td>MA02. Referrals to maternity unit</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('referralsToMaternity', 'total')}
                                            onChange={(e) => handleNestedInputChange('referralsToMaternity', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">From community</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('referralsToMaternity', 'fromCommunity')}
                                            onChange={(e) => handleNestedInputChange('referralsToMaternity', 'fromCommunity', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA03. Referrals from maternity */}
                                <tr>
                                    <td>MA03. Referrals from maternity</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.referralsFromMaternity}
                                            onChange={(e) => handleInputChange('referralsFromMaternity', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA04. Total deliveries in the unit */}
                                <tr>
                                    <td>MA04. Total deliveries in the unit</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Below 15 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('totalDeliveries', 'below15')}
                                            onChange={(e) => handleNestedInputChange('totalDeliveries', 'below15', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">15-19 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('totalDeliveries', 'age15to19')}
                                            onChange={(e) => handleNestedInputChange('totalDeliveries', 'age15to19', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">20-24 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('totalDeliveries', 'age20to24')}
                                            onChange={(e) => handleNestedInputChange('totalDeliveries', 'age20to24', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">25-49 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('totalDeliveries', 'age25to49')}
                                            onChange={(e) => handleNestedInputChange('totalDeliveries', 'age25to49', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">50+ Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('totalDeliveries', 'age50plus')}
                                            onChange={(e) => handleNestedInputChange('totalDeliveries', 'age50plus', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA05. Births in the unit */}
                                <tr>
                                    <td>MA05. Births in the unit</td>
                                    <td></td>
                                </tr>
                                
                                {/* MA05a. Live births */}
                                <tr>
                                    <td className="ps-4">MA05a. Live births</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-5">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getDeepNestedValue('birthsInUnit', 'liveBirths', 'total')}
                                            onChange={(e) => handleDeepNestedInputChange('birthsInUnit', 'liveBirths', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-5">&lt;2.5kgs</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getDeepNestedValue('birthsInUnit', 'liveBirths', 'under25kgs')}
                                            onChange={(e) => handleDeepNestedInputChange('birthsInUnit', 'liveBirths', 'under25kgs', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA05b. Fresh still birth */}
                                <tr>
                                    <td className="ps-4">MA05b. Fresh still birth</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-5">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getDeepNestedValue('birthsInUnit', 'freshStillBirth', 'total')}
                                            onChange={(e) => handleDeepNestedInputChange('birthsInUnit', 'freshStillBirth', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-5">&lt;2.5kgs</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getDeepNestedValue('birthsInUnit', 'freshStillBirth', 'under25kgs')}
                                            onChange={(e) => handleDeepNestedInputChange('birthsInUnit', 'freshStillBirth', 'under25kgs', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA05c. Macerated still birth */}
                                <tr>
                                    <td className="ps-4">MA05c. Macerated still birth</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-5">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getDeepNestedValue('birthsInUnit', 'maceratedStillBirth', 'total')}
                                            onChange={(e) => handleDeepNestedInputChange('birthsInUnit', 'maceratedStillBirth', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-5">&lt;2.5kgs</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getDeepNestedValue('birthsInUnit', 'maceratedStillBirth', 'under25kgs')}
                                            onChange={(e) => handleDeepNestedInputChange('birthsInUnit', 'maceratedStillBirth', 'under25kgs', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA14. Breastfeeding */}
                                <tr>
                                    <td>MA14. No. of mothers who initiated breastfeeding within the 1st hour after delivery</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('breastfeeding', 'total')}
                                            onChange={(e) => handleNestedInputChange('breastfeeding', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">HIV POS</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('breastfeeding', 'hivPos')}
                                            onChange={(e) => handleNestedInputChange('breastfeeding', 'hivPos', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA15. HIV tested in labour */}
                                <tr>
                                    <td>MA15. Women tested for HIV in labour 1st time this Pregnancy</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">NEG</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('hivTestedLabour', 'neg')}
                                            onChange={(e) => handleNestedInputChange('hivTestedLabour', 'neg', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">POS</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('hivTestedLabour', 'pos')}
                                            onChange={(e) => handleNestedInputChange('hivTestedLabour', 'pos', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA16. HIV re-tested in labour */}
                                <tr>
                                    <td>MA16. Women re-tested for HIV in labour</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">NEG</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('hivRetestedLabour', 'neg')}
                                            onChange={(e) => handleNestedInputChange('hivRetestedLabour', 'neg', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">POS</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('hivRetestedLabour', 'pos')}
                                            onChange={(e) => handleNestedInputChange('hivRetestedLabour', 'pos', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA17. HIV+ women ART */}
                                <tr>
                                    <td>MA17. HIV+ women initiating ART in maternity</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.hivWomenArtMaternity}
                                            onChange={(e) => handleInputChange('hivWomenArtMaternity', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA18. Male partners HIV results */}
                                <tr>
                                    <td>MA18. Male partners received HIV test results in the maternity setting</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">NEG</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('malePartnersHivResults', 'neg')}
                                            onChange={(e) => handleNestedInputChange('malePartnersHivResults', 'neg', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">POS</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('malePartnersHivResults', 'pos')}
                                            onChange={(e) => handleNestedInputChange('malePartnersHivResults', 'pos', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA19. HIV+ male partners ART */}
                                <tr>
                                    <td>MA19. HIV+ male partners initiated on ART in the maternity setting</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.hivMalePartnersArt}
                                            onChange={(e) => handleInputChange('hivMalePartnersArt', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA20. Discordant couples */}
                                <tr>
                                    <td>MA20. No. of discordant couples identified in maternity</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.discordantCouples}
                                            onChange={(e) => handleInputChange('discordantCouples', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA21. Deliveries to HIV+ women */}
                                <tr>
                                    <td>MA21. Deliveries to HIV+ women in unit</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('deliveriesHivWomen', 'total')}
                                            onChange={(e) => handleNestedInputChange('deliveriesHivWomen', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Live births</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('deliveriesHivWomen', 'liveBirths')}
                                            onChange={(e) => handleNestedInputChange('deliveriesHivWomen', 'liveBirths', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA22. HIV Exposed infants ARV */}
                                <tr>
                                    <td>MA22. HIV Exposed infants given ARVs</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Total number</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('hivExposedInfantsArv', 'totalNumber')}
                                            onChange={(e) => handleNestedInputChange('hivExposedInfantsArv', 'totalNumber', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">No. of high-risk infants</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('hivExposedInfantsArv', 'highRiskInfants')}
                                            onChange={(e) => handleNestedInputChange('hivExposedInfantsArv', 'highRiskInfants', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Section */}
                    <div style={{ flex: 1 }}>
                        <table className="data-entry-table compact-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ fontWeight: "normal" }}>Category</th>
                                    <th className="text-center" style={{ fontWeight: "normal" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* MA06. Preterm labour */}
                                <tr>
                                    <td>MA06. Mothers admitted with preterm labour</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pretermLabour', 'total')}
                                            onChange={(e) => handleNestedInputChange('pretermLabour', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Given Corticosteroids</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pretermLabour', 'givenCorticosteroids')}
                                            onChange={(e) => handleNestedInputChange('pretermLabour', 'givenCorticosteroids', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA07. Preterm births */}
                                <tr>
                                    <td>MA07. Pre-terms births in the unit</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Total</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pretermBirths', 'total')}
                                            onChange={(e) => handleNestedInputChange('pretermBirths', 'total', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Alive</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pretermBirths', 'alive')}
                                            onChange={(e) => handleNestedInputChange('pretermBirths', 'alive', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA08. Kangaroo care */}
                                <tr>
                                    <td>MA08. No. of pre-term low birth weight babies (&lt;2.5 Kg) initiated on kangaroo (KMC)</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.kangarooCare}
                                            onChange={(e) => handleInputChange('kangarooCare', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA09. Live babies at discharge */}
                                <tr>
                                    <td>MA09. Live babies at discharge</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.liveBabiesAtDischarge}
                                            onChange={(e) => handleInputChange('liveBabiesAtDischarge', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA10. Babies received LLINs */}
                                <tr>
                                    <td>MA10. No. of Babies received LLINs</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.babiesReceivedLLINs}
                                            onChange={(e) => handleInputChange('babiesReceivedLLINs', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA11. Babies born with defects */}
                                <tr>
                                    <td>MA11. Total No. of Babies born with defects</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Clubfoot</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('babiesWithDefects', 'clubfoot')}
                                            onChange={(e) => handleNestedInputChange('babiesWithDefects', 'clubfoot', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Other defects</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('babiesWithDefects', 'otherDefects')}
                                            onChange={(e) => handleNestedInputChange('babiesWithDefects', 'otherDefects', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA12. Newborn deaths */}
                                <tr>
                                    <td>MA12. Newborn deaths (0-7 days)</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.newbornDeaths}
                                            onChange={(e) => handleInputChange('newbornDeaths', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA13. Maternal deaths */}
                                <tr>
                                    <td>MA13. Maternal deaths</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Below 15 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('maternalDeaths', 'below15')}
                                            onChange={(e) => handleNestedInputChange('maternalDeaths', 'below15', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">15-19 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('maternalDeaths', 'age15to19')}
                                            onChange={(e) => handleNestedInputChange('maternalDeaths', 'age15to19', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">20-24 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('maternalDeaths', 'age20to24')}
                                            onChange={(e) => handleNestedInputChange('maternalDeaths', 'age20to24', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">25-49 Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('maternalDeaths', 'age25to49')}
                                            onChange={(e) => handleNestedInputChange('maternalDeaths', 'age25to49', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">50+ Years</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('maternalDeaths', 'age50plus')}
                                            onChange={(e) => handleNestedInputChange('maternalDeaths', 'age50plus', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA23. Birth asphyxia */}
                                <tr>
                                    <td>MA23. No. of babies with Birth asphyxia</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.birthAsphyxia}
                                            onChange={(e) => handleInputChange('birthAsphyxia', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA24. Live babies resuscitated */}
                                <tr>
                                    <td>MA24. No. of Live babies Successfully Resuscitated</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={maternityData.liveBabiesResuscitated}
                                            onChange={(e) => handleInputChange('liveBabiesResuscitated', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA25. PNC check 6 hours */}
                                <tr>
                                    <td>MA25. No. received PNC check at 6 hours after birth</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Baby</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pncCheck6Hours', 'baby')}
                                            onChange={(e) => handleNestedInputChange('pncCheck6Hours', 'baby', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Mother</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pncCheck6Hours', 'mother')}
                                            onChange={(e) => handleNestedInputChange('pncCheck6Hours', 'mother', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA26. PNC check 24 hours */}
                                <tr>
                                    <td>MA26. No. received PNC within 24 hours after birth</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Baby</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pncCheck24Hours', 'baby')}
                                            onChange={(e) => handleNestedInputChange('pncCheck24Hours', 'baby', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Mother</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('pncCheck24Hours', 'mother')}
                                            onChange={(e) => handleNestedInputChange('pncCheck24Hours', 'mother', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA27. Uterotonics in labour */}
                                <tr>
                                    <td>MA27. No. of women who received Uterotonics in management of 3rd stage of labour</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Oxytocin</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsLabour', 'oxytocin')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsLabour', 'oxytocin', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Misoprostol</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsLabour', 'misoprostol')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsLabour', 'misoprostol', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Heat stable Carbetocin</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsLabour', 'carbetocin')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsLabour', 'carbetocin', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Ergometrine</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsLabour', 'ergometrine')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsLabour', 'ergometrine', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>

                                {/* MA28. Uterotonics PPH */}
                                <tr>
                                    <td>MA28. No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Oxytocin</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsPph', 'oxytocin')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsPph', 'oxytocin', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Misoprostol</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsPph', 'misoprostol')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsPph', 'misoprostol', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Tranexamic</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsPph', 'tranexamic')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsPph', 'tranexamic', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="ps-4">Ergometrine</td>
                                    <td className="text-center">
                                        <FormInput 
                                            value={getNestedValue('uterotonicsPph', 'ergometrine')}
                                            onChange={(e) => handleNestedInputChange('uterotonicsPph', 'ergometrine', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maternity;
