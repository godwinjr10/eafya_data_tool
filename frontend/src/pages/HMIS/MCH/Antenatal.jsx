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

  // Fetch data from API
  const fetchAntenatalData = async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthNumber = getMonthNumber(selectedMonth);
      const reportMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      // Fetch data from all antenatal endpoints
      const [
        anc1Response,
        anc4Response,
        anc8Response,
        ancTotalResponse,
        antenatal6Response,
        antenatal8Response,
        antenatal9Response,
        antenatal10Response,
      ] = await Promise.all([
        API.get(`/antenatal/anc_1?report_month=${reportMonth}`),
        API.get(`/antenatal/anc_4?report_month=${reportMonth}`),
        API.get(`/antenatal/anc_8?report_month=${reportMonth}`),
        API.get(`/antenatal/anc_total?report_month=${reportMonth}`),
        API.get(`/antenatal/antenatal_6?report_month=${reportMonth}`),
        API.get(`/antenatal/antenatal_8?report_month=${reportMonth}`),
        API.get(`/antenatal/antenatal_9?report_month=${reportMonth}`),
        API.get(`/antenatal/antenatal_10?report_month=${reportMonth}`),
      ]);

      // Set the data
      setFirstData(anc1Response.data || []);
      setFourthData(anc4Response.data || []);
      setEighthData(anc8Response.data || []);
      setTotalData(ancTotalResponse.data || []);
      setIptData(antenatal6Response.data || []);
      setTabletsData(antenatal10Response.data || []);

      // Set anaemia data from antenatal_8 and antenatal_9
      const anaemiaData = [];
      if (antenatal8Response.data && antenatal8Response.data.length > 0) {
        anaemiaData.push({
          hmis_code: "AN08",
          hmis_name:
            "No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit",
          Below_15yrs: antenatal8Response.data[0]["Below 15 Years"] || 0,
          "15_19yrs": antenatal8Response.data[0]["15 - 19 Years"] || 0,
          "20_24yrs": antenatal8Response.data[0]["20 - 24 Years"] || 0,
          "25_49yrs": antenatal8Response.data[0]["25 - 49 Years"] || 0,
          "50+yrs": antenatal8Response.data[0]["50+ Years"] || 0,
        });
      }
      if (antenatal9Response.data && antenatal9Response.data.length > 0) {
        anaemiaData.push({
          hmis_code: "AN09",
          hmis_name:
            "No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit",
          Below_15yrs: antenatal9Response.data[0]["Below 15 Years"] || 0,
          "15_19yrs": antenatal9Response.data[0]["15 - 19 Years"] || 0,
          "20_24yrs": antenatal9Response.data[0]["20 - 24 Years"] || 0,
          "25_49yrs": antenatal9Response.data[0]["25 - 49 Years"] || 0,
          "50+yrs": antenatal9Response.data[0]["50+ Years"] || 0,
        });
      }
      setAnaemiaData(anaemiaData);

      // For views that don't have direct API endpoints yet, keep empty arrays
      setBloodGroupingData([]);
      setLlinsData({});
      setUltrasoundData([]);
      setDewormingData({});
      setSyphilisData({});
      setHepatitisData({});
      setHivData([]);
      setHivAssessmentData([]);
      setHivStatusData([]);
      setHivRetestData([]);
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
      setLlinsData({});
      setUltrasoundData([]);
      setDewormingData({});
      setSyphilisData({});
      setHepatitisData({});
      setHivData([]);
      setHivAssessmentData([]);
      setHivStatusData([]);
      setHivRetestData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when month/year changes
  useEffect(() => {
    fetchAntenatalData();
  }, [selectedMonth, selectedYear]);

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

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading antenatal data...</span>
      </div>
    );
  }

  return (
    <div>
      <>
        <div className="section-header">
          2.0 MATERNAL AND CHILD HEALTH SERVICES
        </div>

        <div className="section-subheader mb-3">2.1 ANTENATAL</div>

        <table className="data-entry-table">
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
            {/* AN01 - ANC 1st contacts */}
            {firstData.map((item, idx) => (
              <tr key={`AN01-${idx}`}>
                <td>{item.hmis_code}. ANC 1st contacts/visits for women</td>
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
                    value={computeTotal(item, [
                      "Below_15yrs",
                      "15_19yrs",
                      "20_24yrs",
                      "25_50yrs",
                      "50+yrs",
                    ])}
                    readOnly
                  />
                </td>
              </tr>
            ))}

            {/* AN02 - ANC 4th contacts */}
            {fourthData.map((item) => (
              <tr key={`${item.hmis_code}`}>
                <td>{item.hmis_code}. ANC 4th contacts/visits for women</td>
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
                    value={computeTotal(item, [
                      "Below_15yrs",
                      "15_19yrs",
                      "20_24yrs",
                      "25_50yrs",
                      "50+yrs",
                    ])}
                    readOnly
                  />
                </td>
              </tr>
            ))}

            {/* AN03 - ANC 8th contacts */}
            {eighthData.map((item) => (
              <tr key={`${item.hmis_code}`}>
                <td>{item.hmis_code}. ANC 8th contacts/visits for women</td>
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
                    value={computeTotal(item, [
                      "Below_15yrs",
                      "15_19yrs",
                      "20_24yrs",
                      "25_50yrs",
                      "50+yrs",
                    ])}
                    readOnly
                  />
                </td>
              </tr>
            ))}

            {/* AN04 - Total ANC contacts */}
            {totalData.map((item) => (
              <tr key={`${item.hmis_code}`}>
                <td>{item.hmis_code}. Total ANC contacts/visits</td>
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
                    value={computeTotal(item, [
                      "Below_15yrs",
                      "15_19yrs",
                      "20_24yrs",
                      "25_50yrs",
                      "50+yrs",
                    ])}
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
            {iptData.map((item) => (
              <tr key={`${item.hmis_code}-${item.ipt_dose_group}`}>
                <td className="ps-4">{item.ipt_dose_group}</td>
                {[
                  "below_15",
                  "age_15_19",
                  "age_20_24",
                  "age_25_49",
                  "age_50_plus",
                ].map((ageGroup) => (
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
                    value={computeTotal(item, [
                      "below_15",
                      "age_15_19",
                      "age_20_24",
                      "age_25_49",
                      "age_50_plus",
                    ])}
                    readOnly
                  />
                </td>
              </tr>
            ))}

            {/* AN07 Blood Grouping */}
            <tr>
              <td colSpan="6">
                AN07. No. of pregnant women who were tested for blood grouping
              </td>
            </tr>
            {bloodGroupingData.length > 0 ? (
              bloodGroupingData.map((item, idx) => (
                <tr key={`AN07-${idx}`}>
                  <td className="ps-4">{`Blood Group (${item.group}) ${item.rhesus}`}</td>
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
                      className="form-control form-control-sm"
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
                <tr>
                  <td className="ps-4">Blood Group (O) Rhesus O+</td>
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
                      className="form-control form-control-sm"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Blood Group (O) Rhesus O-</td>
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
                      className="form-control form-control-sm"
                      value="0"
                      readOnly
                      style={{ backgroundColor: "white" }} // White background for total cells
                    />
                  </td>
                </tr>
              </>
            )}

            {/* Anaemia Data */}
            {anaemiaData.length > 0 ? (
              anaemiaData.map((item) => (
                <tr key={`${item.hmis_code}`}>
                  <td>
                    {item.hmis_code}. {item.hmis_name}
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
                      value={computeTotal(item, [
                        "Below_15yrs",
                        "15_19yrs",
                        "20_24yrs",
                        "25_49yrs",
                        "50+yrs",
                      ])}
                      readOnly
                    />
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td>
                    AN08. No. of pregnant women who were tested for Anaemia
                    using Hb Test at ANC 1st Contact / visit
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
                  <td>
                    AN09. No. of pregnant women with Anaemia (Hb &lt;10g/dl) at
                    ANC 1st Contact / visit
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
              </>
            )}
          </tbody>
        </table>

        {/* ANTENATAL (Continued) Section */}
        <div className="mt-4">
          <div className="section-subheader mb-3">ANTENATAL (Continued)</div>

          <table className="data-entry-table">
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
              {tabletsData.map((item) => (
                <tr key={`${item.hmis_code}-${item.supplement_category}`}>
                  <td className="ps-4">{item.supplement_category}</td>
                  {[
                    "below_15",
                    "age_15_19",
                    "age_20_24",
                    "age_25_49",
                    "age_50_plus",
                  ].map((ageGroup) => (
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
                      value={computeTotal(item, [
                        "below_15",
                        "age_15_19",
                        "age_20_24",
                        "age_25_49",
                        "age_50_plus",
                      ])}
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                    />
                  </td>
                </tr>
              ))}

              {/* AN11 - LLINs */}
              {llinsData && Object.keys(llinsData).length > 0 ? (
                <tr>
                  <td>
                    {llinsData.hmis_code}. {llinsData.hmis_name}
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
                      value={computeTotal(llinsData, [
                        "Below_15yrs",
                        "15_19yrs",
                        "20_24yrs",
                        "25_49yrs",
                        "50+yrs",
                      ])}
                      readOnly
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                    />
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>AN11. Pregnant Women receiving LLINs at ANC 1st visit</td>
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
                      style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                    />
                  </td>
                </tr>
              )}

              {/* AN12 - Ultrasound */}
              <tr>
                <td colSpan="6">
                  AN12. No. of pregnant women who received obstetric-ultra sound
                  scan during any ANC visit in the reporting month
                </td>
              </tr>
              {ultrasoundData.length > 0 ? (
                ultrasoundData.map((item) => (
                  <tr key={`${item.hmis_code}`}>
                    <td className="ps-4">{item.hmis_name}</td>
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
                        value={computeTotal(item, [
                          "Below_15yrs",
                          "15_19yrs",
                          "20_24yrs",
                          "25_49yrs",
                          "50+yrs",
                        ])}
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="ps-4">Total U/S Scan done</td>
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
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-4">
                      No. done before 24 weeks of gestation
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
                        style={{ backgroundColor: "#f8f9fa" }} // Grey background for total cells
                      />
                    </td>
                  </tr>
                </>
              )}
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
                        className="form-control form-control-sm"
                        value={
                          dewormingData && dewormingData.value
                            ? dewormingData.value
                            : "0"
                        }
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
                        className="form-control form-control-sm"
                        value={
                          syphilisData && syphilisData.first_time
                            ? syphilisData.first_time
                            : "0"
                        }
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
                        value={
                          syphilisData && syphilisData.newly_tested_positive
                            ? syphilisData.newly_tested_positive
                            : "0"
                        }
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
                        value={
                          syphilisData && syphilisData.started_treatment
                            ? syphilisData.started_treatment
                            : "0"
                        }
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
                        value={
                          hepatitisData && hepatitisData.total_tested
                            ? hepatitisData.total_tested
                            : "0"
                        }
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
                        value={
                          hepatitisData && hepatitisData.tested_positive
                            ? hepatitisData.tested_positive
                            : "0"
                        }
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
                  "25_49yrs",
                  "50+yrs",
                ].map((ageGroup) => (
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
                  "25_49yrs",
                  "50+yrs",
                ].map((ageGroup) => (
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
                    className="form-control form-control-sm"
                    value="0"
                    readOnly
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
                  "25_49yrs",
                  "50+yrs",
                ].map((ageGroup) => (
                  <td key={ageGroup} className="text-center">
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm"
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
                    className="form-control form-control-sm"
                    value="0"
                    readOnly
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
                  "25_49yrs",
                  "50+yrs",
                ].map((ageGroup) => (
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
                <td colSpan="6">
                  AN22. Pregnant women who re-tested later in pregnancy
                </td>
              </tr>
              <tr>
                <td className="ps-4">NEG</td>
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
          <div className="section-subheader mb-3">ANTENATAL (Continued)</div>

          {/* Top Block - Single Column Sections */}
          <div className="row">
            {/* Left Table - AN23, AN24, AN25, AN26, AN27 */}
            <div className="col-md-6">
              <table className="data-entry-table">
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                    <th style={{ fontWeight: "normal" }}>Category</th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      Total
                    </th>
                    <th
                      colSpan="2"
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      Identified malnourished
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      MAM
                    </th>
                    <th
                      className="text-center"
                      style={{ fontWeight: "normal" }}
                    >
                      SAM
                    </th>
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
                <tr>
                  <td colSpan="6">AN29. TB Screening for ANC Clients:</td>
                </tr>
                <tr>
                  <td className="ps-4">Screened for TB</td>
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
                      className="form-control form-control-sm"
                      value="0"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Presumed to have TB</td>
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
                      className="form-control form-control-sm"
                      value="0"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">Diagnosed with TB</td>
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
                <tr>
                  <td>
                    AN30. HIV+ pregnant women given ARV prophylaxis for the un
                    born infants for the 1st time in ANC
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
                        className="form-control form-control-sm"
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
                <tr>
                  <td colSpan="6">
                    AN31. Male partners with a known status at their first visit
                    as a couple in ANC:
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">NEG</td>
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
                      className="form-control form-control-sm"
                      value="0"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="ps-4">POS</td>
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
  );
};

export default Antenatal;
