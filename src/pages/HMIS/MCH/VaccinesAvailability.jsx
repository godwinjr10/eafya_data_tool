import React, { useState } from 'react';

const VaccinesAvailability = () => {
  // State for form data
  const [vaccineData, setVaccineData] = useState({
    WT01: { name: 'BCG', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT02: { name: 'Hep B zero doze', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT03: { name: 'Polio (OPV)', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT04: { name: 'IPV', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT05: { name: 'DPT+Hep B+Hib', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT06: { name: 'PCV', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT07: { name: 'Rotavirus', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT08: { name: 'Measles', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT09: { name: 'Yellow Fever', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT10: { name: 'Td', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT11: { name: 'HPV', opening: '', received: '', closing: '', closedVials: '', openVials: '' },
    WT12: { name: 'Malaria', opening: '', received: '', closing: '', closedVials: '', openVials: '' }
  });

  // Handle input change
  const handleInputChange = (code, field, value) => {
    setVaccineData(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        [field]: value
      }
    }));
  };

  return (
    <div>
      <div className="section-header">
        2.6.4 VACCINE AVAILABILITY AND WASTAGE
      </div>

      <div className="mt-4">
        <table className="data-entry-table">
          <thead>
            <tr>
              <th>Antigen</th>
              <th className="text-center">Opening Balance (A)</th>
              <th className="text-center">Received (B)</th>
              <th className="text-center">Closing Balance (C)</th>
              <th colSpan="2" className="text-center">Doses wasted</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th className="text-center">Doses in Closed Vials (CV)</th>
              <th className="text-center">Doses in Open Vials (OV)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(vaccineData).map(([code, vaccine]) => (
              <tr key={code}>
                <td>{code}. {vaccine.name}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={vaccine.opening}
                    onChange={(e) => handleInputChange(code, 'opening', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={vaccine.received}
                    onChange={(e) => handleInputChange(code, 'received', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={vaccine.closing}
                    onChange={(e) => handleInputChange(code, 'closing', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={vaccine.closedVials}
                    onChange={(e) => handleInputChange(code, 'closedVials', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={vaccine.openVials}
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

export default VaccinesAvailability;