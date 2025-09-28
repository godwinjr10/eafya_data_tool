import React from "react";
import CensusInformation from "./CensusInformation";
import SurgicalProcedures from "./SurgicalProcedures";
import Referrals from "./referrals";
import BloodTransfusion from "./bloodTransfusion";
import RadiologyImaging from "./RadiologyImaging";
import AdmissionsDeaths from "./AdmissionsDeaths";
import MentalHealth from "./MentalHealth";
import Nutrition from "./Nutrition";
import Rehabilitation from "./Rehabilitation";
import MaternalConditions from "./MaternalConditions";

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
      {section === "2" && (
        <Referrals
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      {section === "4" && (
        <BloodTransfusion
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
      {section === "12" && (
        <MaternalConditions
          section={section}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default HMIS108;
