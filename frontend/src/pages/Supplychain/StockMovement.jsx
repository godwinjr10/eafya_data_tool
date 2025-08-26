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
  movementIdCell: {
    width: '10%',
  },
  productCell: {
    width: '25%',
  },
  quantityCell: {
    width: '15%',
  },
  typeCell: {
    width: '15%',
  },
  sourceCell: {
    width: '20%',
  },
  dateCell: {
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
    <View style={[styles.tableCell, styles.movementIdCell]}>
      <Text>Movement ID</Text>
    </View>
    <View style={[styles.tableCell, styles.productCell]}>
      <Text>Product</Text>
    </View>
    <View style={[styles.tableCell, styles.quantityCell]}>
      <Text>Quantity</Text>
    </View>
    <View style={[styles.tableCell, styles.typeCell]}>
      <Text>Movement Type</Text>
    </View>
    <View style={[styles.tableCell, styles.sourceCell]}>
      <Text>Source/Destination</Text>
    </View>
    <View style={[styles.tableCell, styles.dateCell]}>
      <Text>Date</Text>
    </View>
  </View>
);

const StockMovement = ({ data, reportPeriod }) => {
  const [facilityName, setFacilityName] = useState('');

  useEffect(() => {
    const fetchFacilityName = async () => {
      try {
        const response = await api.get('/facility?page=1&limit=1');
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
            <Text style={styles.subtitle}>Stock Movement Report</Text>
            <Text style={styles.reportPeriod}>Report Period: {reportPeriod}</Text>
          </View>
          <View style={styles.logoContainer} />
        </View>

        <View style={styles.table}>
          <TableHeaders />
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.movementIdCell]}>
                <Text>{item.movement_id}</Text>
              </View>
              <View style={[styles.tableCell, styles.productCell]}>
                <Text>{item.product_name || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.quantityCell]}>
                <Text>{item.quantity || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.typeCell]}>
                <Text>{item.movement_type || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.sourceCell]}>
                <Text>{item.source_destination || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.dateCell]}>
                <Text>{formatDate(item.movement_date) || '-'}</Text>
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
      const filename = `StockMovement_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.pdf`;
      
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

export default StockMovement;