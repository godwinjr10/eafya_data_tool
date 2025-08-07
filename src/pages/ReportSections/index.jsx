import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { hmisData } from './hmisData';
import './styles.css';

const mainSections = [
  { id: 'conditions', name: 'Conditions' },
  { id: 'commodities', name: 'Essential Medicines' },
  { id: 'lab_tests', name: 'Lab Tests' }
];

// Get condition subsections from hmisData
const getConditionSubSections = () => {
  // Get all section keys from hmisData that have data
  const sectionKeys = Object.keys(hmisData).filter(key => hmisData[key]?.length > 0);
  
  // Create subsection objects with proper format
  return sectionKeys.map(key => ({
    id: key,
    // Convert key to display name (e.g., 'epidemic_prone' -> 'Epidemic Prone')
    name: key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }));
};

const subSections = {
  // Dynamically get conditions subsections
  conditions: getConditionSubSections(),
  // Keep other sections hardcoded
  commodities: [
    { id: 'commodities', name: 'Essential Medicines' }
  ],
  lab_tests: [
    { id: 'blood_tests', name: 'Blood Tests' },
    { id: 'imaging', name: 'Imaging' }
  ]
};

// No subsections needed as we're using the main sections directly

// All available eAFYA commodities/medicines for mapping
const eafyaCommodities = [
  { id: '8', name: 'Ready to use Therapeutic feeds (RUTF)' },
  { id: '10', name: 'Therapeutic Milk' },
  { id: '59', name: 'Chlorhexidine gel' },
  { id: '239', name: 'Measles vaccine, live attenuated' },
  { id: '272', name: 'Vitamin A (Retinol)' },
  { id: '339', name: 'Salbutamol inhaler' },
  { id: '510', name: 'Nevirapine (NVP)' },
  { id: '605', name: 'Amoxicillin tabs' },
  { id: '678', name: 'Amoxicillin caps' },
  { id: '685', name: 'Artemether + Lumefantrine(24\'s) (coartem)' },
  { id: '688', name: 'Metformin Glucophage' },
  { id: '716', name: 'Amlodipine' },
  { id: '725', name: 'Artemether+ Lumefantrine (6\'s) (coartem)' },
  { id: '726', name: 'Artesunate' },
  { id: '754', name: 'Captopril' },
  { id: '759', name: 'Ceftriaxone INJ' },
  { id: '805', name: 'Ethambutol (E) 100mg ADULT' },
  { id: '817', name: 'Ferrous sulphate+Folic acid' },
  { id: '822', name: 'Fluoxetine' },
  { id: '830', name: 'Glimepiride' },
  { id: '969', name: 'RHZE(ADULT)' },
  { id: '1018', name: 'Zidovudine/Lamivudine/Nevirapine (AZT/3TC/NVP)' },
  { id: '1104', name: 'HIV Determine I/II' },
  { id: '1140', name: 'Malaria Rapid Test Kits' },
  { id: '1162', name: 'Condoms' },
  { id: '1257', name: 'FACS Count % CD4 Reagent' },
  { id: '1288', name: 'Tenofovir + Lamivudine + Dolutegravir (TDF/3TC/DTG)' },
  { id: '2182', name: 'HIV-1/2 3.0 SD Bioline' },
  { id: '2189', name: 'HIV + Syphilis Duo Test Kit' },
  { id: '2243', name: 'Safe Delivery Kits (mama kits)' },
  { id: '2426', name: 'Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50' },
  { id: '2461', name: 'Refilled Gas Cylinder' },
  { id: '2491', name: 'Abacavir/Lamivudine/Lopinavir/Ritonavir (ABC/3TC/LPV/r)' },
  { id: '2625', name: 'Gene expert (TB)' },
  { id: '2803', name: 'OXYTOCIN(PITOCIN)' },
  { id: '2846', name: 'CHLORPROMAZINE(CPZ) tabs' }
];

