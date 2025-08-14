import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import DataEntryForm from "../../components/DataEntryForm";

const HMIS = () => {
  const [selectedSection, setSelectedSection] = useState("1.1");
  const [selectedDataSet, setSelectedDataSet] = useState("HMIS_105_01");

  const handleDataSetChange = (dataSetId) => {
    setSelectedDataSet(dataSetId);
    // Set section to 2.1 (Antenatal) when HMIS_105_02 is selected
    if (dataSetId === "HMIS_105_02") {
      setSelectedSection("2.1");
    } else {
      setSelectedSection("1.1");
    }
  };

  return (
    <div className="d-flex gap-2">
      <Sidebar
        selected={selectedSection}
        onSelect={setSelectedSection}
        dataSetId={selectedDataSet}
      />
      <div style={{ flex: 1 }}>
        <DataEntryForm
          section={selectedSection}
          dataSetId={selectedDataSet}
          onDataSetChange={handleDataSetChange}
        />
      </div>
    </div>
  );
};

export default HMIS;
