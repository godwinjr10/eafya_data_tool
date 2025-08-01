import { LampDesk } from "lucide-react";
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
      style={{
        padding: "8px 12px",
        fontSize: "11px",
        cursor: "pointer",
        position: "relative",
      }}
      className={`${
        selectedSection?.id === section.id ? "text-primary" : "text-secondary"
      }`}
      onClick={() => handleSectionClick(section.id, section.name)}
    >
      <div>
        <div className="d-flex align-items-center gap-1">
        <div className="   text-xs p-1 " style={{fontSize: '8px'}}>({section.id}) </div>{section.name}
        </div>
      </div>
    </div>
  );

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
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <div style={columnHeaderStyle}>Name</div>
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
        ) : currentSections.length === 0 ? (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionPanel;
