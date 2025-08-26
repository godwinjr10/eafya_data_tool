import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import API from "../../helpers/api";
import MappingDialog from "./MappingDialog";

// Constants - moved to top for easy maintenance
const DATASET_DISPLAY_NAMES = {
  HMIS1052: "Maternal & Child Health",
  HMIS1051: "Outpatient Diagnosis",
  HMIS1055: "Laboratory Tests",
  HMIS1053: "HIV/AIDS Testing Services",
  HMIS1054: "Essential Medicines",
  HMIS108: "IPD Monthly Report",
};

const SECTION_DISPLAY_NAMES = {
  "1.3.1": "Epidemic Prone Diseases",
  "1.3.2": "Communicable Diseases",
  "1.3.3": "Neonatal Diseases",
  "1.3.4": "Non-Communicable Diseases",
  "1.3.5": "Oral Diseases",
  "1.3.6": "ENT Diseases",
  "1.3.7": "Eye Conditions",
  "1.3.8": "Mental Health",
  "1.3.9": "Neurological Disorders",
  "1.3.10": "Chronic Respiratory",
  "1.3.11": "Cancers",
  "1.3.12": "Palliative",
  "1.3.14": "Disability",
  "1.3.15": "Cardiovascular Diseases",
  "1.3.16": "Renal Diseases",
  "1.3.17": "Liver Diseases",
  "1.3.18": "Endocrine & Metabolic Disorders",
  "1.3.19": "Injuries",
  "1.3.20": "Minor Operations in OPD",
  "1.3.21": "Neglected Tropical Diseases",
  "1.3.22": "Maternal Conditions",
  "1.3.23": "Other OPD Conditions",
  "1.3.24": "Deaths in OPD",
  "1.3.25": "Emergency Medical Services",
  "1.3.26": "TB Screening",
  "1.3.28": "Nutrition Services",
  "1.3.29": "Gender Based Violence",
  // HMIS1054 (Essential Medicines) section mappings
  6.1: "Essential Medicines",
  6.2: "Outreach Activities",
  6.3: "Meetings",
  6.4: "Support Supervision",
  // HMIS1052 (Maternal & Child Health) section mappings
  2.1: "Antenatal",
  2.2: "Maternity",
  2.3: "Postnatal",
  2.4: "Family Planning",
  2.5: "Contraceptives",
  2.6: "Vitamin A",
  2.7: "Immunization",
  2.8: "Tetanus",
};

// Utility functions
const getDisplayNameForDataset = (datasetCode) => {
  return DATASET_DISPLAY_NAMES[datasetCode] || datasetCode;
};

const getDisplayNameForSection = (sectionId) => {
  return SECTION_DISPLAY_NAMES[sectionId] || sectionId;
};

const sortSectionsByName = (sections) => {
  return sections.sort((a, b) => {
    const nameA = getDisplayNameForSection(a);
    const nameB = getDisplayNameForSection(b);
    return nameA.localeCompare(nameB);
  });
};

