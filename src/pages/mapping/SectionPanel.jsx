import { LampDesk } from "lucide-react";
import React, { useState } from "react";

const SectionPanel = ({
  conditions,
  labTestSections,
  commoditySections,
  vaccineSections,
  antenatalSections,
  postnatalSections,
  handleSectionClick,
  loading,
}) => {
  const [selectedSections, setSelectedSections] = useState({
    section: "Select The Section ...",
    data: [],
  });
  const [activeSubSection, setActiveSubSection] = useState("");
  const renderSectionItem = (section, index) => (
    <div
      key={index}
      style={{
        padding: "8px 12px",
        fontSize: "11px",
        cursor: "pointer",
        position: "relative",
      }}
      className={`${
        activeSubSection === section.name ? "text-primary" : "text-secondary"
      }`}
      onClick={() => {
        handleSectionClick(section.id, section.name);
        setActiveSubSection(section.name);
      }}
      title={`${section.count || 0} items`}
    >
      <div>
        <div className="d-flex align-items-center gap-1">

          <div className="flex-grow-1">{section.name}</div>
          <div className="text-xs text-secondary" style={{ fontSize: "8px" }}>
            {section.count || 0}
          </div>
        </div>
      </div>
    </div>
  );

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
                  section: "Conditions",
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
                  section: "Vaccines",
                  data: vaccineSections,
                })
              }
            >
              Vaccines
            </a>
          </li>
          <li className="p-0 m-0">
            <a
              class="dropdown-item w-100 border-bottom"
              href="#"
              onClick={() =>
                setSelectedSections({
                  section: "Antenatal",
                  data: antenatalSections,
                })
              }
            >
              Antenatal
            </a>
          </li>
          <li className="p-0 m-0">
            <a
              class="dropdown-item w-100 border-bottom"
              href="#"
              onClick={() =>
                setSelectedSections({
                  section: "Postnatal",
                  data: postnatalSections,
                })
              }
            >
              Postnatal
            </a>
          </li>
          <li className="p-0 m-0">
            <a
              class="dropdown-item w-100 border-bottom"
              href="#"
              onClick={() =>
                setSelectedSections({
                  section: "Lab Tests",
                  data: labTestSections,
                })
              }
            >
              Lab Tests
            </a>
          </li>
        </ul>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
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
        ) : conditions?.length === 0 ? (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionPanel;
