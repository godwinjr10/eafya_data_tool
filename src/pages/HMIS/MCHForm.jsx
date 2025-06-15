import React from 'react';

const ageGroups = [
  "Below 15 years",
  "15-19 years",
  "20-24 years",
  "25-49 years",
  "50+ years"
];

const antenatalCategories = [
  { code: "AN01", label: "ANC 1st Contact/Visit for women" },
  { code: "AN02", label: "ANC 4th Contact/Visit for women" },
  { code: "AN17", label: "No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit" },
  { code: "AN18", label: "No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit" },
  { code: "AN19", label: "No. of pregnant women who were tested for anaemia using Hb test at ANC after 36 weeks" },
  { code: "AN20", label: "No. of pregnant women with Anaemia (Hb <10g/dl) at ANC after 36 weeks" },
  { code: "AN21", label: "Pregnant Women receiving at least 30 tablets of Folic Acid and Iron Sulphate at ANC 1st contact / visit (Only Folic Acid recommended during 1st trimester)" },
  { code: "AN22", label: "Pregnant Women receiving at least 30 tablets of Folic Acid and Iron Sulphate at ANC after 36 weeks of gestation" },
  { code: "AN23", label: "Pregnant Women receiving LLINs at ANC 1st visit" },
  { code: "AN24", label: "No. of pregnant women who received obstetric ultra sound scan during any ANC visit in the reporting month" }
];

const maternityCategories = [
  { code: "MT01", label: "No. of deliveries in unit" },
  { code: "MT02", label: "No. of deliveries with skilled attendance" },
  { code: "MT03", label: "No. of deliveries with unskilled attendance" },
  { code: "MT04", label: "No. of mothers with Pre-Eclampsia/Eclampsia" },
  { code: "MT05", label: "No. of mothers with Obstructed Labour" },
  { code: "MT06", label: "No. of mothers with Ruptured Uterus" },
  { code: "MT07", label: "No. of mothers with Post-Partum Hemorrhage (PPH)" },
  { code: "MT08", label: "No. of mothers with Post-Partum Sepsis" },
  { code: "MT09", label: "No. of mothers referred out during labour" }
];

const childHealthCategories = [
  { code: "CH01", label: "No. of babies born alive" },
  { code: "CH02", label: "No. of babies born with low birth weight (<2.5kg)" },
  { code: "CH03", label: "No. of babies born with birth asphyxia" },
  { code: "CH04", label: "No. of babies born with birth defects" },
  { code: "CH05", label: "No. of babies initiated on KMC" },
  { code: "CH06", label: "No. of babies discharged alive on KMC" },
  { code: "CH07", label: "No. of babies who died while on KMC" },
  { code: "CH08", label: "No. of babies born to HIV positive mothers" },
  { code: "CH09", label: "No. of babies born to HIV positive mothers given ARVs within 72 hours" }
];

const familyPlanningMethods = [
  { code: "FP01", label: "Oral: Lo-Femenal" },
  { code: "FP02", label: "Oral: Microgynon" },
  { code: "FP11", label: "4 year implant (e.g. Sino plant)" },
  { code: "FP12", label: "5 year implant (e.g. Jadelle)" }
];

const contraceptivesDispensed = [
  { code: "CT01", label: "Oral: Lo-Femenal (cycles)" },
  { code: "CT02", label: "Oral: Microgynon (cycles)" },
  { code: "CT03", label: "Oral: Ovrette or other POP (cycles)" },
  { code: "CT04", label: "Oral: Levonogesteral(cycles)" },
  { code: "CT05", label: "Oral: Emergency contraceptives" },
  { code: "CT06", label: "Oral: Others (cycles)" },
  { code: "CT07", label: "Female condoms (pieces)" },
  { code: "CT08", label: "Male condoms (pieces)" },
  { code: "CT09", label: "Injectable 3 months IM (doses)" },
  { code: "CT10", label: "Injectable 3 months SC (doses)" },
  { code: "CT11", label: "Injectable 2 months (doses)" }
];

const hpvVaccinations = [
  { code: "VP01", label: "HPV1-Dose 1" },
  { code: "VP02", label: "HPV2-Dose 2" }
];

const tetanusVaccinations = [
  { code: "TD01", label: "Td1-Dose 1" },
  { code: "TD02", label: "Td2-Dose 2" },
  { code: "TD03", label: "Td3-Dose 3" },
  { code: "TD04", label: "Td4-Dose 4" },
  { code: "TD05", label: "Td5-Dose 5" }
];

const childImmunisations = [
  { code: "CL01", label: "BCG" },
  { code: "CL02", label: "Protection At Birth for TT(PAB)" }
];

