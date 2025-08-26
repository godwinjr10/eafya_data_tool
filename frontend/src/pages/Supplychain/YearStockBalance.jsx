import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import logo from '../../components/logo.png';
import api from '../../helpers/api';

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
    width: '100%',
  },
  logoContainer: {
    width: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  facilityName: {
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  reportPeriod: {
    fontSize: 12,
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
  monthCell: {
    width: '10%',
  },
  storeCell: {
    width: '20%',
  },
  productCell: {
    width: '30%',
  },
  levelCell: {
    width: '20%',
  },
  dateCell: {
    width: '20%',
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
    <View style={[styles.tableCell, styles.monthCell]}>
      <Text>Month</Text>
    </View>
    <View style={[styles.tableCell, styles.storeCell]}>
      <Text>Store</Text>
    </View>
    <View style={[styles.tableCell, styles.productCell]}>
      <Text>Product</Text>
    </View>
    <View style={[styles.tableCell, styles.levelCell]}>
      <Text>Stock Level</Text>
    </View>
    <View style={[styles.tableCell, styles.dateCell]}>
      <Text>Last Update</Text>
    </View>
  </View>
);

const YearStockBalance = ({ data, reportPeriod }) => {
  const [facilityName, setFacilityName] = useState('');

  useEffect(() => {
    const fetchFacilityName = async () => {
      try {
        const response = await api.get('/facility?page=1&limit=1');
        console.log(response.data.facility);
        if (response.data.facility && response.data.facility.length > 0) {
          setFacilityName(response.data.facility[0].facility_name);
        }
      } catch (error) {
        console.error('Error fetching facility name:', error);
      }
    };
    fetchFacilityName();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} src={logo} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Ministry of Health</Text>
            <Text style={styles.facilityName}>{facilityName}</Text>
            <Text style={styles.subtitle}>End of Year Stock Balance Report</Text>
            <Text style={styles.reportPeriod}>Report Period: {reportPeriod}</Text>
          </View>
          <View style={styles.logoContainer} />
        </View>

        <View style={styles.table}>
          <TableHeaders />
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.monthCell]}>
                <Text>{item.report_month}</Text>
              </View>
              <View style={[styles.tableCell, styles.storeCell]}>
                <Text>{item.store_name || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.productCell]}>
                <Text>{item.product_name || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.levelCell]}>
                <Text>{item.stock_level || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.dateCell]}>
                <Text>{formatDate(item.last_update) || '-'}</Text>
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
      const filename = `YearStockBalance${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.pdf`;
      
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

  useEffect(() => {
    downloadPDF();
  }, []); // Empty dependency array means this runs once when component mounts

  return null;
};

export default YearStockBalance; 