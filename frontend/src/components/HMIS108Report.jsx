import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import logo from "./logo.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    marginLeft: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  reportPeriod: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellLeft: {
    padding: 5,
    fontSize: 10,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const HMIS108Report = ({ data, reportMonth }) => {
  const getSectionName = (sectionId) => {
    const sectionNames = {
      1: "Census Information",
      3: "Surgical Procedures",
      4: "Utilization of Special Services",
      5: "Radiology and Imaging",
      6: "Admissions Deaths by Diagnosis",
      7: "Mental Health, Risk Behaviour TB",
      8: "Neonatal Services",
      9: "Maternal Conditions",
      10: "Nutrition",
      11: "Rehabilitation",
    };
    return sectionNames[sectionId] || "Unknown Section";
  };

  const renderCensusTable = (censusData) => {
    if (!censusData || censusData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 1: Census Information</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>Ward</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Beds</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Admissions</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Deaths</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>
              Patient Days
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              Avg Length of Stay
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              Avg Occupancy
            </Text>
            <Text style={[styles.tableCell, { width: "13%" }]}>
              Bed Occupancy %
            </Text>
          </View>
          {censusData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, { width: "20%" }]}>
                {item.Wards || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {item["A Cl01. No. of beds"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {item["B Cl02. No. of admissions"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {item["C Cl03. No. of deaths"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {item["D Cl04. Patient days"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item["E Cl05. Average length of stay (E=D/B)"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["F Cl06. Average occupancy (F=D/30 days)"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "13%" }]}>
                {item["G Cl07. Bed occupancy (F/A)x100"] || 0}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSurgicalTable = (surgicalData) => {
    if (!surgicalData || surgicalData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 3: Surgical Procedures</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "15%" }]}>Section</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Code</Text>
            <Text style={[styles.tableCell, { width: "40%" }]}>Procedure</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              Report Month
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>Count</Text>
          </View>
          {surgicalData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.section || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {item.code || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "40%" }]}>
                {item.procedure || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.report_month || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {item.procedure_count || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRadiologyTable = (radiologyData) => {
    if (!radiologyData || radiologyData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Section 5: Radiology and Imaging
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>Category</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              Imaging Type
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>0-4Y Male</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              0-4Y Female
            </Text>
            <Text style={[styles.tableCell, { width: "13%" }]}>5+Y Male</Text>
            <Text style={[styles.tableCell, { width: "13%" }]}>5+Y Female</Text>
          </View>
          {radiologyData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, { width: "20%" }]}>
                {item.category_name || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "30%" }]}>
                {item.imaging_name || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.male_0_4 || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.female_0_4 || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "13%" }]}>
                {item.male_5_plus || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "13%" }]}>
                {item.female_5_plus || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAdmissionsTable = (admissionsData) => {
    if (!admissionsData || admissionsData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Section 6: Admissions Deaths by Diagnosis
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "25%" }]}>Diagnosis</Text>
            <Text style={[styles.tableCell, { width: "9%" }]}>
              0-4Y M Cases
            </Text>
            <Text style={[styles.tableCell, { width: "9%" }]}>
              0-4Y F Cases
            </Text>
            <Text style={[styles.tableCell, { width: "9%" }]}>5+Y M Cases</Text>
            <Text style={[styles.tableCell, { width: "9%" }]}>5+Y F Cases</Text>
            <Text style={[styles.tableCell, { width: "9%" }]}>
              0-4Y M Deaths
            </Text>
            <Text style={[styles.tableCell, { width: "9%" }]}>
              0-4Y F Deaths
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              5+Y M Deaths
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              5+Y F Deaths
            </Text>
          </View>
          {admissionsData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, { width: "25%" }]}>
                {item.diagnosis || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>
                {item["0-4years Male Cases"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>
                {item["0-4years female Cases"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>
                {item["5years+ Male Cases"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>
                {item["5years+ female Cases"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>
                {item["0-4years Male Deaths"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>
                {item["0-4years female Deaths"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["5years+ Male Deaths"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["5years+ female Deaths"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMentalHealthTable = (mentalHealthData) => {
    if (!mentalHealthData || mentalHealthData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Section 7: Mental Health, Risk Behaviour TB
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>Diagnosis</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>{"<5Y M"}</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>{"<5Y F"}</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>5-9Y M</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>5-9Y F</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>10-19Y M</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>10-19Y F</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>20-34Y M</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>20-34Y F</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>35-59Y M</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>35-59Y F</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>60+Y M</Text>
            <Text style={[styles.tableCell, { width: "6%" }]}>60+Y F</Text>
          </View>
          {mentalHealthData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, { width: "20%" }]}>
                {item.diagnosis || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["<5Y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["<5Y Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["5-9Y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["5-9Y Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["10-19Y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["10-19Y Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["20-34Y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["20-34Y Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["35-59Y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["35-59Y Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["60+Y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {item["60+Y Female"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderNeonatalTable = (neonatalData) => {
    if (!neonatalData || neonatalData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 8: Neonatal Services</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              Report Month
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              Cases 0-7d Total
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              {"Cases 0-7d <2.5kg"}
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              Cases 8-28d Total
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              {"Cases 8-28d <2.5kg"}
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              Deaths 0-7d Total
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              {"Deaths 0-7d <2.5kg"}
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              Deaths 8-28d Total
            </Text>
            <Text style={[styles.tableCell, { width: "11%" }]}>
              {"Deaths 8-28d <2.5kg"}
            </Text>
          </View>
          {neonatalData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.report_month || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Cases 0-7 days Total"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Cases 0-7 days <2.5kg"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Cases 8-28 days Total"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Cases 8-28 days <2.5kg"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Deaths 0-7 days Total"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Deaths 0-7 days <2.5kg"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Deaths 8-28 days Total"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "11%" }]}>
                {item["Deaths 8-28 days <2.5kg"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMaternalTable = (maternalData) => {
    if (!maternalData || maternalData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 9: Maternal Conditions</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              Report Month
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>Disease ID</Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              {"Cases <15Y"}
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              Cases 15-19Y
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              Cases 20-24Y
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              Cases 25-49Y
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>Cases 50+Y</Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              {"Deaths <15Y"}
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              Deaths 15-19Y
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              Deaths 20-24Y
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              Deaths 25-49Y
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>Deaths 50+Y</Text>
          </View>
          {maternalData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.report_month || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item.disease_id || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Cases Below 15 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Cases 15-19 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Cases 20-24 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Cases 25-49 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Cases 50+ Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Deaths Below 15 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Deaths 15-19 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Deaths 20-24 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Deaths 25-49 Years"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                {item["Deaths 50+ Years"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Ministry of Health</Text>
            <Text style={styles.subtitle}>
              HMIS 108 - Inpatient Monthly Report
            </Text>
            <Text style={styles.reportPeriod}>
              Report Period: {reportMonth}
            </Text>
          </View>
        </View>

        {/* Render all sections with data */}
        {renderCensusTable(data.census)}
        {renderSurgicalTable(data.surgical)}
        {renderRadiologyTable(data.radiology)}
        {renderAdmissionsTable(data.admissions)}
        {renderMentalHealthTable(data.mentalHealth)}
        {renderNeonatalTable(data.neonatal)}
        {renderMaternalTable(data.maternal)}

        {/* Placeholder sections for sections without data */}
        {(!data.census || data.census.length === 0) &&
          (!data.surgical || data.surgical.length === 0) &&
          (!data.radiology || data.radiology.length === 0) &&
          (!data.admissions || data.admissions.length === 0) &&
          (!data.mentalHealth || data.mentalHealth.length === 0) &&
          (!data.neonatal || data.neonatal.length === 0) &&
          (!data.maternal || data.maternal.length === 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                No data available for the selected period
              </Text>
            </View>
          )}

        <View style={styles.footer}>
          <Text>{new Date().toLocaleString()}</Text>
          <Text>eAFYA System Generated Report</Text>
        </View>
      </Page>
    </Document>
  );

  const downloadPDF = async () => {
    try {
      const blob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const date = new Date();
      const filename = `HMIS108_Complete_Report_${reportMonth}_${date.getFullYear()}_${
        date.getMonth() + 1
      }_${date.getDate()}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  React.useEffect(() => {
    if (data && reportMonth) {
      downloadPDF();
    }
  }, [data, reportMonth]);

  return null;
};

export default HMIS108Report;
