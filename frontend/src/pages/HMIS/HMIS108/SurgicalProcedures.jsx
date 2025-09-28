import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const SurgicalProcedures = ({ section, selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(false);

  const fetchSurgicalData = useCallback(async () => {
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
        `/hmis108/surgical-procedures?report_month=${reportMonth}`
      );
      // Data is fetched but not used in the current static layout
      console.log("Surgical procedures data:", response.data);
    } catch (error) {
      console.error("Error fetching surgical procedures data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchSurgicalData();
    }
  }, [selectedMonth, selectedYear, fetchSurgicalData]);

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
        SURGICAL PROCEDURES
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-md-6">
          <div className="table-container mb-4">
            <table className="data-entry-table compact-table full-width-table">
              <thead>
                <tr className="table-header-bg">
                  <th style={{ fontWeight: "normal" }}>Category</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>NUMBERS</th>
                </tr>
              </thead>
              <tbody>
                {/* SURGICAL PROCEDURES */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>SURGICAL PROCEDURES</strong></td>
                </tr>

                {/* 3.1 Obstetrics */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.1 Obstetrics</strong></td>
                </tr>
                <tr>
                  <td>SP01. Caesarean sections</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>SP02. Obstetric fistula repair (RVF, VVF, RVVF)</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>SP03. Evacuations (incomplete abortion)</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>SP04. Other Obstetric Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.2 Gynaecology */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.2 Gynaecology</strong></td>
                </tr>
                <tr>
                  <td>GN01. Laparotomy for ovarian surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>GN02. Abdominal hysterectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>GN03. Vaginal hysterectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>GN04. Myomectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>GN05. Laparotomy for ectopic pregnancy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>GN06. Other gynaecological surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.3 Plastic Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.3 Plastic Surgery</strong></td>
                </tr>
                <tr>
                  <td>PR01. Skin grafting</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PR02. Release of contractures (burns)</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PR03. Cleft lip and palate surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PR04. Other plastic surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.4 Cardiothoracic Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.4 Cardiothoracic Surgery</strong></td>
                </tr>
                <tr>
                  <td>CS01. Thoracotomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CS02. Coronary artery bypass graft</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CS03. Heart valve surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CS04. Atrio/ventricular septal defect surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CS05. Other cardiothoracic surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.5 Vascular Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.5 Vascular Surgery</strong></td>
                </tr>
                <tr>
                  <td>VS01. Varicose vein - ligation & stripping</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>VS02. Repair of abdominal aortic aneurysm</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>VS03. Other vascular surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.6 Paediatric Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.6 Paediatric Surgery</strong></td>
                </tr>
                <tr>
                  <td>PS01. Laparotomy for intussusception</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PS02. Neonatal laparotomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PS03. Neonatal colostomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PS04. Pull through</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PS05. Ramstedt's pyloromyotomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PS06. Gastroschisis repair</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>PS07. Other paediatric surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.7 Ocular Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.7 Ocular Surgery</strong></td>
                </tr>
                <tr>
                  <td>OC01. Cataract Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OC02. Glaucoma Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OC03. Orbital Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OC04. Ophthalmic laser Interventions</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OC05. Surgery for penetrating eye injury</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OC06. Trachoma Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OC07. Other ocular surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.8 Trauma & Orthopaedic Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.8 Trauma & Orthopaedic Surgery</strong></td>
                </tr>
                <tr>
                  <td>OR01. Internal fixation</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OR02. External fixation</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OR03. Arthroplasty</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OR04. Amputation</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OR05. Spinal surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OR06. Arthroscopy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OR07. Other trauma & orthopaedic surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.9 Endocrine Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.9 Endocrine Surgery</strong></td>
                </tr>
                <tr>
                  <td>ES01. Thyroidectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>ES02. Adrenalectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>ES03. Other endocrine surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
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
                  <th style={{ fontWeight: "normal" }}>Category</th>
                  <th className="text-center" style={{ fontWeight: "normal" }}>NUMBERS</th>
              </tr>
            </thead>
            <tbody>
                {/* 3.10 Neuro surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.10 Neuro surgery</strong></td>
                </tr>
                <tr>
                  <td>NS01. Brain surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>NS02. Burr hole</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>NS03. Craniotomy/craniectomy for trauma</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>NS04. ETV/CPC (Endoscopic 3rd Ventriculostomy/ cauterisation) choroid plexus</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>NS05. Spina-bifida surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>NS06. VP shunt</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>NS07. Other neurosurgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.11 ENT Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.11 ENT Surgery</strong></td>
                </tr>
                <tr>
                  <td>TS01. Tracheostomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>TS02. Adenotonsillectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>TS03. Nasal surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>TS04. Laryngological surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>TS05. Otological surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>TS06. ENT endoscopic surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>TS07. Other ENT surgeries</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.12 Breast Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.12 Breast Surgery</strong></td>
                </tr>
                <tr>
                  <td>BS01. Mastectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>BS02. Other breast surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.13 Urology */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.13 Urology</strong></td>
                </tr>
                <tr>
                  <td>UR01. Prostatectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR02. Renal surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR03. Urethral surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR04. Testicular Surgery (Orchidopexy, ochidectomy, BSO)</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR05. Urine diversion (SPC, Nephrostomy)</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR06. Kidney transplant</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR07. Hydrocelectomy(LF)</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UR08. Other urological surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.14 Upper GI Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.14 Upper GI Surgery</strong></td>
                </tr>
                <tr>
                  <td>UG01. Gastric Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UG02. Ileostomy surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UG03. Laparoscopic Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>UG04. Other upper GI surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.15 Hepatobilliary Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.15 Hepatobilliary Surgery</strong></td>
                </tr>
                <tr>
                  <td>HS01. Cholecystectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>HS02. Liver surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>HS03. Pancreatic surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>HS04. Splenic surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>HS05. Bilio-intestinal diversion</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>HS06. Other hepatobiliary surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.16 Colorectal Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.16 Colorectal Surgery</strong></td>
                </tr>
                <tr>
                  <td>CR01. Colectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CR02. Rectal Cancer Surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CR03. Colostomy surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CR04. Appendicectomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>CR05. Other colorectal surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.17 Hernia Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.17 Hernia Surgery</strong></td>
                </tr>
                <tr>
                  <td>HE01. Hernia Repair</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.18 Oral & Maxillofacial Surgery */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.18 Oral & Maxillofacial Surgery</strong></td>
                </tr>
                <tr>
                  <td>OM01. Mandible surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OM02. Salivary gland surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OM03. Neck dissection</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OM04. Internal fixation for facial trauma</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OM05. Dental surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OM06. Other oral & maxillofacial surgery</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>

                {/* 3.19 Other surgical procedures */}
                <tr className="section-title-bg">
                  <td colSpan="2"><strong>3.19 Other surgical procedures</strong></td>
                </tr>
                <tr>
                  <td>OT01. Debridement</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OT02. Incision and drainage of abscesses</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OT03. Circumcision</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OT04. Other laparotomy</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
                <tr>
                  <td>OT05. Other surgical procedures not listed</td>
                  <td className="text-center">
                    <FormInput value="0" />
                  </td>
                </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgicalProcedures;
