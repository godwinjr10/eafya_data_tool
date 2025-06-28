import React from "react";
import Maternity from "./Maternity";
import FamilyPlanning from "./FamilyPlanning";
import Postnatal from "./Postnatal";
import Contraceptives from "./Contraceptives";
import Antenatal from "./Antenatal";
import ChildHealth from "./ChildHealth";
import Immunization from "./Immunization";
import Tetanus from "./Tetanus";
import VaccinesAvailability from "./VaccinesAvailability";

const ageGroups = [
    "0-28 days", "29days - 4Yrs", "5 - 9Yrs", "10 - 19Yrs", "20Yrs & above"
];
const genders = ["M", "F"];

// Map backend keys to frontend display format
const ageGroupMapping = {
    "0-28d": "0-28 days",
    "29d-4y": "29days - 4Yrs",
    "5-9y": "5 - 9Yrs",
    "10-19y": "10 - 19Yrs",
    "20y+": "20Yrs & above"
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getMonthNumber = (monthName) => {
    return months.indexOf(monthName) + 1;
};

const MCHForm = ({ section, selectedMonth, selectedYear }) => {

    console.log(section);
    // If section is just "2", default to showing section "2.1"
    const effectiveSection = section === '2' ? '2.1' : section;

    return (
        <>
            {(effectiveSection === '2.1') &&
                <Antenatal
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.2' &&
                <Maternity
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.3' &&
                <Postnatal
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.4.1' &&
                <FamilyPlanning
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.4.2' &&
                <Contraceptives
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.6' &&
                <ChildHealth
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.6.2' &&
                <Tetanus
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.6.3' &&
                <Immunization
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {effectiveSection === '2.6.4' &&
                <VaccinesAvailability
                    section={effectiveSection}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
        </>
    );
};

export default MCHForm; 