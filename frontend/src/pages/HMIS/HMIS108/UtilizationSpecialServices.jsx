import React from "react";

const UtilizationSpecialServices = ({
  section,
  selectedMonth,
  selectedYear,
}) => {
  return (
    <div className="card mb-4">
   
      <div className="card-body">
        <div className="alert alert-info">
          <h6>Special Services Data</h6>
          <p>
            This section will display utilization data for special services such
            as blood transfusion, dialysis, etc once the data has been integrated.
          </p>
          <p>
            <strong>Selected Period:</strong> {selectedMonth} {selectedYear}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UtilizationSpecialServices;
