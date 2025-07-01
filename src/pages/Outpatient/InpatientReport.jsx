import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import logo from '../../components/logo.png';

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
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
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
  idCell: {
    width: '10%',
  },
  textCell: {
    width: '15%',
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
    <View style={[styles.tableCell, styles.idCell]}>
      <Text>Patient ID</Text>
    </View>
    <View style={[styles.tableCell, styles.textCell]}>
      <Text>Age</Text>
    </View>
    <View style={[styles.tableCell, styles.textCell]}>
      <Text>Gender</Text>
    </View>
    <View style={[styles.tableCell, styles.textCell]}>
      <Text>Ward</Text>
    </View>
    <View style={[styles.tableCell, styles.textCell]}>
      <Text>Admission Date</Text>
    </View>
    <View style={[styles.tableCell, styles.textCell]}>
      <Text>Discharge Date</Text>
    </View>
    <View style={[styles.tableCell, styles.textCell]}>
      <Text>Diagnosis</Text>
    </View>
  </View>
);

const InpatientReport = ({ data, reportPeriod }) => {
  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Ministry of Health</Text>
            <Text style={styles.subtitle}>Inpatient Register Report</Text>
            <Text style={styles.reportPeriod}>Report Period: {reportPeriod}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <TableHeaders />
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.idCell]}>
                <Text>{item.patient_id}</Text>
              </View>
              <View style={[styles.tableCell, styles.textCell]}>
                <Text>{item.age || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.textCell]}>
                <Text>{item.gender || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.textCell]}>
                <Text>{item.admission_ward_name || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.textCell]}>
                <Text>{item.date_created ? new Date(item.date_created).toLocaleDateString() : '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.textCell]}>
                <Text>{item.medical_discharge_date ? new Date(item.medical_discharge_date).toLocaleDateString() : '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.textCell]}>
                <Text>{item.diagnosis || '-'}</Text>
              </View>
            </View>
          ))}
        </View>

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
      const filename = `Inpatient_Register_Report_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.pdf`;
      
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

export default InpatientReport; 