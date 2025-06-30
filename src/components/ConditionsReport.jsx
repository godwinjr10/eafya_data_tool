import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import logo from './logo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableHeaderGroup: {
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  tableHeaderGroupTitle: {
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  genderRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  diagnosisCell: {
    width: '25%',
    textAlign: 'left',
  },
  genderCell: {
    width: '7.5%',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const columnGroups = [
  { title: '0-28 days', cols: ['M', 'F'] },
  { title: '29days - 4Yrs', cols: ['M', 'F'] },
  { title: '5 - 9Yrs', cols: ['M', 'F'] },
  { title: '10 - 19Yrs', cols: ['M', 'F'] },
  { title: '20Yrs & above', cols: ['M', 'F'] }
];

const TableHeaders = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
    <View style={[styles.tableCell, styles.diagnosisCell]}>
      <Text>Diagnosis</Text>
    </View>
    {columnGroups.map((group, groupIndex) => (
      <View key={groupIndex} style={[styles.tableHeaderGroup, { width: '15%' }]}>
        <Text style={styles.tableHeaderGroupTitle}>{group.title}</Text>
        <View style={styles.genderRow}>
          {group.cols.map((col, colIndex) => (
            <View key={`${groupIndex}-${colIndex}`} style={[styles.tableCell, { width: '50%' }]}>
              <Text>{col}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}
  </View>
);

const ConditionsReport = ({ data, reportMonth }) => {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.section_name]) {
      acc[item.section_name] = [];
    }
    acc[item.section_name].push(item);
    return acc;
  }, {});

  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Ministry of Health</Text>
            <Text style={styles.subtitle}>HMIS 105:01 OPD Monthly Report (Attendance, Referrals & Conditions)</Text>
            <Text style={styles.reportPeriod}>Report Period: {reportMonth}</Text>
          </View>
        </View>

        {Object.entries(groupedData).map(([sectionName, sectionData], sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionName}</Text>
            <View style={styles.table}>
              <TableHeaders />
              {sectionData.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.diagnosisCell]}>
                    <Text>{`${row.hmis_code}. ${row.hmis_name}`}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['0_28d_male'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['0_28d_female'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['29d_4y_male'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['29d_4y_female'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['5_9y_male'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['5_9y_female'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['10_19y_male'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['10_19y_female'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['20y_plus_male'] || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.genderCell]}>
                    <Text>{row['20y_plus_female'] || '0'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

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
      const filename = `HMIS_Report_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  React.useEffect(() => {
    downloadPDF();
  }, []); // Empty dependency array means this runs once when component mounts

  return null;
};

export default ConditionsReport; 