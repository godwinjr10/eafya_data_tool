import React, { useState, useRef, useEffect } from "react";
import { Nav } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import "../../styles/dhis2.css";
import API from "../../helpers/api";

const dashboardTabs = [
  { id: "opd", title: "Outpatient Dashboard", active: true },
  { id: "ntlp-screening", title: "A. NTLP - TB Screening" },
  { id: "hiv", title: "HIV Dashbaord" },
  { id: "inpatient", title: "Inpatient Dashboard" },
  { id: "laboratory", title: "Laboratory Dashboard" },
  { id: "maternity", title: "Maternity Dashboard" },
  { id: "pediatrics", title: "Pediatrics Dashboard" },
  { id: "emergency", title: "Emergency Dashboard" },
  { id: "pharmacy", title: "Pharmacy Dashboard" },
  { id: "nutrition", title: "Nutrition Dashboard" },
];

// Sample data for charts
const malariaCasesData = [
  { week: "W13/2025", tested: 1.1 },
  { week: "W14/2025", tested: 0.94 },
  { week: "W15/2025", tested: 0.69 },
  { week: "W16/2025", tested: 1.0 },
  { week: "W17/2025", tested: 0.96 },
  { week: "W18/2025", tested: 1.1 },
  { week: "W19/2025", tested: 0.94 },
  { week: "W20/2025", tested: 1.0 },
  { week: "W21/2025", tested: 1.0 },
  { week: "W22/2025", tested: 0.9 },
  { week: "W23/2025", tested: 1.1 },
  { week: "W24/2025", tested: 0.93 },
];

const stockData = [
  { month: "January 2025", act: 13.9, mrdt: 2.9 },
  { month: "February 2025", act: 17.2, mrdt: 3 },
  { month: "March 2025", act: 122.2, mrdt: 3.4 },
  { month: "April 2025", act: 16.9, mrdt: 2.7 },
  { month: "May 2025", act: 10.3, mrdt: 2.4 },
];

const artesuanteData = [
  { month: "January 2025", stock: 2.8 },
  { month: "February 2025", stock: 2.6 },
  { month: "March 2025", stock: 3.5 },
  { month: "April 2025", stock: 2.8 },
  { month: "May 2025", stock: 2.2 },
];

// Sample data for TB Screening
const tbScreeningData = [
  { month: "January", screened: 450, positive: 45 },
  { month: "February", screened: 520, positive: 52 },
  { month: "March", screened: 480, positive: 48 },
  { month: "April", screened: 600, positive: 60 },
  { month: "May", screened: 550, positive: 55 },
];

const tbSymptomData = [
  { name: "Cough > 2 weeks", value: 45 },
  { name: "Night Sweats", value: 25 },
  { name: "Weight Loss", value: 20 },
  { name: "Fever", value: 10 },
];

