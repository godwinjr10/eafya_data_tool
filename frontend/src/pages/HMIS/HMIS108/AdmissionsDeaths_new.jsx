import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const AdmissionsDeaths = ({ section, selectedMonth, selectedYear }) => {
  const [admissionsData, setAdmissionsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmissionsData = useCallback(async () => {
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
        `/hmis108/admission-deaths?report_month=${reportMonth}`
      );
      setAdmissionsData(response.data);
    } catch (error) {
      console.error("Error fetching admission deaths data:", error);
      setAdmissionsData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchAdmissionsData();
    }
  }, [selectedMonth, selectedYear, fetchAdmissionsData]);

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
          width: 80% !important;
          text-align: left !important;
        }
        .compact-table th:not(:first-child),
        .compact-table td:not(:first-child) {
          width: 20% !important;
          text-align: center !important;
        }
        .compact-table th[colspan],
        .compact-table td[colspan] {
          width: auto !important;
        }
      `}</style>
      
      <div className="section-header mb-3">
        ADMISSIONS & DEATHS
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-md-6">
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
              <thead>
                <tr className="table-header-bg">
                  <th style={{ fontWeight: "normal" }}>Diagnosis</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Cases</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Deaths</th>
                </tr>
                <tr className="table-header-bg">
                  <th></th>
                  <th className="text-center" colSpan="2">0-4 years</th>
                  <th className="text-center" colSpan="2">5 years & above</th>
                  <th className="text-center" colSpan="2">0-4 years</th>
                  <th className="text-center" colSpan="2">5 years & above</th>
                </tr>
                <tr className="table-header-bg">
                  <th></th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                </tr>
              </thead>
              <tbody>
                {/* 6.1.1 Epidemic-Prone Diseases/Notifiable Diseases */}
                <tr className="section-title-bg">
                  <td colSpan="9"><strong>6.1.1 Epidemic-Prone Diseases/Notifiable Diseases</strong></td>
                </tr>
                <tr>
                  <td>EP01. Malaria</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td className="ps-4">EP01a. Total</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td className="ps-4">EP01b. Confirmed (Microscopic & RDT)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP02. Acute Flaccid Paralysis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP03. Animal Bites (suspected rabies)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP04. Cholera</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP05. Dysentery</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP06. Guinea Worm</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP07. Measles</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP08. Neonatal tetanus</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP09. Plague</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP10. Yellow Fever</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>EP18. Covid-19</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>

                {/* 6.1.2 Haemorrhagic Fevers */}
                <tr className="section-title-bg">
                  <td colSpan="9"><strong>6.1.2 Haemorrhagic Fevers</strong></td>
                </tr>
                <tr>
                  <td>HF01. Ebola</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF02. Marburg</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF03. Crimean-Congo Haemorrhagic Fever</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF04. Other Viral Haemorrhagic Fevers (Specify)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF05. Severe Acute Respiratory Infection (SARI)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF06. Adverse Events Following Immunization (AEFI)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td className="ps-4">Serious</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td className="ps-4">Non Serious</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF07. Typhoid Fever</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF08. Presumptive MDR TB Cases</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HF09. Other Emerging infectious Diseases, specify</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-6">
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
              <thead>
                <tr className="table-header-bg">
                  <th style={{ fontWeight: "normal" }}>Diagnosis</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Cases</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>Deaths</th>
                </tr>
                <tr className="table-header-bg">
                  <th></th>
                  <th className="text-center" colSpan="2">0-4 years</th>
                  <th className="text-center" colSpan="2">5 years & above</th>
                  <th className="text-center" colSpan="2">0-4 years</th>
                  <th className="text-center" colSpan="2">5 years & above</th>
                </tr>
                <tr className="table-header-bg">
                  <th></th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                  <th className="text-center">Male</th>
                  <th className="text-center">Female</th>
                </tr>
              </thead>
              <tbody>
                {/* 6.1.3 Liver Diseases */}
                <tr className="section-title-bg">
                  <td colSpan="9"><strong>6.1.3 Liver Diseases</strong></td>
                </tr>
                <tr>
                  <td>HP01. Liver cirrhosis related to HBV</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HP02. Liver cirrhosis related to HCV</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HP03. Acute Hepatitis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HP04. Fatty liver disease</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>HP05. Chronic Liver Disease</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>

                {/* 6.1.4 Meningitis */}
                <tr className="section-title-bg">
                  <td colSpan="9"><strong>6.1.4 Meningitis</strong></td>
                </tr>
                <tr>
                  <td>MG01. Bacterial Meningitis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>MG02. Viral Meningitis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>MG03. Cryptococcal Meningitis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>MG04. Other types of meningitis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>

                {/* 6.1.5 Neglected Tropical Diseases (NTD's) */}
                <tr className="section-title-bg">
                  <td colSpan="9"><strong>6.1.5 Neglected Tropical Diseases (NTD's)</strong></td>
                </tr>
                <tr>
                  <td>NT01. Leishmaniasis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT02. Lymphatic Filariasis (hydrocele)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT03. Lymphatic Filariasis (Lymphoedema)</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT04. Urinary Schistosomiasis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT05. Intestinal Schistosomiasis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT06. Onchocerciasis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT07. Nodding Syndrome</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>NT08. Skin NTDs and other skin diseases</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>

                {/* 6.1.6 Other Infectious /communicable diseases */}
                <tr className="section-title-bg">
                  <td colSpan="9"><strong>6.1.6 Other Infectious /communicable diseases</strong></td>
                </tr>
                <tr>
                  <td>CD01. Diarrhea -Acute</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>CD02. Diarrhea- Persistent</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>CD03. Genital Ulcers</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>CD04. Septicemia</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
                <tr>
                  <td>CD05. Peritonitis</td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                  <td className="text-center"><FormInput value="0" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsDeaths;