// All available eAFYA diseases for mapping
const eafyaDiseases = [
  // Preterm newborn conditions
  { id: '22539', name: 'Preterm newborn unspecified' },
  { id: '22529', name: 'Preterm newborn' },
  { id: '22530', name: 'Preterm newborn gestational age 28 completed weeks' },
  { id: '22531', name: 'Preterm newborn gestational age 29 completed weeks' },
  { id: '22532', name: 'Preterm newborn gestational age 30 completed weeks' },
  { id: '22533', name: 'Preterm newborn gestational age 31 completed weeks' },
  { id: '22534', name: 'Preterm newborn gestational age 32 completed weeks' },
  { id: '22535', name: 'Preterm newborn gestational age 33 completed weeks' },
  { id: '22536', name: 'Preterm newborn gestational age 34 completed weeks' },
  { id: '22537', name: 'Preterm newborn gestational age 35 completed weeks' },
  { id: '22538', name: 'Preterm newborn gestational age 36 completed weeks' },
  // Congenital and respiratory conditions
  { id: '7415', name: 'Congenital malformation of optic disc' },
  { id: '7078', name: 'Congenital pneumonia due to streptococcus, group B' },
  { id: '7080', name: 'Congenital pneumonia due to Pseudomonas' },
  { id: '7102', name: 'Chronic respiratory disease originating in the perinatal period' },
  { id: '4413', name: 'Chronic respiratory failure' },
  { id: '4355', name: 'Chronic respiratory conditions due to chemicals, gases, fumes and vapours' },
  { id: '7106', name: 'Unspecified chronic respiratory disease originating in the perinatal period' },
  { id: '7105', name: 'Other chronic respiratory diseases originating in the perinatal period' },
  { id: '15519', name: 'Chronic respiratory acidosis' },
  { id: '19147', name: 'Chronic respiratory failure' },
  { id: '19148', name: 'Chronic respiratory failure Type I' },
  { id: '19149', name: 'Chronic respiratory failure Type II' },
  { id: '190', name: 'Other tetanus' },
  { id: '189', name: 'Obstetrical tetanus' },
  { id: '188', name: 'Tetanus neonatorum' },
  { id: '7137', name: 'Sepsis of newborn due to anaerobes' },
  { id: '7138', name: 'Other bacterial sepsis of newborn' },
  { id: '7139', name: 'Bacterial sepsis of newborn, unspecified' },
  { id: '7131', name: 'Bacterial sepsis of newborn' },
  { id: '7132', name: 'Sepsis of newborn due to streptococcus, group B' },
  { id: '7133', name: 'Sepsis of newborn due to other and unspecified streptococci' },
  { id: '7134', name: 'Sepsis of newborn due to Staphylococcus aureus' },
  { id: '7135', name: 'Sepsis of newborn due to other and unspecified staphylococci' },
  { id: '7136', name: 'Sepsis of newborn due to Escherichia coli' },
  { id: '7081', name: 'Congenital pneumonia due to other bacterial agents' },
  { id: '7077', name: 'Congenital pneumonia due to staphylococcus' },
  { id: '7076', name: 'Congenital pneumonia due to Chlamydia' },
  { id: '7075', name: 'Congenital pneumonia due to viral agent' },
  { id: '7074', name: 'Congenital pneumonia' },
  { id: '7082', name: 'Congenital pneumonia due to other organisms' },
  { id: '7078', name: 'Congenital pneumonia due to streptococcus, group B' },
  { id: '7079', name: 'Congenital pneumonia due to Escherichia coli' },
  { id: '7140', name: 'Other congenital infectious and parasitic diseases' },
  { id: '22649', name: 'Neonatal meningitis' },
  { id: '7206', name: 'Neonatal jaundice due to bleeding' },
  { id: '7219', name: 'Neonatal jaundice, unspecified' },
  { id: '7218', name: 'Neonatal jaundice from other specified causes' },
  { id: '7217', name: 'Neonatal jaundice from breast milk inhibitor' },
  { id: '7216', name: 'Neonatal jaundice from other and unspecified hepatocellular damage' },
  { id: '7214', name: 'Neonatal jaundice associated with preterm delivery' },
  { id: '7213', name: 'Neonatal jaundice from other and unspecified causes' },
  { id: '7212', name: 'Neonatal jaundice due to excessive haemolysis, unspecified' },
  { id: '7211', name: 'Neonatal jaundice due to other specified excessive haemolysis' },
  { id: '7210', name: 'Neonatal jaundice due to swallowed maternal blood' },
  { id: '7209', name: 'Neonatal jaundice due to drugs or toxins transmitted from mother or given to newborn' },
  { id: '7208', name: 'Neonatal jaundice due to polycythaemia' },
  { id: '7207', name: 'Neonatal jaundice due to infection' },
  { id: '7205', name: 'Neonatal jaundice due to bruising' },
  { id: '7204', name: 'Neonatal jaundice due to other excessive haemolysis' },
  { id: '7222', name: 'Other neonatal jaundice' },
  { id: '7083', name: 'Congenital pneumonia, unspecified' },
  { id: '7099', name: 'Congenital pneumonia due to Pseudomonas' },
  { id: '710', name: 'Plasmodium falciparum malaria' },
  { id: '713', name: 'Plasmodium falciparum malaria, unspecified' },
  { id: '714', name: 'Plasmodium vivax malaria' },
  { id: '718', name: 'Plasmodium malariae malaria' },
  { id: '722', name: 'Other parasitologically confirmed malaria' },
  { id: '726', name: 'Unspecified malaria' },
  { id: '3182', name: 'Flaccid paraplegia' },
  { id: '3185', name: 'Flaccid tetraplegia' },
  { id: '6130', name: 'Flaccid neuropathic bladder, not elsewhere classified' },
  { id: '394', name: 'Rabies, unspecified' },
  { id: '391', name: 'Rabies' },
  { id: '392', name: 'Sylvatic rabies' }
];

