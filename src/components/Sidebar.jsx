import React, { useState, useEffect } from "react";
import API from "../helpers/api";

const Sidebar = ({ selected, onSelect, dataSetId }) => {
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState({});

  const sections = dataSetId && datasets[dataSetId] ? datasets[dataSetId].sections : [];

  const fetchDatasets = async () => {
    try {
        setLoading(true);
        const response = await API.get('/datasets');
        // Transform the array into an object with dataSetId as keys
        const datasetsObj = response.data.datasets.reduce((acc, dataset) => {
            acc[dataset.dataset_id] = {
                id: dataset.dataset_id,
                name: dataset.dataset_name,
                sections: dataset.sections || []
            };
            return acc;
        }, {});
        setDatasets(datasetsObj);
    } catch (error) {
        console.error('Error fetching datasets:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  if (loading) {
    return <div style={{ width: 250, background: "#e6f2e6", padding: 10 }}>Loading...</div>;
  }

  return (
    <div style={{ width: 250, background: "#e6f2e6", padding: 10 }}>
      {sections.map((section, idx) => (
        <div
          key={section.section_id}
          onClick={() => onSelect(section.section_id)}
          style={{
            padding: "10px 15px",
            margin: "5px 0",
            background: selected === section.section_id ? "#b3d9b3" : "transparent",
            cursor: "pointer",
            borderRadius: 4,
            fontWeight: selected === section.section_id ? "bold" : "normal"
          }}
        >
          {section.section_name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;