const MCHForm = ({ section }) => {
  const renderAntenatalSection = () => (
    <>
      <div className="section-header">
        2.0 MATERNAL AND CHILD HEALTH SERVICES
      </div>

      <div className="section-subheader mb-3">
        2.1 ANTENATAL
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            {ageGroups.map((ag, i) => (
              <th key={i} className="text-center">{ag}</th>
            ))}
            <th>Total</th>
            <th>No. in 1st Trimester</th>
          </tr>
        </thead>
        <tbody>
          {antenatalCategories.map(category => (
            <tr key={category.code}>
              <td>{category.code}. {category.label}</td>
              {ageGroups.map((_, i) => (
                <td key={i} className="text-center">
                  <input 
                    type="number" 
                    min="0" 
                    className="form-control form-control-sm" 
                  />
                </td>
              ))}
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderUltrasoundSection = () => (
    <>
      <div className="section-header">
        2.1 ANTENATAL CONTINUED
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>NUMBER</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total U/S Scan done</td>
            <td>
              <input 
                type="number" 
                min="0" 
                className="form-control form-control-sm" 
              />
            </td>
          </tr>
          <tr>
            <td>No. done at 24weeks of gestation</td>
            <td>
              <input 
                type="number" 
                min="0" 
                className="form-control form-control-sm" 
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderMaternitySection = () => (
    <>
      <div className="section-header">
        2.2 MATERNITY
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            {ageGroups.map((ag, i) => (
              <th key={i} className="text-center">{ag}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {maternityCategories.map(category => (
            <tr key={category.code}>
              <td>{category.code}. {category.label}</td>
              {ageGroups.map((_, i) => (
                <td key={i} className="text-center">
                  <input 
                    type="number" 
                    min="0" 
                    className="form-control form-control-sm" 
                  />
                </td>
              ))}
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderChildHealthSection = () => (
    <>
      <div className="section-header">
        2.3 CHILD HEALTH
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Male</th>
            <th>Female</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {childHealthCategories.map(category => (
            <tr key={category.code}>
              <td>{category.code}. {category.label}</td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderFamilyPlanningSection = () => (
    <>
      <div className="section-header">
        2.6 FAMILY PLANNING METHODS
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th rowSpan="2">Category</th>
            <th colSpan="2" className="text-center">Below 15 years</th>
            <th colSpan="2" className="text-center">15-19 years</th>
            <th colSpan="2" className="text-center">20-24 years</th>
            <th colSpan="2" className="text-center">25-49 years</th>
            <th colSpan="2" className="text-center">50+ years</th>
          </tr>
          <tr>
            {Array(5).fill().map((_, i) => (
              <React.Fragment key={i}>
                <th className="text-center">NEW USERS</th>
                <th className="text-center">REVISITS</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {familyPlanningMethods.map(method => (
            <tr key={method.code}>
              <td>{method.code}. {method.label}</td>
              {Array(5).fill().map((_, i) => (
                <React.Fragment key={i}>
                  <td className="text-center">
                    <input 
                      type="number" 
                      min="0" 
                      className="form-control form-control-sm" 
                    />
                  </td>
                  <td className="text-center">
                    <input 
                      type="number" 
                      min="0" 
                      className="form-control form-control-sm" 
                    />
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderContraceptivesSection = () => (
    <>
      <div className="section-header">
        2.6.1 CONTRACEPTIVES DISPENSED
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Category</th>
            <th className="text-center">NO. DISP. AT UNIT</th>
            <th className="text-center">NO. DISP. IN OUTREACH</th>
            <th className="text-center">NO. DISP. BY CBDs</th>
            <th className="text-center">NO. DISP. BY PHARMACY/DRUG SHOPS</th>
          </tr>
        </thead>
        <tbody>
          {contraceptivesDispensed.map(item => (
            <tr key={item.code}>
              <td>{item.code}. {item.label}</td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
              <td className="text-center">
                <input 
                  type="number" 
                  min="0" 
                  className="form-control form-control-sm" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderChildHealthServicesSection = () => (
    <>
      <div className="section-header">
        2.7.1 HPV VACCINATION
      </div>
      <div className="mb-2 ps-3" style={{backgroundColor: '#e8f5e9', padding: '8px'}}>
        Vaccination of <strong>only 10 years old girls</strong>
      </div>
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th>Category</th>
            <th className="text-center">Facility (F)</th>
            <th className="text-center">School (S)</th>
            <th className="text-center">Community (C)</th>
          </tr>
        </thead>
        <tbody>
          {hpvVaccinations.map(vac => (
            <tr key={vac.code}>
              <td>{vac.code}. {vac.label}</td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="section-header">
        2.7.2 TETANUS VACCINATION (Td VACCINE)
      </div>
      <table className="data-entry-table mb-4">
        <thead>
          <tr>
            <th rowSpan="2">Doses</th>
            <th colSpan="2" className="text-center">Pregnant women</th>
            <th colSpan="2" className="text-center">Non-pregnant women</th>
            <th rowSpan="2" className="text-center">Immunization in School</th>
          </tr>
          <tr>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
          </tr>
        </thead>
        <tbody>
          {tetanusVaccinations.map(vac => (
            <tr key={vac.code}>
              <td>{vac.code}. {vac.label}</td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="section-header">
        2.7.3 CHILD IMMUNISATION
      </div>
      <table className="data-entry-table">
        <thead>
          <tr>
            <th rowSpan="2">Doses</th>
            <th colSpan="2" className="text-center">Under 1</th>
            <th colSpan="2" className="text-center">1-4 Years</th>
            <th colSpan="2" className="text-center">5 – 14 Years</th>
          </tr>
          <tr>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
          </tr>
        </thead>
        <tbody>
          {childImmunisations.map(imm => (
            <tr key={imm.code}>
              <td>{imm.code}. {imm.label}</td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
              <td className="text-center">
                <input type="number" min="0" className="form-control form-control-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="mch-container">
      {section === 0 && renderAntenatalSection()}
      {section === 1 && renderUltrasoundSection()}
      {section === 2 && renderMaternitySection()}
      {section === 3 && renderChildHealthSection()}
      {section === 4 && renderFamilyPlanningSection()}
      {section === 5 && renderContraceptivesSection()}
      {section === 6 && renderChildHealthServicesSection()}
    </div>
  );
};

export default MCHForm; 