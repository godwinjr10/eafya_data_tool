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

const MCHReport = ({ data, reportMonth, section }) => {
  const getSectionName = (sectionId) => {
    const sectionNames = {
      2.1: "Antenatal",
      2.2: "Maternity",
      2.3: "Postnatal",
      "2.4.1": "Family Planning",
      2.6: "Child Health Services",
      "2.6.2": "Tetanus Vaccination",
      "2.6.3": "Child Immunization",
      "2.6.4": "Vaccine Availability",
    };
    return sectionNames[sectionId] || "Unknown Section";
  };

  const renderAntenatalTable = (antenatalData) => {
    if (
      !antenatalData ||
      !Array.isArray(antenatalData) ||
      antenatalData.length === 0
    )
      return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 2.1: Antenatal</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>HMIS Code</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              Description
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              Below 15yrs
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>15-19yrs</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>20-24yrs</Text>
            <Text style={[styles.tableCell, { width: "14%" }]}>25-49yrs</Text>
          </View>
          {antenatalData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {item.hmis_code || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "30%" }]}>
                {item.hmis_name || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.Below_15yrs || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["15_19yrs"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["20_24yrs"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "14%" }]}>
                {item["25_49yrs"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPostnatalTable = (postnatalData) => {
    if (
      !postnatalData ||
      !Array.isArray(postnatalData) ||
      postnatalData.length === 0
    )
      return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 2.3: Postnatal</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>HMIS Code</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              Description
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              Below 15yrs
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>15-19yrs</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>20-24yrs</Text>
            <Text style={[styles.tableCell, { width: "14%" }]}>25-50yrs</Text>
          </View>
          {postnatalData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {item.hmis_code || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "30%" }]}>
                {item.hmis_name || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.below_15yrs || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["15_19yrs"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["20_24yrs"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "14%" }]}>
                {item["25_50yrs"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFamilyPlanningTable = (fpData) => {
    if (!fpData || !Array.isArray(fpData) || fpData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section 2.4.1: Family Planning</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "15%" }]}>HMIS Code</Text>
            <Text style={[styles.tableCell, { width: "35%" }]}>Method</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              Below 15yrs
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>15-19yrs</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>20-24yrs</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>25-49yrs</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>50+yrs</Text>
          </View>
          {fpData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.hmis_code || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "35%" }]}>
                {item.family_planning_name || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item.under_15_new || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["15_19_new"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["20_24_new"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["25_49_new"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["50_plus_new"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderChildHealthTable = (childHealthData) => {
    if (
      !childHealthData ||
      !Array.isArray(childHealthData) ||
      childHealthData.length === 0
    )
      return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Section 2.6: Child Health Services
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>HMIS Code</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>Service</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>0-5m Male</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              0-5m Female
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>6-11m Male</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              6-11m Female
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              12-59m Male
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              12-59m Female
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>5-14y Male</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>
              5-14y Female
            </Text>
          </View>
          {childHealthData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {item.vaccine_id || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "30%" }]}>
                {item.vaccine_name || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["0-5m Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["0-5m Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["6-11m Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["6-11m Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["12-59m Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["12-59m Female"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["5-14y Male"] || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {item["5-14y Female"] || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTetanusTable = (tetanusData) => {
    if (!tetanusData || !Array.isArray(tetanusData) || tetanusData.length === 0)
      return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Section 2.6.2: Tetanus Vaccination
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "15%" }]}>Code</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>Dose</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Pregnant</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              Non-Pregnant
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Outreach</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>School</Text>
          </View>
          {tetanusData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.code || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "20%" }]}>
                {item.label || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.pregnant?.Static || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.nonPregnant?.Static || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.nonPregnant?.Outreach || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {item.data?.nonPregnant?.School || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderImmunizationTable = (immunizationData) => {
    if (
      !immunizationData ||
      !Array.isArray(immunizationData) ||
      immunizationData.length === 0
    )
      return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Section 2.6.3: Child Immunization
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "15%" }]}>Code</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>Vaccine</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Under 1y</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>1-4y</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>5-14y</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Outreach</Text>
          </View>
          {immunizationData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.code || ""}
              </Text>
              <Text style={[styles.tableCellLeft, { width: "25%" }]}>
                {item.label || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.under1?.static || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.["1to4"]?.static || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.["5to14"]?.static || 0}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {item.data?.under1?.outreach || 0}
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
              HMIS 105:02 - OPD Monthly Report (MCH, FP, EPI)
            </Text>
            <Text style={styles.reportPeriod}>
              Report Period: {reportMonth}
            </Text>
            {section && (
              <Text style={styles.reportPeriod}>
                Section: {getSectionName(section)}
              </Text>
            )}
            {!section && (
              <Text style={styles.reportPeriod}>
                Complete MCH Report - All Sections
              </Text>
            )}
          </View>
        </View>

        {/* Render section-specific content */}
        {section === "2.1" && renderAntenatalTable(data?.antenatal || data)}
        {section === "2.3" && renderPostnatalTable(data?.postnatal || data)}
        {section === "2.4.1" &&
          renderFamilyPlanningTable(data?.familyPlanning || data)}
        {section === "2.6" && renderChildHealthTable(data?.childHealth || data)}
        {section === "2.6.2" && renderTetanusTable(data?.tetanus || data)}
        {section === "2.6.3" &&
          renderImmunizationTable(data?.immunization || data)}

        {/* Render all sections when no specific section is provided */}
        {!section && data && (
          <>
            {data.antenatal && renderAntenatalTable(data.antenatal)}
            {data.postnatal && renderPostnatalTable(data.postnatal)}
            {data.familyPlanning &&
              renderFamilyPlanningTable(data.familyPlanning)}
            {data.childHealth && renderChildHealthTable(data.childHealth)}
            {data.tetanus && renderTetanusTable(data.tetanus)}
            {data.immunization && renderImmunizationTable(data.immunization)}
          </>
        )}

        {/* Default message if no data */}
        {!data && (
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
      const filename = section
        ? `MCH_${getSectionName(section).replace(
            /\s+/g,
            "_"
          )}_${reportMonth}_${date.getFullYear()}_${
            date.getMonth() + 1
          }_${date.getDate()}.pdf`
        : `MCH_Complete_Report_${reportMonth}_${date.getFullYear()}_${
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
    if (data && reportMonth && section) {
      downloadPDF();
    }
  }, [data, reportMonth, section]);

  return null;
};

export default MCHReport;
