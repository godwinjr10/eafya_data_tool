import React, { useState } from 'react';

const Immunization = () => {
  const immunizationData = [
    { code: "CL01", label: "BCG" },
    { code: "CL02", label: "Hep B zero doze" },
    { code: "CL03", label: "Protection At Birth for Td (PAB)" },
    { code: "CL04", label: "Polio 0" },
    { code: "CL05", label: "Polio 1" },
    { code: "CL06", label: "Polio 2" },
    { code: "CL07", label: "Polio 3" },
    { code: "CL08", label: "IPV1" },
    { code: "CL09", label: "IPV2" },
    { code: "CL10", label: "DPT+Hep B+Hib 1" },
    { code: "CL11", label: "DPT+Hep B+Hib 2" },
    { code: "CL12", label: "DPT+Hep B+Hib 3" },
    { code: "CL13", label: "PCV 1" },
    { code: "CL14", label: "PCV 2" },
    { code: "CL15", label: "PCV 3" },
    { code: "CL16", label: "Rotavirus 1 Vaccine" },
    { code: "CL17", label: "Rotavirus 2 Vaccine" },
    { code: "CL18", label: "Rotavirus 3 Vaccine" },
    { code: "CL19", label: "Malaria 1" },
    { code: "CL20", label: "Malaria 2" },
    { code: "CL21", label: "Malaria 3" },
    { code: "CL22", label: "Yellow Fever" },
    { code: "CL23", label: "Measles (MR1)" }
  ];

  // State for form values
  const [formData, setFormData] = useState({});

  const handleInputChange = (code, ageGroup, type, value) => {
    setFormData(prev => ({
      ...prev,
      [`${code}_${ageGroup}_${type}`]: value
    }));
  };

  return (
    <div>
      <div className="section-header">
        2.6.3 CHILD IMMUNISATION
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>Doses</th>
            <th colSpan={2}>Under 1</th>
            <th colSpan={2}>1-4 Years</th>
          </tr>
          <tr>
            <th></th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
            <th className="text-center">Static</th>
            <th className="text-center">Outreach</th>
          </tr>
        </thead>
        <tbody>
          {immunizationData.map((vaccine) => (
            <tr key={vaccine.code}>
              <td>
                {vaccine.code}. {vaccine.label}
              </td>
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                  value={formData[`${vaccine.code}_under1_static`] || ''}
                  onChange={(e) => handleInputChange(vaccine.code, 'under1', 'static', e.target.value)}
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                  value={formData[`${vaccine.code}_under1_outreach`] || ''}
                  onChange={(e) => handleInputChange(vaccine.code, 'under1', 'outreach', e.target.value)}
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                  value={formData[`${vaccine.code}_1to4_static`] || ''}
                  onChange={(e) => handleInputChange(vaccine.code, '1to4', 'static', e.target.value)}
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                  value={formData[`${vaccine.code}_1to4_outreach`] || ''}
                  onChange={(e) => handleInputChange(vaccine.code, '1to4', 'outreach', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Immunization;