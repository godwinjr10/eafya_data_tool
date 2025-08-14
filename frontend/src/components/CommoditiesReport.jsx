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
  codeCell: {
    width: '10%',
  },
  nameCell: {
    width: '30%',
  },
  dataCell: {
    width: '15%',
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
      <Text>NAME OF DRUG ITEM</Text>
    </View>
    <View style={[styles.tableCell, styles.dataCell]}>
      <Text>Quantity Consumed</Text>
    </View>
    <View style={[styles.tableCell, styles.dataCell]}>
      <Text>Days out of stock</Text>
    </View>
    <View style={[styles.tableCell, styles.dataCell]}>
      <Text>Stock on hand</Text>
    </View>
    <View style={[styles.tableCell, styles.dataCell]}>
      <Text>Quantity Expired</Text>
    </View>
  </View>
);

const CommoditiesReport = ({ data, reportMonth }) => {
  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Ministry of Health</Text>
            <Text style={styles.subtitle}>HMIS 105:06 OPD Monthly Report (Essential Medicnes and Supplies)</Text>
            <Text style={styles.reportPeriod}>Report Period: {reportMonth}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <TableHeaders />
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.codeCell]}>
                <Text>{item.hmis_code}</Text>
              </View>
              <View style={[styles.tableCell, styles.nameCell]}>
                <Text>{item.hmis_name}</Text>
              </View>
              <View style={[styles.tableCell, styles.dataCell]}>
                <Text>{parseInt(item["Quantity Consumed"]) || '0'}</Text>
              </View>
              <View style={[styles.tableCell, styles.dataCell]}>
                <Text>{parseInt(item["Days out Stock"]) || '0'}</Text>
              </View>
              <View style={[styles.tableCell, styles.dataCell]}>
                <Text>{parseInt(item["stock on hand"]) || '0'}</Text>
              </View>
              <View style={[styles.tableCell, styles.dataCell]}>
                <Text>{parseInt(item["Quantity Expired"]) || '0'}</Text>
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
      const filename = `HMIS_Commodities_Report_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.pdf`;
      
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

export default CommoditiesReport; 