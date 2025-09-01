import React from "react";
import CensusInformation from "./CensusInformation";
import SurgicalProcedures from "./SurgicalProcedures";
import UtilizationSpecialServices from "./UtilizationSpecialServices";
import RadiologyImaging from "./RadiologyImaging";
import AdmissionsDeaths from "./AdmissionsDeaths";
import MentalHealth from "./MentalHealth";
import Nutrition from "./Nutrition";
import Rehabilitation from "./Rehabilitation";

const HMIS108 = ({ section, selectedMonth, selectedYear }) => {
  return (
    <div>
      {section === "1" && (
        <CensusInformation
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "3" && (
        <SurgicalProcedures
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "4" && (
        <UtilizationSpecialServices
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "5" && (
        <RadiologyImaging
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "6" && (
        <AdmissionsDeaths
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "7" && (
        <MentalHealth
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "10" && (
        <Nutrition
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "11" && (
        <Rehabilitation
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default HMIS108;
