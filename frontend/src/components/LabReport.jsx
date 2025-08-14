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
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  codeCell: {
    width: '10%',
  },
  nameCell: {
    width: '35%',
  },
  testNameCell: {
    width: '35%',
  },
  dataCell: {
    width: '10%',
    textAlign: 'center',
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

const TableHeaders = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
    <View style={[styles.tableCell, styles.codeCell]}>
      <Text>HMIS Code</Text>
    </View>
    <View style={[styles.tableCell, styles.nameCell]}>
      <Text>HMIS Name</Text>
    </View>
    <View style={[styles.tableCell, styles.testNameCell]}>
      <Text>Lab Test Name</Text>
    </View>
    <View style={[styles.tableCell, styles.dataCell]}>
      <Text>Total Cases</Text>
    </View>
    <View style={[styles.tableCell, styles.dataCell]}>
      <Text>Positive Cases</Text>
    </View>
  </View>
);

const LabReport = ({ data, reportMonth }) => {
  // Group data by category
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Ministry of Health</Text>
            <Text style={styles.subtitle}>HMIS 105:10 Laboratory Tests Report</Text>
            <Text style={styles.reportPeriod}>Report Period: {reportMonth}</Text>
          </View>
        </View>

        {Object.entries(groupedData).map(([category, tests], index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <View style={styles.table}>
              <TableHeaders />
              {tests.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.codeCell]}>
                    <Text>{item.hmis_code}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.nameCell]}>
                    <Text>{item.hmis_name}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.testNameCell]}>
                    <Text>{item.lab_test_name}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.dataCell]}>
                    <Text>{parseInt(item.total_cases) || '0'}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.dataCell]}>
                    <Text>{parseInt(item.positive_cases) || '0'}</Text>
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
      const filename = `HMIS_Lab_Tests_Report_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.pdf`;
      
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

export default LabReport; 