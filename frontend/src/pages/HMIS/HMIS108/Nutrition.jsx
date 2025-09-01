import React from "react";

const Nutrition = ({ section, selectedMonth, selectedYear }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="alert alert-info">
          <h6>Nutrition Services Data</h6>
          <p>
            This section will display nutrition assessment and treatment data once the data has been integrated.
          </p>
          <p>
            <strong>Selected Period:</strong> {selectedMonth} {selectedYear}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
