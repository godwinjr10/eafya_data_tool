import React from 'react';

const essentialMedicines = [
  { code: "SS01", name: "Artemether/Lumefantrine 120/20 mg", unit: "Tablet" },
  { code: "SS02", name: "Depot medroxy progesterone acetate (DMPA)", unit: "Injectable" },
  { code: "SS03", name: "Amoxicillin 250 mg capsule", unit: "Capsule" },
  { code: "SS04", name: "Sulfadoxine/ Pyrimethamine tablet", unit: "Tablet" },
  { code: "SS05", name: "ORS Sachets with zinc tablet", unit: "Packet" },
  { code: "SS06", name: "Measles Vaccine", unit: "Vial" },
  { code: "SS07", name: "Determine HIV 1 & 2 screening test", unit: "Tests" },
  { code: "SS08", name: "Stat-pack HIV Confirmatory rapid tests, tests", unit: "Tests" }
];

const MedicinesForm = ({ section }) => {
  const renderStockStatusSection = () => (
    <>
      <div className="section-header">
        6 ESSENTIAL MEDICINES AND HEALTH SUPPLIES
      </div>

      <div className="section-subheader mb-3">
        6.1 STOCK STATUS (Out of stock means that there was NONE left in your health unit STORE)
      </div>

      <div className="mb-3">
        <strong>Note:</strong> The primary data sources for this sub-section are the Stock books and Stock Cards
      </div>

      <table className="data-entry-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>NAME OF DRUG ITEM</th>
            <th>UNIT</th>
            <th>Quantity Consumed (units)</th>
            <th>Days out of stock</th>
            <th>Stock on hand</th>
            <th>Quantity Expired</th>
          </tr>
        </thead>
        <tbody>
          {essentialMedicines.map(medicine => (
            <tr key={medicine.code}>
              <td>{medicine.code}</td>
              <td>{medicine.name}</td>
              <td>{medicine.unit}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
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

  return (
    <div className="">
      {renderStockStatusSection()}
    </div>
  );
};

export default MedicinesForm; 