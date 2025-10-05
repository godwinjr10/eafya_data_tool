import React, { useState } from "react";
import DataEntryForm from "../../components/DataEntryForm";

const HMIS = () => {
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDataSet, setSelectedDataSet] = useState("HMIS_105_01");

  const handleDataSetChange = (dataSetId) => {
    setSelectedDataSet(dataSetId);
    // Set section to 2.1 (Antenatal) when HMIS_105_02 is selected
    if (dataSetId === "HMIS_105_02") {
      setSelectedSection("2.1");
    } else if (dataSetId === "HMIS_108") {
      setSelectedSection("1");
    } else if (dataSetId === "HMIS_105_01") {
      setSelectedSection(""); // Show all sections for conditions
    } else {
      setSelectedSection("1.1");
    }
  };

  return (
    <DataEntryForm
      section={selectedSection}
      dataSetId={selectedDataSet}
      onDataSetChange={handleDataSetChange}
      onSectionChange={setSelectedSection}
    />
  );
};

export default HMIS;