const tbReferralData = [
  { month: "January", referred: 40, completed: 35 },
  { month: "February", referred: 48, completed: 42 },
  { month: "March", referred: 45, completed: 38 },
  { month: "April", referred: 55, completed: 50 },
  { month: "May", referred: 50, completed: 45 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Sample data for HIV Dashboard
const hivTestingData = [
  { month: "January", tested: 1200, positive: 85, linked: 82 },
  { month: "February", tested: 1350, positive: 92, linked: 88 },
  { month: "March", tested: 1180, positive: 78, linked: 75 },
  { month: "April", tested: 1420, positive: 98, linked: 95 },
  { month: "May", tested: 1300, positive: 89, linked: 86 },
];

const artCascadeData = [
  { stage: "Estimated PLHIV", value: 10000 },
  { stage: "Know Status", value: 8500 },
  { stage: "On ART", value: 7800 },
  { stage: "Virally Suppressed", value: 7200 },
];

const retentionData = [
  { month: "3 Months", retained: 95 },
  { month: "6 Months", retained: 92 },
  { month: "12 Months", retained: 88 },
  { month: "24 Months", retained: 85 },
  { month: "36 Months", retained: 82 },
];

const preventionData = [
  { category: "PrEP", current: 450, target: 600 },
  { category: "PMTCT", current: 280, target: 300 },
  { category: "PEP", current: 120, target: 150 },
  { category: "VMMC", current: 850, target: 1000 },
];

const ageGenderData = [
  { age: "0-14", male: 45, female: 52 },
  { age: "15-24", male: 120, female: 185 },
  { age: "25-34", male: 230, female: 280 },
  { age: "35-49", male: 175, female: 195 },
  { age: "50+", male: 85, female: 92 },
];

// Sample data for OPD Dashboard
const opdVisitsData = [
  { month: "January", newVisits: 1250, revisits: 850, referrals: 95 },
  { month: "February", newVisits: 1380, revisits: 920, referrals: 105 },
  { month: "March", newVisits: 1420, revisits: 980, referrals: 112 },
  { month: "April", newVisits: 1180, revisits: 760, referrals: 88 },
  { month: "May", newVisits: 1290, revisits: 840, referrals: 98 },
];

const diagnosisData = [
  { category: "Malaria", count: 450, percentage: 22 },
  { category: "RTI", count: 380, percentage: 19 },
  { category: "Diarrhea", count: 280, percentage: 14 },
  { category: "Pneumonia", count: 250, percentage: 12 },
  { category: "Others", count: 670, percentage: 33 },
];

const ageGroupData = [
  { group: "0-4 years", male: 280, female: 310 },
  { group: "5-14 years", male: 220, female: 240 },
  { group: "15-24 years", male: 350, female: 420 },
  { group: "25-49 years", male: 480, female: 520 },
  { group: "50+ years", male: 180, female: 190 },
];

const waitingTimeData = [
  { hour: "8-9 AM", average: 25 },
  { hour: "9-10 AM", average: 35 },
  { hour: "10-11 AM", average: 45 },
  { hour: "11-12 PM", average: 40 },
  { hour: "12-1 PM", average: 30 },
  { hour: "1-2 PM", average: 25 },
  { hour: "2-3 PM", average: 20 },
  { hour: "3-4 PM", average: 15 },
];

const prescriptionData = [
  { category: "Antibiotics", prescribed: 380, dispensed: 350 },
  { category: "Analgesics", prescribed: 420, dispensed: 420 },
  { category: "Antimalarials", prescribed: 280, dispensed: 260 },
  { category: "Antihypertensives", prescribed: 150, dispensed: 140 },
  { category: "Others", prescribed: 290, dispensed: 270 },
];

// Sample data for Inpatient Dashboard
const bedOccupancyData = [
  { ward: "Medical Ward", total: 50, occupied: 42, available: 8 },
  { ward: "Surgical Ward", total: 40, occupied: 35, available: 5 },
  { ward: "Pediatric Ward", total: 30, occupied: 25, available: 5 },
  { ward: "Maternity Ward", total: 25, occupied: 20, available: 5 },
  { ward: "ICU", total: 10, occupied: 8, available: 2 },
];

const admissionTrendData = [
  { month: "January", emergency: 120, planned: 80 },
  { month: "February", emergency: 135, planned: 90 },
  { month: "March", emergency: 128, planned: 85 },
  { month: "April", emergency: 142, planned: 95 },
  { month: "May", emergency: 130, planned: 88 },
];

const lengthOfStayData = [
  { ward: "Medical Ward", average: 5.2 },
  { ward: "Surgical Ward", average: 4.8 },
  { ward: "Pediatric Ward", average: 3.5 },
  { ward: "Maternity Ward", average: 2.8 },
  { ward: "ICU", average: 6.5 },
];

const patientOutcomeData = [
  { category: "Discharged", count: 280 },
  { category: "Transferred", count: 45 },
  { category: "Deceased", count: 15 },
  { category: "DAMA", count: 10 },
];

const nursePatientRatioData = [
  { shift: "Morning", ratio: 1.5 },
  { shift: "Afternoon", ratio: 1.8 },
  { shift: "Night", ratio: 2.2 },
];

// Sample data for Laboratory Dashboard
const testVolumeData = [
  {
    month: "January",
    hematology: 850,
    biochemistry: 720,
    microbiology: 340,
    serology: 420,
  },
  {
    month: "February",
    hematology: 920,
    biochemistry: 780,
    microbiology: 380,
    serology: 450,
  },
  {
    month: "March",
    hematology: 880,
    biochemistry: 750,
    microbiology: 360,
    serology: 430,
  },
  {
    month: "April",
    hematology: 950,
    biochemistry: 800,
    microbiology: 400,
    serology: 470,
  },
  {
    month: "May",
    hematology: 900,
    biochemistry: 760,
    microbiology: 370,
    serology: 440,
  },
];

const turnaroundTimeData = [
  { category: "Routine", target: 24, actual: 22 },
  { category: "Urgent", target: 4, actual: 3.5 },
  { category: "STAT", target: 1, actual: 0.8 },
  { category: "Critical", target: 2, actual: 1.5 },
];

const sampleRejectionData = [
  { reason: "Hemolyzed", count: 45 },
  { reason: "Insufficient Volume", count: 38 },
  { reason: "Wrong Container", count: 25 },
  { reason: "Incorrect Labeling", count: 20 },
  { reason: "Clotted Sample", count: 15 },
];

const testResultsData = [
  { hour: "6-8", completed: 85, pending: 15 },
  { hour: "8-10", completed: 120, pending: 25 },
  { hour: "10-12", completed: 150, pending: 30 },
  { hour: "12-14", completed: 140, pending: 28 },
  { hour: "14-16", completed: 130, pending: 22 },
  { hour: "16-18", completed: 95, pending: 18 },
];

const criticalValuesData = [
  { department: "Hematology", reported: 95, total: 100 },
  { department: "Biochemistry", reported: 88, total: 90 },
  { department: "Microbiology", reported: 45, total: 48 },
  { department: "Serology", reported: 28, total: 30 },
];

const qualityControlData = [
  { month: "January", pass: 98.5, fail: 1.5 },
  { month: "February", pass: 99.0, fail: 1.0 },
  { month: "March", pass: 98.8, fail: 1.2 },
  { month: "April", pass: 99.2, fail: 0.8 },
  { month: "May", pass: 99.1, fail: 0.9 },
];

// Sample data for Maternity Dashboard
const deliveryStatsData = [
  { month: "January", normal: 120, csection: 45, assisted: 15 },
  { month: "February", normal: 135, csection: 48, assisted: 12 },
  { month: "March", normal: 128, csection: 42, assisted: 14 },
  { month: "April", normal: 142, csection: 50, assisted: 16 },
  { month: "May", normal: 130, csection: 46, assisted: 13 },
];

const antenatalData = [
  { month: "January", firstVisit: 85, followUp: 320 },
  { month: "February", firstVisit: 92, followUp: 345 },
  { month: "March", firstVisit: 88, followUp: 330 },
  { month: "April", firstVisit: 95, followUp: 360 },
  { month: "May", firstVisit: 90, followUp: 340 },
];

const maternalOutcomesData = [
  { category: "Normal Recovery", count: 280 },
  { category: "Minor Complications", count: 35 },
  { category: "Major Complications", count: 12 },
  { category: "Transfers", count: 8 },
];

const newbornOutcomesData = [
  { category: "Healthy", weight: "Normal", count: 250 },
  { category: "Healthy", weight: "Low", count: 30 },
  { category: "NICU Admission", weight: "Normal", count: 15 },
  { category: "NICU Admission", weight: "Low", count: 20 },
];

const laborProgressData = [
  { stage: "Admission", average: 2 },
  { stage: "Active Labor", average: 6 },
  { stage: "Delivery", average: 1.5 },
  { stage: "Post-Delivery", average: 24 },
];

// Sample data for Pediatrics Dashboard
const pediatricVisitsData = [
  { month: "January", newPatients: 180, followUps: 420, emergency: 95 },
  { month: "February", newPatients: 195, followUps: 440, emergency: 105 },
  { month: "March", newPatients: 185, followUps: 430, emergency: 98 },
  { month: "April", newPatients: 210, followUps: 460, emergency: 112 },
  { month: "May", newPatients: 200, followUps: 450, emergency: 108 },
];

const immunizationData = [
  { vaccine: "BCG", completed: 95, target: 100 },
  { vaccine: "DPT", completed: 88, target: 100 },
  { vaccine: "Polio", completed: 92, target: 100 },
  { vaccine: "Measles", completed: 85, target: 100 },
  { vaccine: "Rotavirus", completed: 90, target: 100 },
];

const growthMonitoringData = [
  { ageGroup: "0-6m", normal: 280, underweight: 25, overweight: 15 },
  { ageGroup: "7-12m", normal: 260, underweight: 30, overweight: 20 },
  { ageGroup: "1-2y", normal: 320, underweight: 35, overweight: 25 },
  { ageGroup: "2-5y", normal: 420, underweight: 40, overweight: 30 },
];

const commonDiagnosesData = [
  { diagnosis: "Respiratory Infections", count: 150 },
  { diagnosis: "Gastroenteritis", count: 120 },
  { diagnosis: "Ear Infections", count: 85 },
  { diagnosis: "Skin Conditions", count: 65 },
  { diagnosis: "Asthma", count: 45 },
];

const nutritionStatusData = [
  { month: "January", normal: 85, moderate: 12, severe: 3 },
  { month: "February", normal: 87, moderate: 10, severe: 3 },
  { month: "March", normal: 86, moderate: 11, severe: 3 },
  { month: "April", normal: 88, moderate: 9, severe: 3 },
  { month: "May", normal: 89, moderate: 8, severe: 3 },
];

// Sample data for Emergency Dashboard
const emergencyVisitsData = [
  { hour: "00-04", trauma: 12, medical: 18, pediatric: 8 },
  { hour: "04-08", trauma: 8, medical: 15, pediatric: 6 },
  { hour: "08-12", trauma: 25, medical: 35, pediatric: 15 },
  { hour: "12-16", trauma: 30, medical: 40, pediatric: 18 },
  { hour: "16-20", trauma: 28, medical: 38, pediatric: 16 },
  { hour: "20-24", trauma: 15, medical: 25, pediatric: 10 },
];

const triageData = [
  { category: "Red", count: 45 },
  { category: "Orange", count: 85 },
  { category: "Yellow", count: 150 },
  { category: "Green", count: 220 },
];

const responseTimeData = [
  { category: "Red", target: 0, actual: 0.8 },
  { category: "Orange", target: 10, actual: 8.5 },
  { category: "Yellow", target: 30, actual: 25 },
  { category: "Green", target: 60, actual: 45 },
];

const dispositionData = [
  { category: "Admitted", count: 85 },
  { category: "Discharged", count: 250 },
  { category: "Transferred", count: 25 },
  { category: "LAMA", count: 15 },
];

// Sample data for Pharmacy Dashboard
const dispensingData = [
  { hour: "08-10", prescriptions: 85, completed: 80 },
  { hour: "10-12", prescriptions: 120, completed: 115 },
  { hour: "12-14", prescriptions: 150, completed: 145 },
  { hour: "14-16", prescriptions: 130, completed: 125 },
  { hour: "16-18", prescriptions: 95, completed: 90 },
];

const stockLevelsData = [
  { category: "Antibiotics", inStock: 95, reorder: 20 },
  { category: "Analgesics", inStock: 85, reorder: 15 },
  { category: "Antihypertensives", inStock: 75, reorder: 25 },
  { category: "Antidiabetics", inStock: 80, reorder: 20 },
  { category: "Respiratory", inStock: 90, reorder: 15 },
];

const expiryTrackingData = [
  { month: "1 Month", count: 25 },
  { month: "3 Months", count: 45 },
  { month: "6 Months", count: 85 },
  { month: "12 Months", count: 150 },
];

const prescriptionTrendsData = [
  { month: "January", otc: 850, prescription: 1200 },
  { month: "February", otc: 920, prescription: 1350 },
  { month: "March", otc: 880, prescription: 1280 },
  { month: "April", otc: 950, prescription: 1420 },
  { month: "May", otc: 900, prescription: 1380 },
];

// Sample data for Nutrition Dashboard
const nutritionalStatusData = [
  { category: "Normal", count: 850 },
  { category: "Mild Malnutrition", count: 120 },
  { category: "Moderate Malnutrition", count: 45 },
  { category: "Severe Malnutrition", count: 15 },
];

const dietaryConsultationsData = [
  { month: "January", initial: 85, followup: 150 },
  { month: "February", initial: 92, followup: 165 },
  { month: "March", initial: 88, followup: 155 },
  { month: "April", initial: 95, followup: 170 },
  { month: "May", initial: 90, followup: 160 },
];

const nutritionEducationData = [
  { topic: "Healthy Eating", attendees: 120 },
  { topic: "Diabetes Diet", attendees: 85 },
  { topic: "Weight Management", attendees: 95 },
  { topic: "Pediatric Nutrition", attendees: 65 },
  { topic: "Sports Nutrition", attendees: 45 },
];

const mealServiceData = [
  { meal: "Breakfast", regular: 250, special: 85 },
  { meal: "Lunch", regular: 280, special: 95 },
  { meal: "Dinner", regular: 260, special: 90 },
  { meal: "Snacks", regular: 150, special: 45 },
];

const renderEmergencyDashboard = () => (
  <div className="dashboard-conten">
    {/* Top Stats Row */}
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="emergency-stat">
              <div className="stat-icon bg-danger">
                <i className="bi bi-heart-pulse"></i>
              </div>
              <div className="stat-details">
                <h3>45</h3>
                <p>Current Active Cases</p>
                <span className="trend-up">
                  +5 <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="emergency-stat">
              <div className="stat-icon bg-warning">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-details">
                <h3>12 min</h3>
                <p>Avg. Response Time</p>
                <span className="trend-down">
                  -2 min <i className="bi bi-arrow-down"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="emergency-stat">
              <div className="stat-icon bg-success">
                <i className="bi bi-person-check"></i>
              </div>
              <div className="stat-details">
                <h3>98.5%</h3>
                <p>Treatment Success Rate</p>
                <span className="trend-up">
                  +0.5% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="emergency-stat">
              <div className="stat-icon bg-info">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-details">
                <h3>85%</h3>
                <p>Bed Occupancy</p>
                <span className="trend-stable">
                  Stable <i className="bi bi-dash"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* First Row of Charts */}
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Emergency Visits by Hour</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={emergencyVisitsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="trauma" fill="#e74c3c" name="Trauma" />
                <Bar dataKey="medical" fill="#3498db" name="Medical" />
                <Bar dataKey="pediatric" fill="#2ecc71" name="Pediatric" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Triage Categories</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={triageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {triageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>

    {/* Second Row of Charts */}
    <div className="row">
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Response Time by Category</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={responseTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="target" fill="#3498db" name="Target (min)" />
                <Bar dataKey="actual" fill="#2ecc71" name="Actual (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Patient Disposition</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dispositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dispositionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderPharmacyDashboard = () => (
  <div className="dashboard-content">
    {/* Top Stats Row */}
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="pharmacy-stat">
              <div className="stat-icon bg-primary">
                <i className="bi bi-capsule"></i>
              </div>
              <div className="stat-details">
                <h3>580</h3>
                <p>Prescriptions Today</p>
                <span className="trend-up">
                  +8% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="pharmacy-stat">
              <div className="stat-icon bg-success">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-details">
                <h3>96.5%</h3>
                <p>Fill Rate</p>
                <span className="trend-up">
                  +1.5% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="pharmacy-stat">
              <div className="stat-icon bg-warning">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <div className="stat-details">
                <h3>15</h3>
                <p>Low Stock Items</p>
                <span className="trend-down">
                  -3 <i className="bi bi-arrow-down"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="pharmacy-stat">
              <div className="stat-icon bg-danger">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-details">
                <h3>12 min</h3>
                <p>Avg. Wait Time</p>
                <span className="trend-down">
                  -2 min <i className="bi bi-arrow-down"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* First Row of Charts */}
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Prescription Trends</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={prescriptionTrendsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="prescription"
                  stroke="#3498db"
                  name="Prescription"
                />
                <Line
                  type="monotone"
                  dataKey="otc"
                  stroke="#2ecc71"
                  name="OTC"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Expiry Tracking</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expiryTrackingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {expiryTrackingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>

    {/* Second Row of Charts */}
    <div className="row">
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Stock Levels</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stockLevelsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inStock" fill="#2ecc71" name="In Stock" />
                <Bar dataKey="reorder" fill="#e74c3c" name="Reorder Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Dispensing Performance</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dispensingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="prescriptions"
                  stroke="#3498db"
                  name="Received"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#2ecc71"
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderNutritionDashboard = () => (
  <div className="dashboard-content">
    {/* Top Stats Row */}
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="nutrition-stat">
              <div className="stat-icon bg-primary">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-details">
                <h3>250</h3>
                <p>Active Patients</p>
                <span className="trend-up">
                  +5% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="nutrition-stat">
              <div className="stat-icon bg-success">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-details">
                <h3>85</h3>
                <p>Consultations Today</p>
                <span className="trend-up">
                  +8% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="nutrition-stat">
              <div className="stat-icon bg-info">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="stat-details">
                <h3>92%</h3>
                <p>Diet Plan Adherence</p>
                <span className="trend-up">
                  +2% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="nutrition-stat">
              <div className="stat-icon bg-warning">
                <i className="bi bi-person-check"></i>
              </div>
              <div className="stat-details">
                <h3>88%</h3>
                <p>Goal Achievement</p>
                <span className="trend-up">
                  +3% <i className="bi bi-arrow-up"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* First Row of Charts */}
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Dietary Consultations</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dietaryConsultationsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="initial"
                  stroke="#3498db"
                  name="Initial Consults"
                />
                <Line
                  type="monotone"
                  dataKey="followup"
                  stroke="#2ecc71"
                  name="Follow-ups"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Nutritional Status</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutritionalStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {nutritionalStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>

    {/* Second Row of Charts */}
    <div className="row">
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Nutrition Education Sessions</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={nutritionEducationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendees" fill="#3498db" name="Attendees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Meal Service Distribution</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mealServiceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="meal" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="regular" fill="#2ecc71" name="Regular Diet" />
                <Bar dataKey="special" fill="#e74c3c" name="Special Diet" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("opd");
  const [chartWidth, setChartWidth] = useState(500);
  const chartContainerRef = useRef(null);
  const [admissionTrendData, setAdmissionTrendData] = useState([]);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchAdmissionTrend = async () => {
      try {
        const res = await API.get("/dashboard"); // Backend endpoint
        const formatted = res.data.map((item) => ({
          month: monthNames[item.month - 1],
          total: item.total,
        }));
        setAdmissionTrendData(formatted);
      } catch (err) {
        console.error("Error fetching admission trend data:", err);
      }
    };

    fetchAdmissionTrend();
  }, []);

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth - 40); // 40px for padding
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  const renderMalariaStock = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                Proportion of malaria suspected cases tested
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={malariaCasesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="tested"
                    fill="#82ca9d"
                    name="Proportion tested"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Months of stock for mRDT and ACTs</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stockData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="act"
                    stroke="#82ca9d"
                    name="ACT Months of Stock"
                  />
                  <Line
                    type="monotone"
                    dataKey="mrdt"
                    stroke="#8884d8"
                    name="mRDT Months of Stock"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Severe Malaria cases</h5>
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ height: "300px" }}
              >
                <h3 className="text-muted mb-3">108-RT01. Severe malaria</h3>
                <p className="text-muted">MOH - Uganda - Months this year</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                Months of stock available for Artesuante
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={artesuanteData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="#82ca9d"
                    name="Months of Stock"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTBScreening = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">TB Screening Outcomes</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={tbScreeningData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="screened"
                    fill="#82ca9d"
                    name="Total Screened"
                  />
                  <Bar dataKey="positive" fill="#8884d8" name="TB Positive" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">TB Symptoms Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tbSymptomData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tbSymptomData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">TB Referral Tracking</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={tbReferralData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="referred"
                    stroke="#8884d8"
                    name="Patients Referred"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#82ca9d"
                    name="Referrals Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Key TB Screening Metrics</h5>
              <div className="d-flex flex-column gap-4 p-3">
                <div className="metric-item">
                  <h3 className="text-primary mb-2">92%</h3>
                  <p className="text-muted mb-0">Screening Coverage Rate</p>
                </div>
                <div className="metric-item">
                  <h3 className="text-success mb-2">85%</h3>
                  <p className="text-muted mb-0">Referral Completion Rate</p>
                </div>
                <div className="metric-item">
                  <h3 className="text-warning mb-2">10%</h3>
                  <p className="text-muted mb-0">Positive Case Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHIVDashboard = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      {/* First Row */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">HIV Testing and Linkage Cascade</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={hivTestingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tested" fill="#82ca9d" name="Tested" />
                  <Bar dataKey="positive" fill="#8884d8" name="HIV+" />
                  <Bar dataKey="linked" fill="#ffc658" name="Linked to Care" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Key Performance Indicators</h5>
              <div className="d-flex flex-column gap-3">
                <div className="hiv-metric">
                  <h4>95%</h4>
                  <p>Testing Coverage</p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
                <div className="hiv-metric">
                  <h4>92%</h4>
                  <p>Linkage to Care</p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div className="hiv-metric">
                  <h4>88%</h4>
                  <p>Viral Suppression</p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-info"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">95-95-95 Cascade</h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={artCascadeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="stage"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Retention in Care</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={retentionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="retained"
                    stroke="#82ca9d"
                    name="Retention Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Prevention Services Progress</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={preventionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#82ca9d" name="Current" />
                  <Bar dataKey="target" fill="#8884d8" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">New Cases by Age and Gender</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={ageGenderData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#3498db" name="Male" />
                  <Bar dataKey="female" fill="#e74c3c" name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOPDDashboard = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="opd-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-people"></i>
                </div>
                <div className="stat-details">
                  <h3>2,130</h3>
                  <p>Total Visits This Month</p>
                  <span className="trend-up">
                    +12% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="opd-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-person-plus"></i>
                </div>
                <div className="stat-details">
                  <h3>1,290</h3>
                  <p>New Patients</p>
                  <span className="trend-up">
                    +8% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="opd-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-clock"></i>
                </div>
                <div className="stat-details">
                  <h3>32 min</h3>
                  <p>Avg. Waiting Time</p>
                  <span className="trend-down">
                    -5% <i className="bi bi-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="opd-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-journal-medical"></i>
                </div>
                <div className="stat-details">
                  <h3>98%</h3>
                  <p>Prescription Fill Rate</p>
                  <span className="trend-up">
                    +2% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts First Row */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Monthly Admissions Trend</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={admissionTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Admissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Top Diagnoses</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diagnosisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {diagnosisData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Second Row */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                Patient Distribution by Age and Gender
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={ageGroupData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#3498db" name="Male" />
                  <Bar dataKey="female" fill="#e74c3c" name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Average Waiting Time by Hour</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={waitingTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#2ecc71"
                    name="Average Wait (mins)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Third Row */}
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Prescription Analysis</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={prescriptionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="prescribed" fill="#3498db" name="Prescribed" />
                  <Bar dataKey="dispensed" fill="#2ecc71" name="Dispensed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInpatientDashboard = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="inpatient-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-hospital"></i>
                </div>
                <div className="stat-details">
                  <h3>85%</h3>
                  <p>Bed Occupancy Rate</p>
                  <span className="trend-up">
                    +5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="inpatient-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-details">
                  <h3>4.5</h3>
                  <p>Average Length of Stay (Days)</p>
                  <span className="trend-down">
                    -0.5 <i className="bi bi-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="inpatient-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-person-check"></i>
                </div>
                <div className="stat-details">
                  <h3>92%</h3>
                  <p>Discharge Rate</p>
                  <span className="trend-up">
                    +2% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="inpatient-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-people"></i>
                </div>
                <div className="stat-details">
                  <h3>1:6</h3>
                  <p>Nurse-Patient Ratio</p>
                  <span className="trend-stable">
                    Stable <i className="bi bi-dash"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Bed Occupancy by Ward</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={bedOccupancyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="ward"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="occupied"
                    stackId="a"
                    fill="#3498db"
                    name="Occupied Beds"
                  />
                  <Bar
                    dataKey="available"
                    stackId="a"
                    fill="#2ecc71"
                    name="Available Beds"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Patient Outcomes</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patientOutcomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {patientOutcomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Admission Trends</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={admissionTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="emergency"
                    stroke="#e74c3c"
                    name="Emergency Admissions"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#3498db"
                    name="Planned Admissions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Average Length of Stay by Ward</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={lengthOfStayData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="ward"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#2ecc71" name="Days" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Nurse-Patient Ratio by Shift</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={nursePatientRatioData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shift" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="ratio"
                    stroke="#8e44ad"
                    name="Nurse:Patient Ratio"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLaboratoryDashboard = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="lab-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-clipboard2-pulse"></i>
                </div>
                <div className="stat-details">
                  <h3>2,890</h3>
                  <p>Tests Performed Today</p>
                  <span className="trend-up">
                    +8% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="lab-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-details">
                  <h3>98.5%</h3>
                  <p>On-Time Reporting</p>
                  <span className="trend-up">
                    +1.5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="lab-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="stat-details">
                  <h3>99.1%</h3>
                  <p>QC Pass Rate</p>
                  <span className="trend-up">
                    +0.2% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="lab-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <div className="stat-details">
                  <h3>2.8%</h3>
                  <p>Sample Rejection Rate</p>
                  <span className="trend-down">
                    -0.5% <i className="bi bi-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Test Volume by Department</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={testVolumeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hematology" fill="#3498db" name="Hematology" />
                  <Bar
                    dataKey="biochemistry"
                    fill="#2ecc71"
                    name="Biochemistry"
                  />
                  <Bar
                    dataKey="microbiology"
                    fill="#e74c3c"
                    name="Microbiology"
                  />
                  <Bar dataKey="serology" fill="#f1c40f" name="Serology" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Sample Rejection Reasons</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sampleRejectionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {sampleRejectionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Test Results Status (Today)</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={testResultsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#2ecc71"
                    name="Completed"
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill="#f1c40f"
                    name="Pending"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Turnaround Time Performance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={turnaroundTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="target" fill="#3498db" name="Target (Hours)" />
                  <Bar dataKey="actual" fill="#2ecc71" name="Actual (Hours)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Critical Values Reporting</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={criticalValuesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reported" fill="#2ecc71" name="Reported" />
                  <Bar
                    dataKey="total"
                    fill="#3498db"
                    name="Total Critical Values"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Quality Control Performance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={qualityControlData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pass"
                    stroke="#2ecc71"
                    name="Pass Rate (%)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="fail"
                    stroke="#e74c3c"
                    name="Fail Rate (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaternityDashboard = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="maternity-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-heart-pulse"></i>
                </div>
                <div className="stat-details">
                  <h3>180</h3>
                  <p>Deliveries This Month</p>
                  <span className="trend-up">
                    +5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="maternity-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-percent"></i>
                </div>
                <div className="stat-details">
                  <h3>25.5%</h3>
                  <p>C-Section Rate</p>
                  <span className="trend-stable">
                    Stable <i className="bi bi-dash"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="maternity-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <div className="stat-details">
                  <h3>430</h3>
                  <p>ANC Visits</p>
                  <span className="trend-up">
                    +8% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="maternity-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-clipboard2-pulse"></i>
                </div>
                <div className="stat-details">
                  <h3>98.5%</h3>
                  <p>Safe Deliveries</p>
                  <span className="trend-up">
                    +0.5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Delivery Statistics</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={deliveryStatsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="normal" fill="#2ecc71" name="Normal Delivery" />
                  <Bar dataKey="csection" fill="#3498db" name="C-Section" />
                  <Bar
                    dataKey="assisted"
                    fill="#f1c40f"
                    name="Assisted Delivery"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Maternal Outcomes</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maternalOutcomesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {maternalOutcomesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Antenatal Care Visits</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={antenatalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="firstVisit"
                    stroke="#3498db"
                    name="First Visit"
                  />
                  <Line
                    type="monotone"
                    dataKey="followUp"
                    stroke="#2ecc71"
                    name="Follow-up"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Average Labor Duration</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={laborProgressData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3498db" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPediatricsDashboard = () => (
    <div className="dashboard-content" ref={chartContainerRef}>
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pediatrics-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-people"></i>
                </div>
                <div className="stat-details">
                  <h3>695</h3>
                  <p>Total Visits This Month</p>
                  <span className="trend-up">
                    +8% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pediatrics-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div className="stat-details">
                  <h3>92%</h3>
                  <p>Immunization Rate</p>
                  <span className="trend-up">
                    +2% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pediatrics-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div className="stat-details">
                  <h3>85%</h3>
                  <p>Normal Growth Rate</p>
                  <span className="trend-up">
                    +1% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pediatrics-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-heart-pulse"></i>
                </div>
                <div className="stat-details">
                  <h3>98.5%</h3>
                  <p>Treatment Success Rate</p>
                  <span className="trend-stable">
                    Stable <i className="bi bi-dash"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Patient Visits</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pediatricVisitsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="newPatients"
                    fill="#2ecc71"
                    name="New Patients"
                  />
                  <Bar dataKey="followUps" fill="#3498db" name="Follow-ups" />
                  <Bar dataKey="emergency" fill="#e74c3c" name="Emergency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Common Diagnoses</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={commonDiagnosesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {commonDiagnosesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Immunization Coverage</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={immunizationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vaccine" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#2ecc71" name="Completed" />
                  <Bar dataKey="target" fill="#8884d8" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Growth Monitoring</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={growthMonitoringData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="normal"
                    stackId="a"
                    fill="#2ecc71"
                    name="Normal Weight"
                  />
                  <Bar
                    dataKey="underweight"
                    stackId="a"
                    fill="#e74c3c"
                    name="Underweight"
                  />
                  <Bar
                    dataKey="overweight"
                    stackId="a"
                    fill="#f1c40f"
                    name="Overweight"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyDashboard = () => (
    <div className="dashboard-content">
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="emergency-stat">
                <div className="stat-icon bg-danger">
                  <i className="bi bi-heart-pulse"></i>
                </div>
                <div className="stat-details">
                  <h3>45</h3>
                  <p>Current Active Cases</p>
                  <span className="trend-up">
                    +5 <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="emergency-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-details">
                  <h3>12 min</h3>
                  <p>Avg. Response Time</p>
                  <span className="trend-down">
                    -2 min <i className="bi bi-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="emergency-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-person-check"></i>
                </div>
                <div className="stat-details">
                  <h3>98.5%</h3>
                  <p>Treatment Success Rate</p>
                  <span className="trend-up">
                    +0.5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="emergency-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-people"></i>
                </div>
                <div className="stat-details">
                  <h3>85%</h3>
                  <p>Bed Occupancy</p>
                  <span className="trend-stable">
                    Stable <i className="bi bi-dash"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Emergency Visits by Hour</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={emergencyVisitsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trauma" fill="#e74c3c" name="Trauma" />
                  <Bar dataKey="medical" fill="#3498db" name="Medical" />
                  <Bar dataKey="pediatric" fill="#2ecc71" name="Pediatric" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Triage Categories</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={triageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {triageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Response Time by Category</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={responseTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="target" fill="#3498db" name="Target (min)" />
                  <Bar dataKey="actual" fill="#2ecc71" name="Actual (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Patient Disposition</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dispositionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {dispositionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPharmacyDashboard = () => (
    <div className="dashboard-content">
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pharmacy-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-capsule"></i>
                </div>
                <div className="stat-details">
                  <h3>580</h3>
                  <p>Prescriptions Today</p>
                  <span className="trend-up">
                    +8% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pharmacy-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="stat-details">
                  <h3>96.5%</h3>
                  <p>Fill Rate</p>
                  <span className="trend-up">
                    +1.5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pharmacy-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <div className="stat-details">
                  <h3>15</h3>
                  <p>Low Stock Items</p>
                  <span className="trend-down">
                    -3 <i className="bi bi-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="pharmacy-stat">
                <div className="stat-icon bg-danger">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-details">
                  <h3>12 min</h3>
                  <p>Avg. Wait Time</p>
                  <span className="trend-down">
                    -2 min <i className="bi bi-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Prescription Trends</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={prescriptionTrendsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="prescription"
                    stroke="#3498db"
                    name="Prescription"
                  />
                  <Line
                    type="monotone"
                    dataKey="otc"
                    stroke="#2ecc71"
                    name="OTC"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Expiry Tracking</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expiryTrackingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {expiryTrackingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Stock Levels</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stockLevelsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inStock" fill="#2ecc71" name="In Stock" />
                  <Bar dataKey="reorder" fill="#e74c3c" name="Reorder Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Dispensing Performance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dispensingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="prescriptions"
                    stroke="#3498db"
                    name="Received"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#2ecc71"
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNutritionDashboard = () => (
    <div className="dashboard-content">
      {/* Top Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="nutrition-stat">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-people"></i>
                </div>
                <div className="stat-details">
                  <h3>250</h3>
                  <p>Active Patients</p>
                  <span className="trend-up">
                    +5% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="nutrition-stat">
                <div className="stat-icon bg-success">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <div className="stat-details">
                  <h3>85</h3>
                  <p>Consultations Today</p>
                  <span className="trend-up">
                    +8% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="nutrition-stat">
                <div className="stat-icon bg-info">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div className="stat-details">
                  <h3>92%</h3>
                  <p>Diet Plan Adherence</p>
                  <span className="trend-up">
                    +2% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="nutrition-stat">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-person-check"></i>
                </div>
                <div className="stat-details">
                  <h3>88%</h3>
                  <p>Goal Achievement</p>
                  <span className="trend-up">
                    +3% <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Row of Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Dietary Consultations</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dietaryConsultationsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="initial"
                    stroke="#3498db"
                    name="Initial Consults"
                  />
                  <Line
                    type="monotone"
                    dataKey="followup"
                    stroke="#2ecc71"
                    name="Follow-ups"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Nutritional Status</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={nutritionalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {nutritionalStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Nutrition Education Sessions</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={nutritionEducationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendees" fill="#3498db" name="Attendees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Meal Service Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mealServiceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="meal" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="regular" fill="#2ecc71" name="Regular Diet" />
                  <Bar dataKey="special" fill="#e74c3c" name="Special Diet" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container p-3">
      {/* <div className="d-flex align-items-center mb-3">
        <div className="input-group dashboard-search" style={{ width: '300px' }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for a dashboard"
          />
        </div>
      </div> */}

      <Nav variant="pills" className="dashboard-tabs mb-4">
        {dashboardTabs.map((tab) => (
          <Nav.Item key={tab.id}>
            <Nav.Link
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={tab.active ? "active" : ""}
            >
              {tab.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {activeTab === "opd" && renderOPDDashboard()}
      {activeTab === "mal-stock" && renderMalariaStock()}
      {activeTab === "ntlp-screening" && renderTBScreening()}
      {activeTab === "hiv" && renderHIVDashboard()}
      {activeTab === "inpatient" && renderInpatientDashboard()}
      {activeTab === "laboratory" && renderLaboratoryDashboard()}
      {activeTab === "maternity" && renderMaternityDashboard()}
      {activeTab === "pediatrics" && renderPediatricsDashboard()}
      {activeTab === "emergency" && renderEmergencyDashboard()}
      {activeTab === "pharmacy" && renderPharmacyDashboard()}
      {activeTab === "nutrition" && renderNutritionDashboard()}
      {/* Other tab contents will be added here */}
    </div>
  );
};

export default Dashboard;
