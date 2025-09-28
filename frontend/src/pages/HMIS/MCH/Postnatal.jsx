import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const Postnatal = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [postnatalData, setPostnatalData] = useState({
    // PN01 - Post Natal Attendances
    attendances: {
      sixDays: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
      sixWeeks: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
      sixMonths: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 }
    },
    // PN02 - Community referrals
    communityReferrals: 0,
    // PN03 - TB Screening
    tbScreening: {
      screened: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
      presumed: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
      diagnosed: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 }
    },
    // PN04 - HIV testing
    hivTesting: { neg: 0, pos: 0 },
    // PN05 - HIV re-testing
    hivRetesting: { neg: 0, pos: 0 },
    // PN06 - ART initiation
    artInitiation: 0,
    // PN07 - MCH enrollment
    mchEnrollment: 0,
    // PN08 - Mother-baby pairs
    motherBabyPairs: 0,
    // PN09 - Male partner HIV results
    malePartnerHiv: { neg: 0, pos: 0 },
    // PN10 - Male partner ART
    malePartnerArt: 0,
    // PN11 - Self-testing kits
    selfTestingKits: { total: 0, returnedPos: 0, returnedNeg: 0 },
    // PN12 - Discordant couples
    discordantCouples: 0,
    // PN13 - Breast cancer
    breastCancer: { screened: 0, preMalignant: 0 },
    // PN14 - Cervix cancer
    cervixCancer: { screened: 0, preMalignant: 0 },
    // PN15 - Nutritional assessment
    nutritionalAssessment: { total: 0, mamSam: 0, hivPos: 0 },
    // PN16 - Counselling
    counselling: {
      maternalNutrition: { total: 0, hivPos: 0 },
      infantFeeding: { total: 0, hivPos: 0 }
    }
  });

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthNumber = getMonthNumber(selectedMonth);
      const reportMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      // Fetch data from all postnatal endpoints
      const [attendanceResponse, referralsResponse, tbScreeningResponse] =
        await Promise.all([
          API.get(`/postnatal/attendance?report_month=${reportMonth}`),
          API.get(`/postnatal/community_referrals?report_month=${reportMonth}`),
          API.get(`/postnatal/tb_screening?report_month=${reportMonth}`),
        ]);

      // Process attendance data
      let processedAttendances = {
        sixDays: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
        sixWeeks: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
        sixMonths: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 }
      };

      if (attendanceResponse.data && attendanceResponse.data.length > 0) {
        attendanceResponse.data.forEach((item) => {
          const timing = item.timing === "6 Days" ? "sixDays" : 
                        item.timing === "6 Weeks" ? "sixWeeks" : "sixMonths";
          processedAttendances[timing] = {
            below15: parseInt(item.below_15yrs) || 0,
            age15to19: parseInt(item["15_19yrs"]) || 0,
            age20to24: parseInt(item["20_24yrs"]) || 0,
            age25to49: parseInt(item["25_50yrs"]) || 0,
            age50plus: parseInt(item["50+yrs"]) || 0
          };
        });
      }

      // Process TB screening data
      let processedTbScreening = {
        screened: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
        presumed: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 },
        diagnosed: { below15: 0, age15to19: 0, age20to24: 0, age25to49: 0, age50plus: 0 }
      };

      if (tbScreeningResponse.data && tbScreeningResponse.data.length > 0) {
        tbScreeningResponse.data.forEach((item) => {
          const status = item.status === "screened" ? "screened" : 
                        item.status === "presumed" ? "presumed" : "diagnosed";
          processedTbScreening[status] = {
            below15: parseInt(item.below_15yrs) || 0,
            age15to19: parseInt(item["15_19yrs"]) || 0,
            age20to24: parseInt(item["20_24yrs"]) || 0,
            age25to49: parseInt(item["25_50yrs"]) || 0,
            age50plus: parseInt(item["50plus"]) || 0
          };
        });
      }

      // Update state with processed data
      setPostnatalData(prev => ({
        ...prev,
        attendances: processedAttendances,
        communityReferrals: referralsResponse.data?.[0]?.total_patients || 0,
        tbScreening: processedTbScreening
      }));

    } catch (error) {
      console.error("Error fetching postnatal data:", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

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
    return postnatalData[parentField]?.[childField] || 0;
  };

  const getDeepNestedValue = (parentField, childField, grandChildField) => {
    return postnatalData[parentField]?.[childField]?.[grandChildField] || 0;
  };

  // Handle input changes with proper null checks
  const handleInputChange = (field, value) => {
    setPostnatalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField, childField, value) => {
    setPostnatalData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] || {}),
        [childField]: value
      }
    }));
  };

  const handleDeepNestedInputChange = (parentField, childField, grandChildField, value) => {
    setPostnatalData(prev => ({
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
        2.3 POSTNATAL
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
                  <th className="text-center" style={{ fontWeight: "normal" }}>Below 15</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>15-19</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>20-24</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>25-49</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>50+</th>
                </tr>
              </thead>
              <tbody>
                {/* PN01. Post Natal Attendances */}
                <tr>
                  <td>PN01. Post Natal Attendances</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">6 Days</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixDays', 'below15')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixDays', 'below15', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixDays', 'age15to19')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixDays', 'age15to19', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixDays', 'age20to24')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixDays', 'age20to24', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixDays', 'age25to49')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixDays', 'age25to49', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixDays', 'age50plus')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixDays', 'age50plus', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">6 Weeks</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixWeeks', 'below15')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixWeeks', 'below15', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixWeeks', 'age15to19')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixWeeks', 'age15to19', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixWeeks', 'age20to24')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixWeeks', 'age20to24', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixWeeks', 'age25to49')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixWeeks', 'age25to49', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixWeeks', 'age50plus')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixWeeks', 'age50plus', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">6 Months</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixMonths', 'below15')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixMonths', 'below15', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixMonths', 'age15to19')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixMonths', 'age15to19', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixMonths', 'age20to24')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixMonths', 'age20to24', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixMonths', 'age25to49')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixMonths', 'age25to49', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('attendances', 'sixMonths', 'age50plus')}
                      onChange={(e) => handleDeepNestedInputChange('attendances', 'sixMonths', 'age50plus', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN02. Community referrals */}
                <tr>
                  <td>PN02. Community referrals to PNC</td>
                  <td className="text-center">
                    <FormInput 
                      value={postnatalData.communityReferrals}
                      onChange={(e) => handleInputChange('communityReferrals', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>


                {/* PN13. Breast cancer */}
                <tr>
                  <td>PN13. Cancer of the breast</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Clients screened for Cancer of the Breast</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('breastCancer', 'screened')}
                      onChange={(e) => handleNestedInputChange('breastCancer', 'screened', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Clients with pre-malignant conditions of breast</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('breastCancer', 'preMalignant')}
                      onChange={(e) => handleNestedInputChange('breastCancer', 'preMalignant', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                {/* PN14. Cervix cancer */}
                <tr>
                  <td>PN14. Cancer of the Cervix</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Clients screened for Cancer of the Cervix</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('cervixCancer', 'screened')}
                      onChange={(e) => handleNestedInputChange('cervixCancer', 'screened', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Clients with pre-malignant conditions of cervix</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('cervixCancer', 'preMalignant')}
                      onChange={(e) => handleNestedInputChange('cervixCancer', 'preMalignant', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                {/* PN15. Nutritional assessment */}
                <tr>
                  <td>PN15. Lactating mothers who received Nutritional assessment</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Total</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('nutritionalAssessment', 'total')}
                      onChange={(e) => handleNestedInputChange('nutritionalAssessment', 'total', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">MAM & SAM</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('nutritionalAssessment', 'mamSam')}
                      onChange={(e) => handleNestedInputChange('nutritionalAssessment', 'mamSam', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">HIV POS</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('nutritionalAssessment', 'hivPos')}
                      onChange={(e) => handleNestedInputChange('nutritionalAssessment', 'hivPos', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
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
                {/* PN03. TB Screening */}
                <tr>
                  <td>PN03. TB Screening for PNC Clients</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Screened for TB</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('tbScreening', 'screened', 'below15') + getDeepNestedValue('tbScreening', 'screened', 'age15to19') + getDeepNestedValue('tbScreening', 'screened', 'age20to24') + getDeepNestedValue('tbScreening', 'screened', 'age25to49') + getDeepNestedValue('tbScreening', 'screened', 'age50plus')}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Presumed to have TB</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('tbScreening', 'presumed', 'below15') + getDeepNestedValue('tbScreening', 'presumed', 'age15to19') + getDeepNestedValue('tbScreening', 'presumed', 'age20to24') + getDeepNestedValue('tbScreening', 'presumed', 'age25to49') + getDeepNestedValue('tbScreening', 'presumed', 'age50plus')}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Diagnosed with TB</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('tbScreening', 'diagnosed', 'below15') + getDeepNestedValue('tbScreening', 'diagnosed', 'age15to19') + getDeepNestedValue('tbScreening', 'diagnosed', 'age20to24') + getDeepNestedValue('tbScreening', 'diagnosed', 'age25to49') + getDeepNestedValue('tbScreening', 'diagnosed', 'age50plus')}
                      readOnly
                    />
                  </td>
                </tr>

                {/* PN04. HIV Testing */}
                <tr>
                  <td>PN04. Breast feeding mothers tested for HIV 1st time during Postnatal</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">NEG</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('hivTesting', 'neg')}
                      onChange={(e) => handleNestedInputChange('hivTesting', 'neg', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">POS</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('hivTesting', 'pos')}
                      onChange={(e) => handleNestedInputChange('hivTesting', 'pos', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN05. HIV Re-testing */}
                <tr>
                  <td>PN05. Breastfeeding mothers re-tested for HIV during Postnatal</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">NEG</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('hivRetesting', 'neg')}
                      onChange={(e) => handleNestedInputChange('hivRetesting', 'neg', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">POS</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('hivRetesting', 'pos')}
                      onChange={(e) => handleNestedInputChange('hivRetesting', 'pos', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN06. ART Initiation */}
                <tr>
                  <td>PN06. HIV+ women initiating ART in Postnatal</td>
                  <td className="text-center">
                    <FormInput 
                      value={postnatalData.artInitiation}
                      onChange={(e) => handleInputChange('artInitiation', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN07. MCH Enrollment */}
                <tr>
                  <td>PN07. HIV+ breast feeding mothers newly enrolled in MCH groups</td>
                  <td className="text-center">
                    <FormInput 
                      value={postnatalData.mchEnrollment}
                      onChange={(e) => handleInputChange('mchEnrollment', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN08. Mother-baby pairs */}
                <tr>
                  <td>PN08. Mother-baby pairs enrolled at Mother-Baby care point</td>
                  <td className="text-center">
                    <FormInput 
                      value={postnatalData.motherBabyPairs}
                      onChange={(e) => handleInputChange('motherBabyPairs', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN09. Male partner HIV */}
                <tr>
                  <td>PN09. Male partners received HIV test results in the postnatal setting</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">NEG</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('malePartnerHiv', 'neg')}
                      onChange={(e) => handleNestedInputChange('malePartnerHiv', 'neg', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">POS</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('malePartnerHiv', 'pos')}
                      onChange={(e) => handleNestedInputChange('malePartnerHiv', 'pos', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN10. Male partner ART */}
                <tr>
                  <td>PN10. HIV+ male partners initiated on ART in the postnatal setting</td>
                  <td className="text-center">
                    <FormInput 
                      value={postnatalData.malePartnerArt}
                      onChange={(e) => handleInputChange('malePartnerArt', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN11. Self-testing kits */}
                <tr>
                  <td>PN11. Breast feeding mothers given self-testing kits for their male partners</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="ps-4">Total</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('selfTestingKits', 'total')}
                      onChange={(e) => handleNestedInputChange('selfTestingKits', 'total', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Tests returned HIV POS</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('selfTestingKits', 'returnedPos')}
                      onChange={(e) => handleNestedInputChange('selfTestingKits', 'returnedPos', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Tests returned HIV NEG</td>
                  <td className="text-center">
                    <FormInput 
                      value={getNestedValue('selfTestingKits', 'returnedNeg')}
                      onChange={(e) => handleNestedInputChange('selfTestingKits', 'returnedNeg', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>

                {/* PN12. Discordant couples */}
                <tr>
                  <td>PN12. No. of discordant couples identified in PNC</td>
                  <td className="text-center">
                    <FormInput 
                      value={postnatalData.discordantCouples}
                      onChange={(e) => handleInputChange('discordantCouples', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>


                {/* PN16. Counselling */}
                <tr>
                  <td>PN16. Post-natal mothers who received Counselling</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="2" className="ps-4">Maternal Nutrition</td>
                </tr>
                <tr>
                  <td className="ps-5">Total</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('counselling', 'maternalNutrition', 'total')}
                      onChange={(e) => handleDeepNestedInputChange('counselling', 'maternalNutrition', 'total', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">HIV +</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('counselling', 'maternalNutrition', 'hivPos')}
                      onChange={(e) => handleDeepNestedInputChange('counselling', 'maternalNutrition', 'hivPos', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="ps-4">Infant Feeding</td>
                </tr>
                <tr>
                  <td className="ps-5">Total</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('counselling', 'infantFeeding', 'total')}
                      onChange={(e) => handleDeepNestedInputChange('counselling', 'infantFeeding', 'total', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">HIV +</td>
                  <td className="text-center">
                    <FormInput 
                      value={getDeepNestedValue('counselling', 'infantFeeding', 'hivPos')}
                      onChange={(e) => handleDeepNestedInputChange('counselling', 'infantFeeding', 'hivPos', parseInt(e.target.value) || 0)}
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

export default Postnatal;
