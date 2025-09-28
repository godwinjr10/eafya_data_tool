import React, { useState, useEffect, useCallback } from "react";
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
  const [syphilisData, setSyphilisData] = useState({});
  const [hepatitisData, setHepatitisData] = useState({});

  // Fetch data from API
  const fetchAntenatalData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthNumber = getMonthNumber(selectedMonth);
      const reportMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      // Fetch data from the new visits and totals endpoints
      const [visitsResponse, fansidarResponse, bloodgroupResponse, anaemiaTestedResponse, anaemiaConfirmedResponse, syphilisResponse, hepatitisResponse, antenatal10Response] = await Promise.all([
        API.get(`/antenatal/visits?report_month=${reportMonth}`),
        API.get(`/antenatal/fansidar?report_month=${reportMonth}`),
        API.get(`/antenatal/bloodgroup?report_month=${reportMonth}`),
        API.get(`/antenatal/anaemia_tested?report_month=${reportMonth}`),
        API.get(`/antenatal/anaemia_confirmed?report_month=${reportMonth}`),
        API.get(`/antenatal/syphilis?report_month=${reportMonth}`),
        API.get(`/antenatal/hepatitis?report_month=${reportMonth}`),
        API.get(`/antenatal/antenatal_10?report_month=${reportMonth}`),
      ]);

      // Process visits data (AN01-AN04)
      const visitsData = visitsResponse.data || [];
      const firstData = visitsData.filter(item => item.hmis_code === 'AN01');
      const fourthData = visitsData.filter(item => item.hmis_code === 'AN02');
      const eighthData = visitsData.filter(item => item.hmis_code === 'AN03');
      const totalData = visitsData.filter(item => item.hmis_code === 'AN04');

      // Process totals data (AN05) - keeping for future use

      setFirstData(firstData);
      setFourthData(fourthData);
      setEighthData(eighthData);
      setTotalData(totalData);
      setIptData(fansidarResponse.data || []);
      setTabletsData(antenatal10Response.data || []);

      // Set blood grouping data from bloodgroup endpoint
      setBloodGroupingData(bloodgroupResponse.data || []);

      // Set anaemia data from new endpoints
      const anaemiaData = [];
      if (anaemiaTestedResponse.data && anaemiaTestedResponse.data.length > 0) {
        anaemiaData.push({
          hmis_code: "AN08",
          hmis_name:
            "No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit",
          Below_15yrs: anaemiaTestedResponse.data[0]["Below 15 Years"] || 0,
          "15_19yrs": anaemiaTestedResponse.data[0]["15 - 19 Years"] || 0,
          "20_24yrs": anaemiaTestedResponse.data[0]["20 - 24 Years"] || 0,
          "25_49yrs": anaemiaTestedResponse.data[0]["25 - 49 Years"] || 0,
          "50+yrs": anaemiaTestedResponse.data[0]["50+ Years"] || 0,
        });
      }
      if (anaemiaConfirmedResponse.data && anaemiaConfirmedResponse.data.length > 0) {
        anaemiaData.push({
          hmis_code: "AN09",
          hmis_name:
            "No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit",
          Below_15yrs: anaemiaConfirmedResponse.data[0]["Below 15 Years"] || 0,
          "15_19yrs": anaemiaConfirmedResponse.data[0]["15 - 19 Years"] || 0,
          "20_24yrs": anaemiaConfirmedResponse.data[0]["20 - 24 Years"] || 0,
          "25_49yrs": anaemiaConfirmedResponse.data[0]["25 - 49 Years"] || 0,
          "50+yrs": anaemiaConfirmedResponse.data[0]["50+ Years"] || 0,
        });
      }
      setAnaemiaData(anaemiaData);

      // Set syphilis and hepatitis data from new endpoints
      setSyphilisData(syphilisResponse.data || {});
      setHepatitisData(hepatitisResponse.data || {});

    } catch (error) {
      console.error("Error fetching antenatal data:", error);
      // Set empty data on error
      setFirstData([]);
      setFourthData([]);
      setEighthData([]);
      setTotalData([]);
      setIptData([]);
      setBloodGroupingData([]);
      setAnaemiaData([]);
      setTabletsData([]);
      setSyphilisData({});
      setHepatitisData({});
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  // Fetch data when month/year changes
  useEffect(() => {
    fetchAntenatalData();
  }, [selectedMonth, selectedYear, fetchAntenatalData]);

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

  // Spinner component
  const Spinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ padding: '2rem' }}>
      <div className="spinner-border text-primary" role="status">
      </div>
    </div>
  );


  // Check if we have any data
  // const hasData = firstData.length > 0 || fourthData.length > 0 || eighthData.length > 0 || 
  //                 totalData.length > 0 || iptData.length > 0 || anaemiaData.length > 0;

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
      <div className="section-header">
        2.0 MATERNAL AND CHILD HEALTH SERVICES
      </div>

      <div className="section-subheader mb-3">2.1 ANTENATAL</div>

      {loading ? (
        <Spinner />
      ) :  (
        <>

        <table className="data-entry-table compact-table">
          <thead>
            <tr>
              <th style={{ fontWeight: "normal" }}>Category</th>
              {[
                "Below 15 Years",
                "15 - 19 Years",
                "20 - 24 Years",
                "25 - 49 Years",
                "50+ Years",
                "Total",
              ].map((ag, i) => (
                <th
                  key={i}
                  className="text-center"
                  style={{ fontWeight: "normal" }}
                >
                  {ag}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* AN01 - ANC 1st contacts with sub-rows */}
            <tr>
              <td>AN01. ANC 1st contacts/visits for women</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value={firstData.length > 0 ? getValueForCell(firstData[0], ageGroup) : "0"}
                      readOnly
                    />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={firstData.length > 0 ? computeTotal(firstData[0], [
                    "Below_15yrs",
                    "15_19yrs",
                    "20_24yrs",
                    "25_50yrs",
                    "50+yrs",
                  ]) : "0"}
                  readOnly
                />
              </td>
            </tr>
            {/* AN01 Sub-row: No. in 1st Trimester */}
            <tr>
              <td className="ps-4">No. in 1st Trimester</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value="0"
                  readOnly
                />
              </td>
            </tr>

            {/* AN02 - ANC 4th contacts */}
            <tr>
              <td>AN02. ANC 4th contacts/visits for women</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={fourthData.length > 0 ? getValueForCell(fourthData[0], ageGroup) : "0"}
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={fourthData.length > 0 ? computeTotal(fourthData[0], [
                    "Below_15yrs",
                    "15_19yrs",
                    "20_24yrs",
                    "25_50yrs",
                    "50+yrs",
                  ]) : "0"}
                  readOnly
                />
              </td>
            </tr>

            {/* AN03 - ANC 8th contacts */}
            <tr>
              <td>AN03. ANC 8th contacts/visits for women</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={eighthData.length > 0 ? getValueForCell(eighthData[0], ageGroup) : "0"}
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={eighthData.length > 0 ? computeTotal(eighthData[0], [
                    "Below_15yrs",
                    "15_19yrs",
                    "20_24yrs",
                    "25_50yrs",
                    "50+yrs",
                  ]) : "0"}
                  readOnly
                />
              </td>
            </tr>

            {/* AN04 - Total ANC contacts */}
            <tr>
              <td>AN04. Total ANC contacts/visits</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={totalData.length > 0 ? getValueForCell(totalData[0], ageGroup) : "0"}
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={totalData.length > 0 ? computeTotal(totalData[0], [
                    "Below_15yrs",
                    "15_19yrs",
                    "20_24yrs",
                    "25_50yrs",
                    "50+yrs",
                  ]) : "0"}
                  readOnly
                />
              </td>
            </tr>

            {/* AN05 - Referrals from community */}
            <tr>
              <td>AN05. Referrals from community</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value="0"
                  readOnly
                />
              </td>
            </tr>

            {/* AN06 - IPT Header Row */}
            <tr>
              <td colSpan="6">AN06. No. of pregnant women who received IPT</td>
            </tr>

            {/* IPT1 - First dose IPT */}
            <tr>
              <td className="ps-4">First dose IPT (IPT1)</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={iptData.find(item => item.ipt_dose_group === "First dose IPT (IPT1)") ? getValueForCell(iptData.find(item => item.ipt_dose_group === "First dose IPT (IPT1)"), ageGroup === "Below_15yrs" ? "below_15" : ageGroup === "15_19yrs" ? "age_15_19" : ageGroup === "20_24yrs" ? "age_20_24" : ageGroup === "25_50yrs" ? "age_25_49" : "age_50_plus") : "0"}
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for age cells
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={iptData.find(item => item.ipt_dose_group === "First dose IPT (IPT1)") ? computeTotal(iptData.find(item => item.ipt_dose_group === "First dose IPT (IPT1)"), ["below_15", "age_15_19", "age_20_24", "age_25_49", "age_50_plus"]) : "0"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                />
              </td>
            </tr>

            {/* IPT2 - Second dose IPT */}
            <tr>
              <td className="ps-4">Second dose IPT (IPT2)</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={iptData.find(item => item.ipt_dose_group === "Second dose IPT (IPT2)") ? getValueForCell(iptData.find(item => item.ipt_dose_group === "Second dose IPT (IPT2)"), ageGroup === "Below_15yrs" ? "below_15" : ageGroup === "15_19yrs" ? "age_15_19" : ageGroup === "20_24yrs" ? "age_20_24" : ageGroup === "25_50yrs" ? "age_25_49" : "age_50_plus") : "0"}
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for age cells
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={iptData.find(item => item.ipt_dose_group === "Second dose IPT (IPT2)") ? computeTotal(iptData.find(item => item.ipt_dose_group === "Second dose IPT (IPT2)"), ["below_15", "age_15_19", "age_20_24", "age_25_49", "age_50_plus"]) : "0"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                />
              </td>
            </tr>

            {/* IPT3 - Third dose IPT */}
            <tr>
              <td className="ps-4">Third dose IPT (IPT3)</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={iptData.find(item => item.ipt_dose_group === "Third dose IPT (IPT3)") ? getValueForCell(iptData.find(item => item.ipt_dose_group === "Third dose IPT (IPT3)"), ageGroup === "Below_15yrs" ? "below_15" : ageGroup === "15_19yrs" ? "age_15_19" : ageGroup === "20_24yrs" ? "age_20_24" : ageGroup === "25_50yrs" ? "age_25_49" : "age_50_plus") : "0"}
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for age cells
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={iptData.find(item => item.ipt_dose_group === "Third dose IPT (IPT3)") ? computeTotal(iptData.find(item => item.ipt_dose_group === "Third dose IPT (IPT3)"), ["below_15", "age_15_19", "age_20_24", "age_25_49", "age_50_plus"]) : "0"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                />
              </td>
            </tr>

            {/* IPT4 - IPT 4 & 4+ Dose */}
            <tr>
              <td className="ps-4">IPT 4 & 4+ Dose</td>
              {[
                "Below_15yrs",
                "15_19yrs",
                "20_24yrs",
                "25_50yrs",
                "50+yrs",
              ].map((ageGroup) => (
                <td key={ageGroup} className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={iptData.find(item => item.ipt_dose_group === "IPT 4 & 4+ Dose") ? getValueForCell(iptData.find(item => item.ipt_dose_group === "IPT 4 & 4+ Dose"), ageGroup === "Below_15yrs" ? "below_15" : ageGroup === "15_19yrs" ? "age_15_19" : ageGroup === "20_24yrs" ? "age_20_24" : ageGroup === "25_50yrs" ? "age_25_49" : "age_50_plus") : "0"}
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for age cells
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={iptData.find(item => item.ipt_dose_group === "IPT 4 & 4+ Dose") ? computeTotal(iptData.find(item => item.ipt_dose_group === "IPT 4 & 4+ Dose"), ["below_15", "age_15_19", "age_20_24", "age_25_49", "age_50_plus"]) : "0"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                />
              </td>
            </tr>

            {/* AN07 Blood Grouping */}
            <tr>
              <td colSpan="6">
                AN07. No. of pregnant women who were tested for blood grouping
              </td>
            </tr>
            {/* Blood Grouping Data from API */}
            {bloodGroupingData.length > 0 ? (
              bloodGroupingData.map((item, idx) => (
                <tr key={`AN07-${idx}`}>
                  <td className="ps-4">{item.blood_group} {item.rhesus_factor}</td>
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
                        className="form-control form-control-sm compact-input"
                        value={getValueForCell(item, ageGroup)}
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value={computeTotal(item, [
                        "Below_15yrs",
                        "15_19yrs",
                        "20_24yrs",
                        "25_49yrs",
                        "50+yrs",
                      ])}
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
              ))
            ) : (
              <>
                {/* Blood Group (O) */}
                <tr>
                  <td className="ps-4">Blood Group (O)</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus O+</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus O-</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                {/* Blood Group (A) */}
                <tr>
                  <td className="ps-4">Blood Group (A)</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus A+</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus A-</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                {/* Blood Group (B) */}
                <tr>
                  <td className="ps-4">Blood Group (B)</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus B+</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus B-</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                {/* Blood Group (AB) */}
                <tr>
                  <td className="ps-4">Blood Group (AB)</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus AB+</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">Rhesus AB-</td>
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
              </>
            )}

            {/* AN08 - Anaemia Testing */}
            <tr>
              <td>
                AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit
              </td>
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
                    className="form-control form-control-sm compact-input"
                    value={anaemiaData.length > 0 && anaemiaData[0].hmis_code === "AN08" ? getValueForCell(anaemiaData[0], ageGroup) : "0"}
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={anaemiaData.length > 0 && anaemiaData[0].hmis_code === "AN08" ? computeTotal(anaemiaData[0], [
                    "Below_15yrs",
                    "15_19yrs",
                    "20_24yrs",
                    "25_49yrs",
                    "50+yrs",
                  ]) : "0"}
                  readOnly
                />
              </td>
            </tr>

            {/* AN09 - Anaemia Cases */}
            <tr>
              <td>
                AN09. No. of pregnant women with Anaemia (Hb &lt;10g/dl) at ANC 1st Contact / visit
              </td>
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
                    className="form-control form-control-sm compact-input"
                    value={anaemiaData.length > 1 && anaemiaData[1].hmis_code === "AN09" ? getValueForCell(anaemiaData[1], ageGroup) : "0"}
                    readOnly
                  />
                </td>
              ))}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm compact-input"
                  value={anaemiaData.length > 1 && anaemiaData[1].hmis_code === "AN09" ? computeTotal(anaemiaData[1], [
                    "Below_15yrs",
                    "15_19yrs",
                    "20_24yrs",
                    "25_49yrs",
                    "50+yrs",
                  ]) : "0"}
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ANTENATAL (Continued) Section */}
        <div className="mt-4">
          <div className="section-subheader mb-3">ANTENATAL (Continued)</div>

          {/* Section 1: Age Group & Total Columns (AN10 - AN12) */}
          <table className="data-entry-table compact-table">
            <thead>
              <tr>
                <th style={{ fontWeight: "normal" }}>Category</th>
                {[
                  "Below 15 Years",
                  "15 - 19 Years",
                  "20 - 24 Years",
                  "25 - 49 Years",
                  "50+ Years",
                  "Total",
                ].map((ag, i) => (
                  <th
                    key={i}
                    className="text-center"
                    style={{ fontWeight: "normal" }}
                  >
                    {ag}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* AN10 - Tablets */}
              <tr>
                <td colSpan="6">
                  AN10. No. of pregnant women receiving atleast 30 Tablets of
                </td>
              </tr>
              <tr>
                <td className="ps-4">Folic Acid 0-12 wks of gestation</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value={tabletsData.find(item => item.supplement_category === "Folic Acid 0-12 wks of gestation") ? getValueForCell(tabletsData.find(item => item.supplement_category === "Folic Acid 0-12 wks of gestation"), ageGroup === "Below_15yrs" ? "below_15" : ageGroup === "15_19yrs" ? "age_15_19" : ageGroup === "20_24yrs" ? "age_20_24" : ageGroup === "25_50yrs" ? "age_25_49" : "age_50_plus") : "0"}
                      readOnly
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={tabletsData.find(item => item.supplement_category === "Folic Acid 0-12 wks of gestation") ? computeTotal(tabletsData.find(item => item.supplement_category === "Folic Acid 0-12 wks of gestation"), ["below_15", "age_15_19", "age_20_24", "age_25_49", "age_50_plus"]) : "0"}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">Iron & Folic Acid 13+ wks of gestation</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value={tabletsData.find(item => item.supplement_category === "Iron & Folic Acid 13+ wks of gestation") ? getValueForCell(tabletsData.find(item => item.supplement_category === "Iron & Folic Acid 13+ wks of gestation"), ageGroup === "Below_15yrs" ? "below_15" : ageGroup === "15_19yrs" ? "age_15_19" : ageGroup === "20_24yrs" ? "age_20_24" : ageGroup === "25_50yrs" ? "age_25_49" : "age_50_plus") : "0"}
                      readOnly
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value={tabletsData.find(item => item.supplement_category === "Iron & Folic Acid 13+ wks of gestation") ? computeTotal(tabletsData.find(item => item.supplement_category === "Iron & Folic Acid 13+ wks of gestation"), ["below_15", "age_15_19", "age_20_24", "age_25_49", "age_50_plus"]) : "0"}
                    readOnly
                  />
                </td>
              </tr>

              {/* AN11 - LLINs */}
              <tr>
                <td>AN11. Pregnant Women receiving LLINs at ANC 1st visit</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                  />
                </td>
              </tr>

              {/* AN12 - Ultrasound */}
              <tr>
                <td colSpan="6">
                  AN12. No. of pregnant women who received obstetric-ultra sound
                  scan during any ANC visit in the reporting month
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total U/S Scan done</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">No. done before 24 weeks of gestation</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section 2: Category & Number Columns (AN13 - AN16) */}
          <div className="row mt-4">
            <div className="col-md-6">
              <table className="data-entry-table compact-table">
                <thead>
                  <tr>
                    <th style={{ fontWeight: "normal" }}>Category</th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* AN13 - Deworming */}
                  <tr>
                    <td>AN13. No. of pregnant women dewormed</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* AN14 - Syphilis */}
                  <tr>
                    <td colSpan="2">
                      AN14. Pregnant Women tested for syphilis
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">First time this pregnancy</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value={syphilisData.first_time || "0"}
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
                        className="form-control form-control-sm compact-input"
                        value={syphilisData.newly_tested_positive || "0"}
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
                        className="form-control form-control-sm compact-input"
                        value={syphilisData.started_treatment || "0"}
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="data-entry-table compact-table">
                <thead>
                  <tr>
                    <th style={{ fontWeight: "normal" }}>Category</th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* AN15 - Male partner syphilis */}
                  <tr>
                    <td colSpan="2">AN15. Male partner tested for syphilis</td>
                  </tr>
                  <tr>
                    <td className="ps-4">Total Tested</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* AN16 - Hepatitis B */}
                  <tr>
                    <td colSpan="2">
                      AN16. No. Pregnant women tested for Hepatitis B.
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">Total Tested</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value={hepatitisData.total_tested || "0"}
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
                        className="form-control form-control-sm compact-input"
                        value={hepatitisData.tested_positive || "0"}
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Age Group & Total Columns with Shading (AN17 - AN21) */}
          <table className="data-entry-table mt-4">
            <thead>
              <tr>
                <th style={{ fontWeight: "normal" }}>Category</th>
                {[
                  "Below 15 Years",
                  "15 - 19 Years",
                  "20 - 24 Years",
                  "25 - 49 Years",
                  "50+ Years",
                  "Total",
                ].map((ag, i) => (
                  <th
                    key={i}
                    className="text-center"
                    style={{ fontWeight: "normal" }}
                  >
                    {ag}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* AN17 - HIV Testing */}
              <tr>
                <td colSpan="6">
                  AN17. Pregnant women newly tested for HIV in this pregnancy at
                  any ANC visit (NEG & POS)
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for total cells
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">ANC 1</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for total cells
                  />
                </td>
              </tr>

              {/* AN18 - HIV Positive Testing */}
              <tr>
                <td colSpan="6">
                  AN18. Pregnant Women tested HIV POS for 1st time this
                  pregnancy at any ANC Visit
                </td>
              </tr>
              <tr>
                <td className="ps-4">Total</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for total cells
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">ANC 1</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "white" }} // White background for total cells
                  />
                </td>
              </tr>

              {/* AN19 - CD4 Assessment */}
              <tr>
                <td>AN19. HIV+ Pregnant women assessed by CD4</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                  />
                </td>
              </tr>

              {/* AN20 - ART Initiation */}
              <tr>
                <td>
                  AN20. HIV+ pregnant women initiated on ART for eMTCT at any
                  visit irrespective of when tested HIV POS and HIV POS not yet
                  started ART
                </td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                  />
                </td>
              </tr>

              {/* AN21 - Known Status Before ANC */}
              <tr>
                <td colSpan="6">
                  AN21. Pregnant Women who knew status before 1st ANC
                </td>
              </tr>
              <tr>
                <td className="ps-4">NEG</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                  />
                </td>
              </tr>
              <tr>
                <td className="ps-4">POS</td>
                {[
                  "Below_15yrs",
                  "15_19yrs",
                  "20_24yrs",
                  "25_50yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm compact-input"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for age cells
                    />
                  </td>
                ))}
                <td className="text-center">
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm compact-input"
                    value="0"
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Antenatal Sections (AN23-AN28) */}
        <div className="mt-4">
          <div className="section-subheader mb-3">ANTENATAL (Continued)</div>

          {/* Top Block - Single Column Sections */}
          <div className="row">
            {/* Left Table - AN23, AN24, AN25 */}
            <div className="col-md-6">
              <table className="data-entry-table compact-table">
                <thead>
                  <tr>
                    <th style={{ fontWeight: "normal" }}>Category</th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* AN23 - HIV+ pregnant women */}
                  <tr>
                    <td colSpan="2">AN23. HIV+ pregnant women:</td>
                  </tr>
                  <tr>
                    <td className="ps-4">
                      Eligible for a Viral Load during the month
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">
                      Viral Load Samples collected during the month
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">
                      Viral Load Suppressed during the month
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* AN24 - Self-testing kits */}
                  <tr>
                    <td colSpan="2">
                      AN24. Pregnant women given self-testing kits for their
                      male partners:
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">Total</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
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
                        className="form-control form-control-sm compact-input"
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* AN25 - Male partners HIV test results */}
                  <tr>
                    <td colSpan="2">
                      AN25. Male partners received HIV test results in eMTCT:
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">NEG</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Table - AN26, AN27, AN28 */}
            <div className="col-md-6">
              <table className="data-entry-table compact-table">
                <thead>
                  <tr>
                    <th style={{ fontWeight: "normal" }}>Category</th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* AN26 - HIV+ Male partners ART */}
                  <tr>
                    <td colSpan="2">
                      AN26. HIV+ Male partners initiated on ART in the ANC
                      setting:
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">Known ART</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
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
                        className="form-control form-control-sm compact-input"
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
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* AN28 - Nutrition assessment */}
                  <tr>
                    <td colSpan="2">AN28. Women assessed for nutrition status</td>
                  </tr>
                  <tr>
                    <td className="ps-4">Total</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">Identified malnourished</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-5">MAM</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-5">SAM</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm compact-input"
                        value="0"
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Antenatal;
