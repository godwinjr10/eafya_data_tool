import { LampDesk } from "lucide-react";
<<<<<<< HEAD
import React from "react";

const SectionPanel = ({
  currentSections,
  labTestSections,
  commoditySections,
  selectedSection,
  handleSectionClick,
  renderPaginationControls,
  panelHeaderStyle,
  columnHeaderStyle,
  loading,
}) => {
  const renderSectionItem = (section) => (
    <div
      key={section.id}
=======
import React, { useState } from "react";

const SectionPanel = ({
  conditions,
  labTestSections,
  commoditySections,
  handleSectionClick,
  loading
}) => {
  const [selectedSections, setSelectedSections] = useState({
    section: "Select The Section ...",
    data: [],
  });
  const [activeSubSection, setActiveSubSection] = useState("");
  const renderSectionItem = (section, index) => (
    <div
      key={index}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
      style={{
        padding: "8px 12px",
        fontSize: "11px",
        cursor: "pointer",
        position: "relative",
      }}
      className={`${
<<<<<<< HEAD
        selectedSection?.id === section.id ? "text-primary" : "text-secondary"
      }`}
      onClick={() => handleSectionClick(section.id, section.name)}
    >
      <div>
        <div className="d-flex align-items-center gap-1">
        <div className="   text-xs p-1 " style={{fontSize: '8px'}}>({section.id}) </div>{section.name}
=======
        activeSubSection === section.name ? "text-primary" : "text-secondary"
      }`}
      onClick={() => {
        handleSectionClick(section.id, section.name);
        setActiveSubSection(section.name);
      }}
    >
      <div>
        <div className="d-flex align-items-center gap-1">
          <div className="   text-xs p-1 " style={{ fontSize: "8px" }}>
            ({section.id}){" "}
          </div>
          {section.name}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
        </div>
      </div>
    </div>
  );

<<<<<<< HEAD
  return (
    <div
      style={{
        width: "320px",
        backgroundColor: "white",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={panelHeaderStyle}>Sections ({currentSections.length})</div>
      {renderPaginationControls()}
=======
  

  return (
    <div
      style={{
        borderRight: "1px solid #ddd",
      }}
      className="col"
    >
      <div class="dropdown">
        <div
          class="p-4 border-bottom w-100 dropdown-toggle d-flex align-items-center justify-content-between fw-bold outline-0 capitalize "
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={() => {
            setSelectedSections({ section: "SelectThe Section ...", data: [] });
          }}
        >
          <div>
            {" "}
            {selectedSections.section}
            <small className="text-xs text-secondary fw-thin">
              -({selectedSections.data.length})
            </small>
          </div>
        </div>

        <ul class="dropdown-menu w-100 border-0 px-4 bg-transparent">
          <li className="p-0 m-0">
            <a
              class="dropdown-item w-100 border-bottom "
              href="#"
              onClick={() =>
                setSelectedSections({
                  section: "Conditons",
                  data: conditions,
                })
              }
            >
              Conditions
            </a>
          </li>
          <li className="p-0 m-0">
            <a
              class="dropdown-item w-100 border-bottom"
              href="#"
              onClick={() =>
                setSelectedSections({
                  section: "Commodities",
                  data: commoditySections,
                })
              }
            >
              Commodities
            </a>
          </li>
          <li className="p-0 m-0">
            <a
              class="dropdown-item w-100 border-bottom"
              href="#"
              onClick={() =>
                setSelectedSections({
                  section: "   Lab Tests",
                  data: labTestSections,
                })
              }
            >
              Lab Tests
            </a>
          </li>
        </ul>
      </div>
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
<<<<<<< HEAD
        <div style={columnHeaderStyle}>Name</div>
=======
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
        {loading ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Loading sections...
          </div>
<<<<<<< HEAD
        ) : currentSections.length === 0 ? (
=======
        ) : conditions?.length === 0 ? (
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            No sections found
          </div>
        ) : (
          <div>
<<<<<<< HEAD
            <div class="dropdown">
              <div
                class="p-2 border-bottom w-100 dropdown-toggle d-flex align-items-center justify-content-between outline-0 capitalize"
                href="#"
                role="link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
             
                Conditions
              </div>

              <ul class="dropdown-menu w-100 border-0  bg-white">
                {currentSections.map((section) => (
                  <li className="p-0 m-0">
                    <a class="dropdown-item w-100 p-0 m-0" href="#">
                      {renderSectionItem(section)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div class="dropdown">
              <div
                class="p-2 border-bottom w-100 dropdown-toggle d-flex align-items-center justify-content-between outline-0 capitalize"
                href="#"
                role="link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
             
                Commodities
              </div>

              <ul class="dropdown-menu w-100 border-0 bg-white">
                {commoditySections.map((section) => (
                  <li className="p-0 m-0">
                    <a class="dropdown-item w-100 p-0 m-0" href="#">
                      {renderSectionItem(section)}
                    </a>
                  </li>
                ))}
              </ul>
=======
            <div
              class=" w-100 border-0   overflow-auto"
              style={{
                height: "75vh",
              }}
            >
              {selectedSections.data.map((section, index) => (
                <a class="dropdown-item w-100 p-0 m-0" href="#">
                  {renderSectionItem(section, index)}
                </a>
              ))}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionPanel;
