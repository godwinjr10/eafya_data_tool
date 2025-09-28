import React, { useState } from 'react';

const FamilyPlanningAvailability = () => {
  // State for form data
  const [contraceptiveData, setContraceptiveData] = useState({
    FP01: { name: 'Oral Contraceptives (Pills)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP02: { name: 'Injectable Contraceptives', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP03: { name: 'Condoms (Male)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP04: { name: 'Condoms (Female)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP05: { name: 'IUD (Copper T)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP06: { name: 'Implant (Jadelle)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP07: { name: 'Implant (Implanon)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP08: { name: 'Emergency Contraceptives', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP09: { name: 'Diaphragm', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP10: { name: 'Cervical Cap', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP11: { name: 'Spermicides', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    FP12: { name: 'Fertility Awareness Methods', opening: '', received: '', closing: '', closedVials: '', openVials: '' }
  });

  // Handle input change
  const handleInputChange = (code, field, value) => {
    setContraceptiveData(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        [field]: value
      }
    }));
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
    />
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
        2.4.7 CONTRACEPTIVES AVAILABILITY AND WASTAGE
      </div>

      <div className="table-container mb-4">
        <table className="data-entry-table compact-table full-width-table">
          <thead>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}>Contraceptive Method</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Opening Balance (A)</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Received (B)</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Closing Balance (C)</th>
              <th colSpan="2" className="text-center" style={{ fontWeight: "normal" }}>Units wasted</th>
            </tr>
            <tr className="table-header-bg">
              <th style={{ fontWeight: "normal" }}></th>
              <th style={{ fontWeight: "normal" }}></th>
              <th style={{ fontWeight: "normal" }}></th>
              <th style={{ fontWeight: "normal" }}></th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Units in Closed Packages (CP)</th>
              <th className="text-center" style={{ fontWeight: "normal" }}>Units in Open Packages (OP)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(contraceptiveData).map(([code, contraceptive]) => (
              <tr key={code}>
                <td>{code}. {contraceptive.name}</td>
                <td className="text-center">
                  <FormInput 
                    value={contraceptive.opening}
                    onChange={(e) => handleInputChange(code, 'opening', e.target.value)}
                  />
                </td>
                <td className="text-center">
                  <FormInput 
                    value={contraceptive.received}
                    onChange={(e) => handleInputChange(code, 'received', e.target.value)}
                  />
                </td>
                <td className="text-center">
                  <FormInput 
                    value={contraceptive.closing}
                    onChange={(e) => handleInputChange(code, 'closing', e.target.value)}
                  />
                </td>
                <td className="text-center">
                  <FormInput 
                    value={contraceptive.closedVials}
                    onChange={(e) => handleInputChange(code, 'closedVials', e.target.value)}
                  />
                </td>
                <td className="text-center">
                  <FormInput 
                    value={contraceptive.openVials}
                    onChange={(e) => handleInputChange(code, 'openVials', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FamilyPlanningAvailability;
