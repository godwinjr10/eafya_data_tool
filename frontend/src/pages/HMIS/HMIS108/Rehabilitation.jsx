import React from "react";

const Rehabilitation = ({ section, selectedMonth, selectedYear }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="alert alert-info">
          <h6>Rehabilitation Services Data</h6>
          <p>
            This section will display rehabilitation services utilization data once the data has been integrated.
          </p>
          <p>
            <strong>Selected Period:</strong> {selectedMonth} {selectedYear}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rehabilitation;
