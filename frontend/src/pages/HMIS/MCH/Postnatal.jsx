import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const Postnatal = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [postnatalData, setPostnatalData] = useState([
    {
      hmis_code: "PN01",
      hmis_name: "Post Natal Attendances",
      timing: "6 Days",
      Below_15yrs: "0",
      "15_19yrs": "0",
      "20_24yrs": "0",
      "25_49yrs": "0",
      "50+yrs": "0",
    },
    {
      hmis_code: "PN01",
      hmis_name: "Post Natal Attendances",
      timing: "6 Weeks",
      Below_15yrs: "0",
      "15_19yrs": "0",
      "20_24yrs": "0",
      "25_49yrs": "0",
      "50+yrs": "0",
    },
    {
      hmis_code: "PN01",
      hmis_name: "Post Natal Attendances",
      timing: "6 Months",
      Below_15yrs: "0",
      "15_19yrs": "0",
      "20_24yrs": "0",
      "25_49yrs": "0",
      "50+yrs": "0",
    },
  ]);

  const [referralsData, setReferralsData] = useState({
    hmis_code: "PN02",
    hmis_name: "Community referrals to PNC",
    value: "0",
  });

  const [tbScreeningData, setTbScreeningData] = useState([
    {
      hmis_code: "PN03",
      hmis_name: "TB Screening for PNC Clients",
      category: "Screened for TB",
      Below_15yrs: "0",
      "15_19yrs": "0",
      "20_24yrs": "0",
      "25_49yrs": "0",
      "50+yrs": "0",
    },
    {
      hmis_code: "PN03",
      hmis_name: "TB Screening for PNC Clients",
      category: "Presumed to have TB",
      Below_15yrs: "0",
      "15_19yrs": "0",
      "20_24yrs": "0",
      "25_49yrs": "0",
      "50+yrs": "0",
    },
    {
      hmis_code: "PN03",
      hmis_name: "TB Screening for PNC Clients",
      category: "Diagnosed with TB",
      Below_15yrs: "0",
      "15_19yrs": "0",
      "20_24yrs": "0",
      "25_49yrs": "0",
      "50+yrs": "0",
    },
  ]);

  const [hivTestData, setHivTestData] = useState({
    hmis_code: "PN04",
    hmis_name:
      "Breast feeding mothers tested for HIV 1st time during Postnatal",
    NEG: "0",
    POS: "0",
  });

  const [hivRetestData, setHivRetestData] = useState({
    hmis_code: "PN05",
    hmis_name: "Breastfeeding mothers re-tested for HIV during Postnatal",
    NEG: "0",
    POS: "0",
  });

  const [artInitiationData, setArtInitiationData] = useState({
    hmis_code: "PN06",
    hmis_name: "HIV+ women initiating ART in Postnatal",
    value: "0",
  });

  const [mchEnrollmentData, setMchEnrollmentData] = useState({
    hmis_code: "PN07",
    hmis_name: "HIV+ breast feeding mothers newly enrolled in MCH groups",
    value: "0",
  });

  const [motherBabyPairsData, setMotherBabyPairsData] = useState({
    hmis_code: "PN08",
    hmis_name: "Mother-baby pairs enrolled at Mother-Baby care point",
    value: "0",
  });

  const [malePartnerHivData, setMalePartnerHivData] = useState({
    hmis_code: "PN09",
    hmis_name:
      "Male partners received HIV test results in the postnatal setting",
    NEG: "0",
    POS: "0",
  });

  const [malePartnerArtData, setMalePartnerArtData] = useState({
    hmis_code: "PN10",
    hmis_name: "HIV+ male partners initiated on ART in the postnatal setting",
    value: "0",
  });

  const [selfTestingKitsData, setSelfTestingKitsData] = useState({
    hmis_code: "PN11",
    hmis_name:
      "Breast feeding mothers given self-testing kits for their male partners",
    total: "0",
    tests_returned_pos: "0",
    tests_returned_neg: "0",
  });

  const [discordantCouplesData, setDiscordantCouplesData] = useState({
    hmis_code: "PN12",
    hmis_name: "No. of discordant couples identified in PNC",
    value: "0",
  });

  const [breastCancerData, setBreastCancerData] = useState({
    hmis_code: "PN13",
    hmis_name: "Cancer of the breast",
    screened: "0",
    pre_malignant: "0",
  });

  const [cervixCancerData, setCervixCancerData] = useState({
    hmis_code: "PN14",
    hmis_name: "Cancer of the Cervix",
    screened: "0",
    pre_malignant: "0",
  });

  const [nutritionalAssessmentData, setNutritionalAssessmentData] = useState({
    hmis_code: "PN15",
    hmis_name: "Lactating mothers who received Nutritional assessment",
    total: "0",
    mam_sam: "0",
    hiv_pos: "0",
  });

  const [counsellingData, setCounsellingData] = useState({
    hmis_code: "PN16",
    hmis_name: "Post-natal mothers who received Counselling",
    maternal_nutrition: {
      total: "0",
      hiv_pos: "0",
    },
    infant_feeding: {
      total: "0",
      hiv_pos: "0",
    },
  });

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData();
    }
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
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

      // Update postnatal attendance data
      if (attendanceResponse.data && attendanceResponse.data.length > 0) {
        const attendanceData = attendanceResponse.data.map((item) => ({
          hmis_code: "PN01",
          hmis_name: "Post Natal Attendances",
          timing: item.timing,
          Below_15yrs: item.below_15yrs || "0",
          "15_19yrs": item["15_19yrs"] || "0",
          "20_24yrs": item["20_24yrs"] || "0",
          "25_49yrs": item["25_50yrs"] || "0",
          "50+yrs": item["50+yrs"] || "0",
        }));
        setPostnatalData(attendanceData);
      }

      // Update community referrals data
      if (referralsResponse.data && referralsResponse.data.length > 0) {
        const referralData = referralsResponse.data[0];
        setReferralsData({
          hmis_code: "PN02",
          hmis_name: "Community referrals to PNC",
          value: referralData.total_patients || "0",
        });
      }

      // Update TB screening data
      if (tbScreeningResponse.data && tbScreeningResponse.data.length > 0) {
        const tbData = tbScreeningResponse.data.map((item) => ({
          hmis_code: "PN03",
          hmis_name: "TB Screening for PNC Clients",
          category:
            item.status === "screened"
              ? "Screened for TB"
              : item.status === "presumed"
              ? "Presumed to have TB"
              : "Diagnosed with TB",
          Below_15yrs: item.below_15yrs || "0",
          "15_19yrs": item["15_19yrs"] || "0",
          "20_24yrs": item["20_24yrs"] || "0",
          "25_49yrs": item["25_50yrs"] || "0",
          "50+yrs": item["50plus"] || "0",
        }));
        setTbScreeningData(tbData);
      }
    } catch (error) {
      console.error("Error fetching postnatal data:", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const getValueForCell = (item, ageGroup) => {
    const key = `${ageGroup}`;
    return item[key] || "0";
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading postnatal data...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        2.0 MATERNAL AND CHILD HEALTH SERVICES
      </div>

      <div className="section-subheader mb-3">2.3 POSTNATAL</div>

      {/* Post Natal Attendances Table */}
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th>Category</th>
            {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(
              (ag, i) => (
                <th key={i} className="text-center">
                  {ag}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {postnatalData.map((row, index) => (
            <tr key={index}>
              <td>{row.timing}</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_49yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, ageGroup)}
                    readOnly
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* TB Screening Table */}
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th>Category</th>
            {["Below_15yrs", "15_19yrs", "20_24yrs", "25_49yrs", "50+yrs"].map(
              (ag, i) => (
                <th key={i} className="text-center">
                  {ag}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {tbScreeningData.map((row, index) => (
            <tr key={index}>
              <td>{row.category}</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_49yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={getValueForCell(row, ageGroup)}
                    readOnly
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Community Referrals Section */}
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th>Category</th>
            <th className="text-center">Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {referralsData.hmis_code}. {referralsData.hmis_name}
            </td>
            <td className="text-center">
              <input
                type="number"
                min="0"
                className="form-control form-control-sm text-center"
                value={referralsData.value}
                readOnly
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Two Column Layout for Additional Sections */}
      <div className="row">
        {/* Left Column */}
        <div className="col-6">
          {/* PN05-PN10 */}
          <table className="data-entry-table mb-4">
            <thead>
              <tr>
                <th style={{ width: "70%" }}>Category</th>
                <th className="text-end" style={{ width: "30%" }}>
                  Number
                </th>
              </tr>
            </thead>
            <tbody>
              {/* PN05 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {hivRetestData.hmis_code}. {hivRetestData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">NEG</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={hivRetestData.NEG}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">POS</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={hivRetestData.POS}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN06 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {artInitiationData.hmis_code}. {artInitiationData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={artInitiationData.value}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN07 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {mchEnrollmentData.hmis_code}. {mchEnrollmentData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={mchEnrollmentData.value}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN08 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {motherBabyPairsData.hmis_code}.{" "}
                  {motherBabyPairsData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={motherBabyPairsData.value}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN09 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {malePartnerHivData.hmis_code}. {malePartnerHivData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">NEG</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={malePartnerHivData.NEG}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">POS</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={malePartnerHivData.POS}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN10 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {malePartnerArtData.hmis_code}. {malePartnerArtData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={malePartnerArtData.value}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="col-6">
          {/* PN11-PN16 */}
          <table className="data-entry-table mb-4">
            <thead>
              <tr>
                <th style={{ width: "70%" }}>Category</th>
                <th className="text-end" style={{ width: "30%" }}>
                  Number
                </th>
              </tr>
            </thead>
            <tbody>
              {/* PN11 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {selfTestingKitsData.hmis_code}.{" "}
                  {selfTestingKitsData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={selfTestingKitsData.total}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">Tests returned HIV POS</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={selfTestingKitsData.tests_returned_pos}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">Tests returned HIV NEG</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={selfTestingKitsData.tests_returned_neg}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN12 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {discordantCouplesData.hmis_code}.{" "}
                  {discordantCouplesData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={discordantCouplesData.value}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN13 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {breastCancerData.hmis_code}. {breastCancerData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">
                  Clients screened for Cancer of the Breast
                </td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={breastCancerData.screened}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">
                  Clients with pre-malignant conditions of breast
                </td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={breastCancerData.pre_malignant}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN14 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {cervixCancerData.hmis_code}. {cervixCancerData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">
                  Clients screened for Cancer of the Cervix
                </td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={cervixCancerData.screened}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">
                  Clients with pre-malignant conditions of cervix
                </td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={cervixCancerData.pre_malignant}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN15 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {nutritionalAssessmentData.hmis_code}.{" "}
                  {nutritionalAssessmentData.hmis_name}
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={nutritionalAssessmentData.total}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">MAM & SAM</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={nutritionalAssessmentData.mam_sam}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">HIV POS</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={nutritionalAssessmentData.hiv_pos}
                    readOnly
                  />
                </td>
              </tr>

              {/* PN16 */}
              <tr>
                <td colSpan="2" className="bg-light">
                  {counsellingData.hmis_code}. {counsellingData.hmis_name}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="ps-4">
                  Maternal Nutrition
                </td>
              </tr>
              <tr>
                <td className="ps-5">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={counsellingData.maternal_nutrition.total}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-5">HIV +</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={counsellingData.maternal_nutrition.hiv_pos}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="ps-4">
                  Infant Feeding
                </td>
              </tr>
              <tr>
                <td className="ps-5">Total</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={counsellingData.infant_feeding.total}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-5">HIV +</td>
                <td className="text-end">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-end"
                    style={{ textAlign: "right" }}
                    value={counsellingData.infant_feeding.hiv_pos}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Postnatal;
