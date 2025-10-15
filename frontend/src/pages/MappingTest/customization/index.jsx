import React, { useState } from 'react'
import CustomizationSets from './CustomizationSets'
import CustomizationSetDetails from './CustomizationSetDetails'

const Customization = () => {
  const [selectedCustomizationSet, setSelectedCustomizationSet] = useState(null);

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0">
              <h5 className="card-title mb-0 fw-semibold">
                <i className="fas fa-database me-2 text-primary"></i>
                Customization Set IDs
              </h5>
              <p className="text-muted small mb-0 mt-1">
                Select a Customization set to map its eafya ID to Data Tool ID
              </p>
            </div>
            <div className="card-body p-2" style={{ maxHeight: "600px", overflowY: "auto" }}>
              <CustomizationSets
                onItemSelect={setSelectedCustomizationSet}
                selectedItem={selectedCustomizationSet?.name}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-0 fw-semibold">
                  {selectedCustomizationSet ? `${selectedCustomizationSet.name}` : "Select a Customization Set"}
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  {selectedCustomizationSet
                    ? `Manage details for ${selectedCustomizationSet.name}`
                    : "Choose a Customization Set from the left to view and manage its details"
                  }
                </p>
              </div>
              {selectedCustomizationSet && (
                <button
                  className="btn btn-primary btn-sm"
                // onClick={() => openAdd()}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Mapping
                </button>
              )}
            </div>
            <div className="card-body p-0">
              {selectedCustomizationSet ? (
                <CustomizationSetDetails
                  name={selectedCustomizationSet.name}
                  category={selectedCustomizationSet.category}
                />
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-database fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No Customization Set Selected</h5>
                  <p className="text-muted">Please select a Customization Set from the left panel to start the mapping process.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customization