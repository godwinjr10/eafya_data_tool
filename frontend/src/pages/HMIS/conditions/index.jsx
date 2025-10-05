import React from "react";
import ConditionsForm from "./CondtionsForm";

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

const Conditions = ({ selectedMonth, selectedYear, section }) => {
    return (
        <ConditionsForm
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            ageGroupMapping={ageGroupMapping}
            ageGroups={ageGroups}
            genders={genders}
            getMonthNumber={getMonthNumber}
            section_id={section}
        />
    );
};

export default Conditions; 