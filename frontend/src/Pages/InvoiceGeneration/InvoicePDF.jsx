import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const PRIMARY = "#1E40AF"; // Solar Blue
const LIGHT_BG = "#F1F5F9";
const TABLE_HEADER = "#DBEAFE";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },

  /* ===== TITLE ===== */
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY,
    marginBottom: 10,
    letterSpacing: 1,
  },

  /* ===== HEADER ===== */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: `1 solid ${PRIMARY}`,
    backgroundColor: LIGHT_BG,
    padding: 10,
  },

  companyLeft: {
    width: "65%",
  },

  companyRight: {
    width: "30%",
    border: `1 solid ${PRIMARY}`,
  },

  companyName: {
    fontSize: 13,
    fontWeight: "bold",
    color: PRIMARY,
  },

  boxRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${PRIMARY}`,
  },

  boxLabel: {
    width: "50%",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: TABLE_HEADER,
    textAlign: "center",
  },

  boxValue: {
    width: "50%",
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
  },

  section: {
    marginTop: 12,
    padding: 8,
    border: "1 solid #CBD5E1",
    backgroundColor: "#F8FAFC",
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: PRIMARY,
  },

  /* ===== TABLE ===== */
  table: {
    border: "1 solid #CBD5E1",
    marginTop: 10,
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #CBD5E1",
    alignItems: "stretch",
  },

  th: {
    padding: 6,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: TABLE_HEADER,
    borderRight: "1 solid #CBD5E1",
  },

  td: {
    padding: 6,
    borderRight: "1 solid #CBD5E1",
  },

  colSr: { width: "6%" },
  colComp: { width: "28%" },
  colCap: { width: "36%" },
  colSpec: { width: "30%" },

  altRow: {
    backgroundColor: "#F9FAFB",
  },

  /* ===== TOTAL ===== */
  totalRow: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
  },

  totalLabel: {
    width: "70%",
    padding: 8,
    fontWeight: "bold",
    textAlign: "right",
    color: "#FFFFFF",
  },

  totalValue: {
    width: "30%",
    padding: 8,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },

  /* ===== FOOTER ===== */
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1 solid #CBD5E1",
    textAlign: "center",
    fontSize: 9,
    color: "#475569",
  },

  footerBold: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  signside: { marginTop: 50, marginBottom: 50, fontSize: 9 },
});

export function InvoicePDF({ invoice }) {
  if (!invoice) {
    return (
      <Document>
        <Page size="A4">
          <Text>Loading invoice...</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* TITLE */}
        <Text style={styles.title}>TAX INVOICE</Text>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.companyLeft}>
            <Text style={styles.companyName}>TEJASWINI SALES</Text>
            <Text>Sales & Service</Text>
            <Text>Behind Savarkar Statue,</Text>
            <Text>Near Shriram Mangal Karyalay,</Text>
            <Text>Deopur, Dhule – 424002</Text>
            <Text>+91 9765312906</Text>
            <Text>tejaswinisolarenergy@gmail.com</Text>
          </View>

          <View style={styles.companyRight}>
            <View style={styles.boxRow}>
              <Text style={styles.boxLabel}>DATE</Text>
              <Text style={styles.boxValue}>{invoice.date}</Text>
            </View>
            <View style={styles.boxRow}>
              <Text style={styles.boxLabel}>INVOICE NO</Text>
              <Text style={styles.boxValue}>{invoice.invoiceNo}</Text>
            </View>
          </View>
        </View>
        {/* CUSTOMER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text>Name: {invoice.customerName}</Text>
          <Text>Address: {invoice.customerAddress}</Text>
          <Text>Consumer No: {invoice.ConsumberNo}</Text>
        </View>
        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.th, styles.colSr]}>Sr</Text>
            <Text style={[styles.th, styles.colComp]}>Component</Text>
            <Text style={[styles.th, styles.colCap]}>Capacity</Text>
            <Text style={[styles.th, styles.colSpec]}>Specification</Text>
          </View>

          {invoice.items.map((item, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 1 && styles.altRow]}
            >
              <Text style={[styles.td, styles.colSr]}>{i + 1}</Text>
              <Text style={[styles.td, styles.colComp]}>{item.component}</Text>

              <View style={[styles.td, styles.colCap]}>
                <Text>{item.capacity.text}</Text>
                {item.capacity.serials?.map((sn, idx) => (
                  <Text key={idx}>• {sn}</Text>
                ))}
              </View>

              <Text style={[styles.td, styles.colSpec]}>{item.spec}</Text>
            </View>
          ))}

          {/* TOTAL */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL PROJECT COST</Text>
            <Text style={styles.totalValue}>{invoice.total}</Text>
          </View>
        </View>
        {/* FOOTER */}{" "}
        <View style={styles.signside}>
          {" "}
          <Text>(SIGNED AND STAMP)</Text>{" "}
        </View>
        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBold}>
            This is a system generated invoice
          </Text>
        </View>
      </Page>
    </Document>
  );
}