const MappingDialog = ({ isOpen, onClose, onSave, hmisName, section }) => {
  // Determine which array to use based on section
  const itemsArray = section === 'commodities' ? eafyaCommodities : eafyaDiseases;
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDiseases([]);
      setSearchTerm('');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const filteredItems = itemsArray.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="mapping-dialog-overlay">
      <div className="mapping-dialog">
        <h3>Map Diseases to {hmisName}</h3>
        <div className="dialog-search">
          <input
            type="text"
            placeholder="Search diseases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="disease-list">
          {filteredItems.map(item => (
            <label key={item.id} className="disease-item">
              <input
                type="checkbox"
                checked={selectedDiseases.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDiseases([...selectedDiseases, item.id]);
                  } else {
                    setSelectedDiseases(selectedDiseases.filter(id => id !== item.id));
                  }
                }}
              />
              <span>{item.id} - {item.name}</span>
            </label>
          ))}
          {filteredItems.length === 0 && (
            <div className="no-results">No matching items found</div>
          )}
        </div>
        <div className="dialog-actions">
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
          <button 
            className="primary-btn" 
            onClick={() => {
              onSave(selectedDiseases);
              onClose();
            }}
          >
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportSections = () => {
  const [selectedMainSection, setSelectedMainSection] = useState('');
  const [selectedSubSection, setSelectedSubSection] = useState('');
  const [hmisSearch, setHmisSearch] = useState('');
  const [currentMappings, setCurrentMappings] = useState({});
  const [dialogState, setDialogState] = useState({ 
    isOpen: false, 
    hmisCode: '', 
    hmisName: '' 
  });

  // Get data for selected subsection
  const subsectionData = selectedSubSection ? hmisData[selectedSubSection] || [] : [];
  
  // Filter based on search term
  const filteredHmisData = hmisSearch
    ? subsectionData.filter(hmis =>
        hmis.hmis_name.toLowerCase().includes(hmisSearch.toLowerCase()) ||
        hmis.hmis_code.toLowerCase().includes(hmisSearch.toLowerCase())
      )
    : subsectionData;

  const handleAddMapping = (hmisCode, hmisName) => {
    setDialogState({
      isOpen: true,
      hmisCode,
      hmisName
    });
  };

  // Load existing mappings from localStorage when component mounts
  useEffect(() => {
    const savedMappings = localStorage.getItem('hmisEafyaMappings');
    if (savedMappings) {
      try {
        setCurrentMappings(JSON.parse(savedMappings));
      } catch (error) {
        console.error('Error loading mappings from localStorage:', error);
        setCurrentMappings({});
      }
    }
  }, []);

  const handleSaveMapping = (selectedDiseases) => {
    const mappingsToCreate = selectedDiseases.map(diseaseId => {
      const disease = eafyaDiseases.find(d => d.id === diseaseId);
      return {
        id: disease.id,
        name: disease.name
      };
    });

    // Update local state
    const newMappings = {
      ...currentMappings,
      [dialogState.hmisCode]: mappingsToCreate
    };
    
    setCurrentMappings(newMappings);
    // Save to localStorage
    localStorage.setItem('hmisEafyaMappings', JSON.stringify(newMappings));
  };

  const handleRemoveMapping = (hmisCode, diseaseId) => {
    const newMappings = {
      ...currentMappings,
      [hmisCode]: (currentMappings[hmisCode] || []).filter(d => d.id !== diseaseId)
    };

    // If no mappings left for this HMIS code, remove the key
    if (newMappings[hmisCode].length === 0) {
      delete newMappings[hmisCode];
    }

    setCurrentMappings(newMappings);
    // Save to localStorage
    localStorage.setItem('hmisEafyaMappings', JSON.stringify(newMappings));
  };


  return (
    <div className="report-sections">
      <h1 className="page-title">HMIS eAFYA Mapping</h1>
      <div className="section-selectors">
        <div className="select-group">
          <label>Main Section:</label>
          <select 
            value={selectedMainSection} 
            onChange={(e) => {
              setSelectedMainSection(e.target.value);
              setSelectedSubSection('');
              setHmisSearch('');
            }}
          >
            <option value="">Select Main Section</option>
            {mainSections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        {selectedMainSection && (
          <div className="select-group">
            <label>Sub Section:</label>
            <select
              value={selectedSubSection}
              onChange={(e) => {
                setSelectedSubSection(e.target.value);
                setHmisSearch('');
              }}
            >
              <option value="">Select Sub Section</option>
              {subSections[selectedMainSection]?.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="select-group">
          <label>Search HMIS:</label>
          <input
            type="text"
            placeholder="Search by HMIS code or name..."
            value={hmisSearch}
            onChange={(e) => setHmisSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {selectedSubSection && (
        <div className="mapping-table">
          <table>
            <thead>
              <tr>
                <th>HMIS Code</th>
                <th>HMIS Name</th>
                <th>eAFYA Disease Mappings</th>
              </tr>
            </thead>
            <tbody>
              {filteredHmisData.map(hmis => (
                <tr key={hmis.hmis_code} className="hmis-row">
                  <td>{hmis.hmis_code}</td>
                  <td>{hmis.hmis_name}</td>
                  <td>
                    <div className="disease-mappings">
                      {(currentMappings[hmis.hmis_code] || hmis.mappings)?.map(disease => (
                        <div key={disease.id} className="disease-tag">
                          <span>{disease.id} - {disease.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemoveMapping(hmis.hmis_code, disease.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button 
                        className="add-mapping-btn"
                        onClick={() => handleAddMapping(hmis.hmis_code, hmis.hmis_name)}
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
      )}

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, hmisCode: '', hmisName: '' })}
        onSave={handleSaveMapping}
        hmisName={dialogState.hmisName}
        section={selectedMainSection}
      />
    </div>
  );
};

export default ReportSections;