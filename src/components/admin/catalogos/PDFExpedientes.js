import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import {
  DataTableCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from '@david.kucsai/react-pdf-table';
import {
  PDFViewer,
  Document,
  Page,
  StyleSheet,
  View,
  Text,
  usePDF,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  title: {
    margin: 20,
    fontSize: 25,
    textAlign: 'center',
    backgroundColor: '#e4e4e4',
    textTransform: 'uppercase',
  },
  body: {
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  texttitular: {
    textAlign: 'left',
    marginLeft: '20px',
    marginBottom: '15px',
  },
  subtitle: {
    textAlign: 'left',
    marginLeft: '30px',
    position: 'relative',
    bottom: '250px',
    fontSize: 10,
    marginTop: '8px',
  },
  substwo: {
    position: 'relative',
    fontSize: 10,
    bottom: '200px',
    left: '300px',
  },
  tableheader: {
    backgroundColor: '#353535',
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
  },
  tablecell: {
    fontSize: 10,
    textAlign: 'center',
  },
  table: {
    marginBottom: 200,
  },
});

export const PDFtest = () => {
  return (
    <PDFViewer>
      <Document>
        <Page size="A4">
          <Text style={styles.title}>Documento prueba 2</Text>
          <View style={styles.body}>
            <View style={styles.row}></View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
