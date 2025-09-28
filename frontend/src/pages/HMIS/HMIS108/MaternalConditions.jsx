import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const MaternalConditions = ({ section, selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(false);

  const fetchMaternalData = useCallback(async () => {
    try {
      setLoading(true);
      const monthIndex =
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const reportMonth = `${selectedYear}${formattedMonth}`;

      const response = await API.get(
        `/hmis108/maternal-conditions?report_month=${reportMonth}`
      );
      // Data is fetched but not used in the current static layout
      console.log("Maternal conditions data:", response.data);
    } catch (error) {
      console.error("Error fetching maternal conditions data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMaternalData();
    }
  }, [selectedMonth, selectedYear, fetchMaternalData]);

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

  if (loading) {
    return <Spinner />;
  }

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
          padding-left: 0.4rem !important;
        }
        .compact-table .ps-5 {
          padding-left: 0.6rem !important;
        }
        .compact-table {
          font-size: 0.7rem !important;
          width: 100% !important;
          table-layout: fixed !important;
          min-width: 100% !important;
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
          background-color: #f8f9fa !important;
          color: black !important;
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
          width: 50% !important;
          text-align: left !important;
          padding-left: 0.5rem !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: 5% !important;
          text-align: center !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
        .diagnosis-col {
          width: 50% !important;
          min-width: 300px !important;
        }
        .data-col {
          width: 5% !important;
          min-width: 60px !important;
        }
        .compact-table td:not(.diagnosis-col):not(.ps-4):not(.ps-5):not([colspan]) {
          width: 5% !important;
          min-width: 60px !important;
        }
        .compact-table td:first-child:not([colspan]) {
          width: 50% !important;
          min-width: 300px !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        MATERNAL & GYNAECOLOGICAL CONDITIONS
      </div>

      <div className="table-container mb-4">
        <table className="data-entry-table compact-table full-width-table" style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr className="table-header-bg">
              <th rowSpan="2" className="diagnosis-col" style={{ fontWeight: "normal" }}>Category</th>
              <th colSpan="5" className="text-center" style={{ fontWeight: "normal" }}>Cases</th>
              <th colSpan="5" className="text-center" style={{ fontWeight: "normal" }}>Deaths</th>
            </tr>
            <tr className="table-header-bg">
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>Below 15 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>15-19 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>20-24 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>25-49 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>50+ Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>Below 15 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>15-19 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>20-24 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>25-49 Years</th>
              <th className="text-center data-col" style={{ fontWeight: "normal" }}>50+ Years</th>
            </tr>
          </thead>
          <tbody>
            {/* 6.2.16 Maternal conditions */}
            <tr className="section-title-bg">
              <td colSpan="11"><strong>6.2.16 Maternal conditions</strong></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC01. Abortions due to Gender Based Violence (GBV)</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC02. Abortions due to other causes</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC03. Malaria in pregnancy</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC04. High blood pressure in pregnancy</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC05. Obstructed labour</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC06. Haemorrhage related to pregnancy (APH or PPH)</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC07. Sepsis related to pregnancy e.g. puerperal sepsis, abortion sepsis etc</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC08. Obstetric Fistula</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC09. Number of women diagnosed with fistula and treated by catheter</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC10. Number of fistulas closed and dry at discharge</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC11. Number of Women repaired for Fistula who receive a modern contraceptive Method</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">MC12. Other Complications of pregnancy</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>

            {/* 6.2.17 Gynaecological conditions */}
            <tr className="section-title-bg">
              <td colSpan="11"><strong>6.2.17 Gynaecological conditions</strong></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC01. Cancer of the cervix (newly diagnosed cases)</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC02. Cancer of the cervix (re-attendance)</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC03. Cancer of the breast</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC04. Tubal Ovarian mass/cancer</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC05. Pelvic Inflammatory Disease (PID)</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC06. Uterine Fibroids</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
            <tr>
              <td className="diagnosis-col">GC07. Other Gynaecological conditions</td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
              <td className="text-center data-col"><FormInput value="0" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaternalConditions;
