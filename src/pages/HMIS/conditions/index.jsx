import React from "react";
import Attedance from "./Attedance";
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

const sectionTitles = {
    '1.1': 'Outpatient Attendance',
    '1.2': 'Outpatient Referals',
    '1.3.1': 'Edpidemic & Referals',
    '1.3.2': 'Other Infectious / Communicable Diseases',
    '1.3.3': 'Neonatal Diseases',
    '1.3.4': 'Non-Communicable Diseases',
    '1.3.5': 'Oral Diseases',
    '1.3.6': 'ENT Conditions',
    '1.3.7': 'Eye Conditions',
    '1.3.8': 'Mental Health',
    '1.3.9': 'Neourlogical Disorders',
    '1.3.10': 'Chronic Respiratory',
    '1.3.11': 'Cancers'
};

const Conditions = ({ section, selectedMonth, selectedYear }) => {
    return (
        <>
            {section === '1.1' &&
                <Attedance
                    section={section}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    ageGroupMapping={ageGroupMapping}
                    ageGroups={ageGroups}
                    genders={genders}
                    getMonthNumber={getMonthNumber}
                />
            }
            {Object.entries(sectionTitles).map(([sectionId, title]) => {
                if (sectionId !== '1.1' && sectionId === section) {
                    return (
                        <ConditionsForm
                            key={sectionId}
                            section={section}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            ageGroupMapping={ageGroupMapping}
                            ageGroups={ageGroups}
                            genders={genders}
                            getMonthNumber={getMonthNumber}
                            section_id={sectionId}
                            title={`${sectionId} ${title}`}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

export default Conditions; 