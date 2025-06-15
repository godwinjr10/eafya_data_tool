import React from 'react';

// Lab test categories and data constants
const hematologyTests = [
  { code: "HE01", label: "Hb (Non automated)" },
  { code: "HE02", label: "CBC" },
  { code: "HE03", label: "Film Comment" },
  { code: "HE04", label: "ESR" },
  { code: "HE05", label: "Bleeding/Clotting Time" },
  { code: "HE06", label: "Sickling Test" },
  { code: "HE07", label: "Blood Group" }
];

const serologyTests = [
  { code: "SR01", label: "VDRL/ RPR" },
  { code: "SR02", label: "TPHA" },
  { code: "SR03", label: "Shigella Dysentery" },
  { code: "SR04", label: "Salmonella Typhi" },
  { code: "SR05", label: "Brucella" },
  { code: "SR06", label: "H. pylori" }
];

const clinicalChemistryTests = [
  { code: "CC01", label: "Blood Sugar (RBS)" },
  { code: "CC02", label: "Blood Sugar (FBS)" },
  { code: "CC03", label: "LFTs" },
  { code: "CC04", label: "RFTs" },
  { code: "CC05", label: "Lipid Profile" },
  { code: "CC06", label: "Electrolytes" }
];

const parasitologyTests = [
  { code: "PA01", label: "BS for MPS" },
  { code: "PA02", label: "Stool Analysis" },
  { code: "PA03", label: "Urine Analysis" },
  { code: "PA04", label: "Skin Snip" },
  { code: "PA05", label: "CSF Analysis" }
];

const virologyTests = [
  { code: "VS01", label: "EID" },
  { code: "VS02", label: "Viral Load for HIV" },
  { code: "VS03", label: "CD4" },
  { code: "VS04", label: "Sickle Cell Disease Confirmation" },
  { code: "VS05", label: "Histology" },
  { code: "VS06", label: "Polio/or Acute Flaccid Paralysis" },
  { code: "VS07", label: "Severe Acute Respiratory Syndrome/Infection (SARS/SARI)" },
  { code: "VS08", label: "TB Genexpert" }
];

const LabTestForm = ({ section }) => {
  const renderClientVisitsSection = () => (
    <>
      <div className="section-header">
        10.1 CLIENT VISITS AND SPECIMEN COLLECTION
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Out Patient</th>
            <th>In Patient</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10.1.1. Total Number of laboratory client visits</td>
            <td>
              <input type="number" min="0" className="form-control form-control-sm" />
            </td>
            <td>
              <input type="number" min="0" className="form-control form-control-sm" />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="section-subheader mt-4">
        10.1.2. Number of Specimen Collected at Facility and Received from other facilities
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Blood</th>
            <th>Stool/Rectal swab</th>
            <th>Urine</th>
            <th>Sputum</th>
            <th>CSF</th>
            <th>Biopsy</th>
            <th>Pus Swab</th>
            <th>Genital Swab</th>
            <th>Skin Snip</th>
            <th>Others</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SC01. Collected(IN)</td>
            {Array(10).fill().map((_, i) => (
              <td key={i}>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            ))}
          </tr>
          <tr>
            <td>SC02. Received(OUT)</td>
            {Array(10).fill().map((_, i) => (
              <td key={i}>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderHematologySection = () => (
    <>
      <div className="section-header">
        10.2 LABORATORY ROUTINE TESTS
      </div>

      <div className="section-subheader">
        10.2.1 HEMATOLOGY (BLOOD)
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Lab Tests</th>
            <th>Number Done</th>
            <th>Number Positive</th>
          </tr>
        </thead>
        <tbody>
          {hematologyTests.map(test => (
            <tr key={test.code}>
              <td>{test.code}. {test.label}</td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderSerologySection = () => (
    <>
      <div className="section-header">
        10.2.2 SEROLOGY
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Lab Tests</th>
            <th>Number Done</th>
            <th>Number Positive</th>
          </tr>
        </thead>
        <tbody>
          {serologyTests.map(test => (
            <tr key={test.code}>
              <td>{test.code}. {test.label}</td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderClinicalChemistrySection = () => (
    <>
      <div className="section-header">
        10.2.3 CLINICAL CHEMISTRY
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Lab Tests</th>
            <th>Number Done</th>
            <th>Number Positive</th>
          </tr>
        </thead>
        <tbody>
          {clinicalChemistryTests.map(test => (
            <tr key={test.code}>
              <td>{test.code}. {test.label}</td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderParasitologySection = () => (
    <>
      <div className="section-header">
        10.2.4 PARASITOLOGY
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Lab Tests</th>
            <th>Number Done</th>
            <th>Number Positive</th>
          </tr>
        </thead>
        <tbody>
          {parasitologyTests.map(test => (
            <tr key={test.code}>
              <td>{test.code}. {test.label}</td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderReferralTestingSection = () => (
    <>
      <div className="section-header">
        10.5 REFERRAL TESTING
      </div>

      <div className="section-subheader">
        10.5.1. Volume of Sample Referred
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Type of Test</th>
            <th>No. of Specimen Referred</th>
            <th>Average Turn Around Time (Days)</th>
            <th>No. of Pending Results/Feedback</th>
          </tr>
        </thead>
        <tbody>
          <tr className="category-header">
            <td colSpan="4">Virology</td>
          </tr>
          {virologyTests.map(test => (
            <tr key={test.code}>
              <td>{test.code} {test.label}</td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td>
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="lab-test-container">
      {section === 0 && renderClientVisitsSection()}
      {section === 1 && renderHematologySection()}
      {section === 2 && renderSerologySection()}
      {section === 3 && renderClinicalChemistrySection()}
      {section === 4 && renderParasitologySection()}
      {section === 5 && renderReferralTestingSection()}
    </div>
  );
};

export default LabTestForm; 