// Main Mapping Component
const Mapping = () => {
  // State management
  const [datasetCodes, setDatasetCodes] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [datasetElements, setDatasetElements] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [hmisSearch, setHmisSearch] = useState("");
  const [currentMappings, setCurrentMappings] = useState({});
  const [eafyaItems, setEafyaItems] = useState([]);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    hmisCode: "",
    hmisName: "",
    dataelementId: null,
  });
  const [loading, setLoading] = useState(false);

  // API functions
  const fetchDatasetCodes = async () => {
    try {
      const response = await API.get("/mapping/datasets/codes");
      setDatasetCodes(response.data || []);
    } catch (error) {
      console.error("Error fetching dataset codes:", error);
      setDatasetCodes([]);
    }
  };

  const fetchDatasetElements = async (datasetCode) => {
    setLoading(true);
    try {
      const response = await API.get(
        `/mapping/datasets/${datasetCode}/elements`
      );
      setDatasetElements(response.data || []);
      console.error("fetching dataset elements:", response);
    } catch (error) {
      console.error("Error fetching dataset elements:", error);
      setDatasetElements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasetMappings = async (datasetCode) => {
    try {
      const response = await API.get(
        `/mapping/dataset/${datasetCode}/mappings`
      );
      setCurrentMappings(response.data || {});
    } catch (error) {
      console.error("Error fetching dataset mappings:", error);
      setCurrentMappings({});
    }
  };

  // Data processing functions
  const getUniqueSections = () => {
    const sections = [
      ...new Set(datasetElements.map((el) => el.section_id).filter(Boolean)),
    ];
    const sortedSections = sortSectionsByName(sections);

    return sortedSections.map((sectionId) => ({
      id: sectionId,
      name: getDisplayNameForSection(sectionId),
    }));
  };

  const getSectionData = () => {
    if (!selectedSection) return [];
    return datasetElements.filter((el) => el.section_id === selectedSection);
  };

  const getFilteredDataElements = () => {
    if (hmisSearch) {
      return datasetElements.filter(
        (element) =>
          element.dataelement_name
            .toLowerCase()
            .includes(hmisSearch.toLowerCase()) ||
          element.dataelement_code
            .toLowerCase()
            .includes(hmisSearch.toLowerCase())
      );
    }
    return getSectionData();
  };

  // Event handlers
  const handleDatasetChange = (newDataset) => {
    setSelectedDataset(newDataset);
    setSelectedSection("");
    setHmisSearch("");
  };

  const handleSectionChange = (newSection) => {
    setSelectedSection(newSection);
    setHmisSearch("");
  };

  const handleAddMapping = (
    dataelementCode,
    dataelementName,
    dataelementId
  ) => {
    setDialogState({
      isOpen: true,
      hmisCode: dataelementCode,
      hmisName: dataelementName,
      dataelementId: dataelementId,
    });
  };

  const handleSaveMapping = async (selectedItems) => {
    try {
      const selectedEafyaItems = selectedItems.map((itemId) => {
        const item = eafyaItems.find((eafyaItem) => eafyaItem.id === itemId);
        return {
          id: itemId,
          name: item ? item.name : `Item ${itemId}`,
        };
      });

      const mappingData = {
        hmis_dataelement_code: dialogState.hmisCode,
        hmis_dataelement_name: dialogState.hmisName,
        dataelement_id: dialogState.dataelementId,
        dataset_code: selectedDataset,
        section_id: selectedSection,
        mappings: selectedEafyaItems,
      };

      const response = await API.post("/mapping/mappings", mappingData);

      if (response.status === 200) {
        const newMappings = {
          ...currentMappings,
          [dialogState.hmisCode]: selectedEafyaItems,
        };

        setCurrentMappings(newMappings);
        console.log("Mappings saved successfully:", response.data);
      }
    } catch (error) {
      console.error("Error saving mappings:", error);
      alert("Error saving mappings. Please try again.");
    }
  };

  const handleRemoveMapping = async (dataelementCode, itemId) => {
    try {
      const response = await API.delete(
        `/mapping/mappings/${dataelementCode}/${itemId}`
      );

      if (response.status === 200) {
        const newMappings = {
          ...currentMappings,
          [dataelementCode]: (currentMappings[dataelementCode] || []).filter(
            (d) => d.id !== itemId
          ),
        };

        if (newMappings[dataelementCode].length === 0) {
          delete newMappings[dataelementCode];
        }

        setCurrentMappings(newMappings);
        console.log("Mapping deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting mapping:", error);
      alert("Error deleting mapping. Please try again.");
    }
  };

  const handleEafyaItemsLoaded = (items) => {
    setEafyaItems(items);
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      hmisCode: "",
      hmisName: "",
      dataelementId: null,
    });
  };

  // Effects
  useEffect(() => {
    fetchDatasetCodes();
  }, []);

  useEffect(() => {
    if (selectedDataset) {
      fetchDatasetElements(selectedDataset);
      fetchDatasetMappings(selectedDataset);
    } else {
      setDatasetElements([]);
      setSelectedSection("");
      setCurrentMappings({});
    }
  }, [selectedDataset]);

  // Render functions
  const renderPageTitle = () => (
    <h1 className="page-title">
      HMIS eAFYA Mapping
      {selectedDataset && (
        <span className="selected-dataset">
          {" "}
          - {getDisplayNameForDataset(selectedDataset)}
        </span>
      )}
      {selectedSection && (
        <span className="selected-section">
          {" "}
          - {getDisplayNameForSection(selectedSection)}
        </span>
      )}
    </h1>
  );

  const renderSectionSelectors = () => (
    <div className="section-selectors">
      <div className="select-group">
        <label>Dataset:</label>
        <select
          value={selectedDataset}
          onChange={(e) => handleDatasetChange(e.target.value)}
        >
          <option value="">Select Dataset</option>
          {datasetCodes.map((datasetCode) => (
            <option key={datasetCode} value={datasetCode}>
              {getDisplayNameForDataset(datasetCode)}
            </option>
          ))}
        </select>
      </div>

      {selectedDataset && (
        <div className="select-group">
          <label>Section:</label>
          <select
            value={selectedSection}
            onChange={(e) => handleSectionChange(e.target.value)}
          >
            <option value="">Select Section</option>
            {getUniqueSections().map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="select-group">
        <label>Search Data Elements:</label>
        <input
          type="text"
          placeholder="Search across all data elements..."
          value={hmisSearch}
          onChange={(e) => setHmisSearch(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );

  const renderMappingTable = () => {
    if (!selectedSection || loading) return null;

    const filteredElements = getFilteredDataElements();

    return (
      <div className="mapping-table">
        <table>
          <thead>
            <tr>
              <th>Data Element Code</th>
              <th>Data Element Name</th>
              <th>eAFYA Mappings</th>
            </tr>
          </thead>
          <tbody>
            {filteredElements.map((element) => (
              <tr key={element.id} className="hmis-row">
                <td>{element.dataelement_code}</td>
                <td>{element.dataelement_name}</td>
                <td>
                  <div className="item-mappings">
                    {(currentMappings[element.dataelement_code] || [])?.map(
                      (item) => (
                        <div key={item.id} className="item-tag">
                          <span>
                            {item.id} - {item.name}
                          </span>
                          <button
                            className="remove-btn"
                            onClick={() =>
                              handleRemoveMapping(
                                element.dataelement_code,
                                item.id
                              )
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )
                    )}
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        handleAddMapping(
                          element.dataelement_code,
                          element.dataelement_name,
                          element.dataelement_id
                        )
                      }
                    >
                      <FaPlus /> Add Mapping
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="report-sections">
      {renderPageTitle()}
      {renderSectionSelectors()}

      {loading && (
        <div className="loading-message">Loading dataset elements...</div>
      )}

      {renderMappingTable()}

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onSave={handleSaveMapping}
        hmisName={dialogState.hmisName}
        section={selectedDataset}
        eafyaItems={eafyaItems}
        onEafyaItemsLoaded={handleEafyaItemsLoaded}
        datasetCode={selectedDataset}
      />
    </div>
  );
};

export default Mapping;
