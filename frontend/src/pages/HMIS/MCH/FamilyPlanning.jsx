import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const FamilyPlanning = ({ selectedMonth, getMonthNumber, selectedYear }) => {
  const [loading, setLoading] = useState(false);
  const [visitsData, setVisitsData] = useState([]);
  const [contraceptivesData, setContraceptivesData] = useState([]);
  const [theatreData, setTheatreData] = useState([]);

  // Map backend data to frontend display format
  const mapVisitsData = (data) => {
    return data.map((item, index) => ({
      hmis_code: item.hmis_code || `FP${String(index + 1).padStart(2, '0')}`,
      family_planning_method: item.family_planning_method,
      under_15_new: item.under_15_new || "0",
      under_15_revisit: item.under_15_revisit || "0",
      "15_19_new": item["15_19_new"] || "0",
      "15_19_revisit": item["15_19_revisit"] || "0",
      "20_24_new": item["20_24_new"] || "0",
      "20_24_revisit": item["20_24_revisit"] || "0",
      "25_49_new": item["25_49_new"] || "0",
      "25_49_revisit": item["25_49_revisit"] || "0",
      "50_plus_new": item["50_plus_new"] || "0",
      "50_plus_revisit": item["50_plus_revisit"] || "0"
    }));
  };

  const mapContraceptivesData = (data) => {
    return data.map((item, index) => ({
      hmis_code: item.category,
      family_planning_method: item.family_planning_name || item.family_planning_method,
      unit_dispensed: item.total_dispensed || "0",
      outreach_dispensed: "0",
      cbds_dispensed: "0",
      pharmacies_dispensed: "0"
    }));
  };

  const mapTheatreData = (data) => {
    return data.map(item => ({
      hmis_code: item.major_theater_name,
      major_theatre_name: item.major_theatre_name,
      "25_49_total": item["25_49_female_tubal"] || "0",
      "50plus_total": item["50plus_female_tubal"] || "0"
    }));
  };

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthNumber = getMonthNumber(selectedMonth);
      const reportMonth = `${selectedYear}${monthNumber
        .toString()
        .padStart(2, "0")}`;

      // Fetch data from all family planning endpoints
      const [visitsResponse, contraceptivesResponse, theatreResponse] =
        await Promise.all([
          API.get(`/familyplanning/visits?report_month=${reportMonth}`),
          API.get(
            `/familyplanning/contraceptives?report_month=${reportMonth}`
          ),
          API.get(`/familyplanning/theatre?report_month=${reportMonth}`),
        ]);

      // Update visits data with mapping
      const mappedVisits = mapVisitsData(visitsResponse.data || []);
      const mappedContraceptives = mapContraceptivesData(contraceptivesResponse.data || []);
      const mappedTheatre = mapTheatreData(theatreResponse.data || []);

      setVisitsData(mappedVisits);
      setContraceptivesData(mappedContraceptives);
      setTheatreData(mappedTheatre);
    } catch (error) {
      console.error("Error fetching family planning data:", error);
      setVisitsData([]);
      setContraceptivesData([]);
      setTheatreData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, getMonthNumber]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData();
    }
  }, [selectedMonth, selectedYear, fetchData]);


  const getValueForCell = (item, field) => {
    return item[field] || "0";
  };

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
          width: 100% !important;
          table-layout: fixed !important;
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
          width: 100% !important;
          table-layout: fixed !important;
        }
        .table-header-bg {
          background-color: #f8f9fa !important;
        }
        .section-title-bg {
          background-color: #6c757d !important;
          color: white !important;
          font-weight: bold !important;
        }
        .full-width-table {
          width: 100% !important;
          min-width: 100% !important;
        }
        .table-container {
          width: 100% !important;
          overflow-x: auto !important;
        }
        .compact-table th:first-child,
        .compact-table td:first-child {
          width: 25% !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: auto !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        2.4 FAMILY PLANNING METHODS
      </div>


      {loading ? (
        <Spinner />
      ) : (
        <div>
          {/* 2.4.1 Family Planning Client Visits */}
          <div className="section-subheader mb-2">2.4.1 Family Planning Client Visits</div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Method</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>Below 15 Yrs</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>15-19 Yrs</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>20-24 Yrs</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>25-49 Yrs</th>
                <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>50+ Yrs</th>
              </tr>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}></th>
                <th className="text-center" style={{ fontWeight: "normal" }}>New users</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Revisits</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>New users</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Revisits</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>New users</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Revisits</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>New users</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Revisits</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>New users</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Revisits</th>
              </tr>
            </thead>
            <tbody>
              {console.log("Rendering visits data:", visitsData)}
              {visitsData.map((row, index) => (
                <tr key={index}>
                  <td>{row.hmis_code}. {row.family_planning_method}</td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "under_15_new")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "under_15_revisit")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "15_19_new")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "15_19_revisit")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "20_24_new")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "20_24_revisit")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "25_49_new")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "25_49_revisit")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "50_plus_new")} />
                    </td>
                    <td className="text-center">
                      <FormInput value={getValueForCell(row, "50_plus_revisit")} />
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* 2.4.2 Contraceptives Dispensed */}
          <div className="section-subheader mb-2">2.4.2 Contraceptives Dispensed</div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Method</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>No. Disp. at Unit</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>No. Disp. in Outreach</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>No. Disp. by CBDs</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>No. Disp. by Pharmacies/ Drug Shops</th>
              </tr>
            </thead>
            <tbody>
              {console.log("Rendering contraceptives data:", contraceptivesData)}
              {contraceptivesData.map((row, index) => (
                <tr key={index}>
                  <td>{row.hmis_code}. {row.family_planning_method}</td>
                  <td className="text-center">
                    <FormInput value={getValueForCell(row, "unit_dispensed")} />
                  </td>
                  <td className="text-center">
                    <FormInput value={getValueForCell(row, "outreach_dispensed")} />
                  </td>
                  <td className="text-center">
                    <FormInput value={getValueForCell(row, "cbds_dispensed")} />
                  </td>
                  <td className="text-center">
                    <FormInput value={getValueForCell(row, "pharmacies_dispensed")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* 2.4.3 Minor Operations in Family Planning */}
          <div className="section-subheader mb-2">2.4.3 Minor Operations in Family Planning</div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Permanent Methods</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>25-49 Yrs</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>50+ Yrs</th>
              </tr>
            </thead>
            <tbody>
              {console.log("Rendering theatre data:", theatreData)}
              {theatreData.map((row, index) => (
                <tr key={index}>
                  <td>{row.hmis_code}. {row.major_theatre_name}</td>
                  <td className="text-center">
                    <FormInput value={getValueForCell(row, "25_49_total")} />
                  </td>
                  <td className="text-center">
                    <FormInput value={getValueForCell(row, "50plus_total")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* 2.4.4 Postpartum Family Planning */}
          <div className="section-subheader mb-2">2.4.4 Postpartum Family Planning</div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Mothers receiving Family Planning</th>
                <th colSpan="4" className="text-center" style={{ fontWeight: "normal" }}>TIMING</th>
              </tr>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}></th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Within 48 hours</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>3 days to 3 weeks</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>4 wks to 6 weeks</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>7 weeks to 5 months</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="4">PPFP01. No. of Mothers who received Family Planning in Postpartum period</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">Below 15 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">15-19 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">20-24 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">25-49 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
            </tbody>
          </table>
          </div>

          {/* 2.4.5 Post Abortion Family Planning */}
          <div className="section-subheader mb-2">2.4.5 Post Abortion Family Planning</div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Mothers receiving Family Planning</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Within 48 hours</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>3 days to 1 week</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="4">PAFP01. No. of women who received Post Abortion Family Planning</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">Below 15 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">15-19 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">20-24 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td className="ps-4">25-49 Years</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
            </tbody>
          </table>
          </div>

          {/* 2.4.6 Removal of Long-Acting Reversible Contraceptive (LARC) */}
          <div className="section-subheader mb-2">2.4.6 Removal of Long-Acting Reversible Contraceptive (LARC)</div>
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
            <thead>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}>Method</th>
                <th style={{ fontWeight: "normal" }}>Reason for Removal</th>
                <th colSpan="7" className="text-center" style={{ fontWeight: "normal" }}>Removal Timing</th>
              </tr>
              <tr className="table-header-bg">
                <th style={{ fontWeight: "normal" }}></th>
                <th style={{ fontWeight: "normal" }}></th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Below 3 months (1)</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>3 months to 5 months (2)</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>6 months to 12 months (3)</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>13 months to 18 month (4)</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>19 months to 35 months (5)</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>At 36 months (6)</th>
                <th className="text-center" style={{ fontWeight: "normal" }}>Above 36 months. (7)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="5">LR01. LARCs Removal due to</td>
                <td>1. On-schedule</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td>2. Side Effects</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td>3. Change in Fertility Intention</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td>4. GBV</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
              </tr>
              <tr>
                <td>5. Others</td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
                </td>
                <td className="text-center">
                  <FormInput value="0" />
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

export default FamilyPlanning;
