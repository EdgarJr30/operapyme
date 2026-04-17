import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";

import type { ThemePaletteDefinition } from "@operapyme/ui";

import type { InvoiceDetail } from "@/lib/supabase/backoffice-data";
import {
  calculateDocumentCalculationBreakdown,
  calculateQuoteDocumentDiscountPercentFromAmount,
  calculateQuoteLineDiscountPercentFromAmount,
  calculateQuoteDocumentDiscountTotalFromCombinedDiscount,
  calculateQuoteLineDiscountTotal
} from "@/lib/forms/quote-line-discounts";

export interface InvoicePdfDocumentProps {
  generatedAt: string;
  issuerAddress?: string | null;
  issuerBankAccounts?: Array<{ bank: string; account: string }> | null;
  issuerCedula?: string | null;
  issuerEmail?: string | null;
  issuerName: string;
  issuerPhone?: string | null;
  issuerRnc?: string | null;
  issuerSecondaryPhone?: string | null;
  issuerWebsiteUrl?: string | null;
  logoUrl?: string | null;
  watermarkUrl?: string | null;
  palette: ThemePaletteDefinition;
  invoice: InvoiceDetail;
}

export function InvoicePdfDocument({
  generatedAt,
  issuerAddress,
  issuerBankAccounts,
  issuerCedula,
  issuerEmail,
  issuerName,
  issuerPhone,
  issuerRnc,
  issuerSecondaryPhone,
  issuerWebsiteUrl,
  logoUrl,
  watermarkUrl,
  palette,
  invoice
}: InvoicePdfDocumentProps) {
  const styles = createStyles(palette);
  const lineDiscountTotal = calculateQuoteLineDiscountTotal(invoice.lineItems);
  const documentDiscountTotal = calculateQuoteDocumentDiscountTotalFromCombinedDiscount({
    lineItems: invoice.lineItems,
    totalDiscount: invoice.discountTotal
  });
  const documentDiscountPercent = calculateQuoteDocumentDiscountPercentFromAmount({
    discountTotal: documentDiscountTotal,
    lineItems: invoice.lineItems
  });
  const documentCalculation = calculateDocumentCalculationBreakdown({
    lineItems: invoice.lineItems,
    documentDiscountTotal,
    discountApplicationMode: invoice.discountApplicationMode
  });

  return (
    <Document
      author="OperaPyme"
      creator="OperaPyme"
      title={`${invoice.invoiceNumber} - ${invoice.title}`}
      subject={invoice.title}
    >
      <Page size="A4" style={styles.page}>
        {/* Top accent bar */}
        <View style={styles.accentBar} fixed />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            {logoUrl && !logoUrl.toLowerCase().includes(".svg") ? (
              <Image style={styles.logo} src={logoUrl} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>
                  {issuerName.slice(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.brandCopy}>
              <Text style={styles.eyebrow}>Factura documental</Text>
              <Text style={styles.issuerName}>{issuerName}</Text>
              <View style={styles.issuerMetaGrid}>
                {issuerAddress ? (
                  <Text style={styles.issuerMeta}>{issuerAddress}</Text>
                ) : null}
                {issuerPhone ? (
                  <Text style={styles.issuerMeta}>Tel: {issuerPhone}</Text>
                ) : null}
                {issuerSecondaryPhone ? (
                  <Text style={styles.issuerMeta}>
                    Tel 2: {issuerSecondaryPhone}
                  </Text>
                ) : null}
                {issuerEmail ? (
                  <Text style={styles.issuerMetaFull}>Correo: {issuerEmail}</Text>
                ) : null}
                {issuerWebsiteUrl ? (
                  <Text style={styles.issuerMetaFull}>Web: {issuerWebsiteUrl}</Text>
                ) : null}
                {issuerRnc ? (
                  <Text style={styles.issuerMeta}>RNC: {issuerRnc}</Text>
                ) : null}
                {issuerCedula ? (
                  <Text style={styles.issuerMeta}>Cédula: {issuerCedula}</Text>
                ) : null}
              </View>
              <Text style={styles.documentTitle}>{invoice.title}</Text>
            </View>
          </View>

          <View style={styles.metaCard}>
            <MetaRow label="Numero" value={invoice.invoiceNumber} styles={styles} accent />
            <MetaRow
              label="Emitida"
              value={invoice.issuedOn ? formatDate(invoice.issuedOn) : "Sin fecha"}
              styles={styles}
            />
            <MetaRow
              label="Vence"
              value={invoice.dueOn ? formatDate(invoice.dueOn) : "Sin fecha"}
              styles={styles}
            />
            <MetaRow label="Estado" value={formatStatus(invoice.status)} styles={styles} />
          </View>
        </View>

        {/* Recipient section */}
        <View style={styles.recipientSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Receptor</Text>
            <Text style={styles.sectionSubtitle}>
              {formatRecipientKind(invoice.recipientKind)}
            </Text>
          </View>
          <View style={styles.recipientGrid}>
            <RecipientField
              label="Empresa o referencia"
              value={invoice.recipientDisplayName}
              styles={styles}
            />
            <RecipientField
              label="Contacto"
              value={invoice.recipientContactName ?? "No especificado"}
              styles={styles}
            />
            <RecipientField
              label="Correo"
              value={invoice.recipientEmail ?? "No especificado"}
              styles={styles}
            />
            <RecipientField
              label="WhatsApp"
              value={invoice.recipientWhatsApp ?? "No especificado"}
              styles={styles}
            />
            <RecipientField
              label="Telefono"
              value={invoice.recipientPhone ?? "No especificado"}
              styles={styles}
            />
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableShell}>
            <View style={styles.tableHeaderRow}>
              <Cell text="Detalle" flex={4.5} styles={styles} header />
              <Cell text="Cant." flex={0.65} styles={styles} header />
              <Cell text="Precio" flex={0.85} styles={styles} header />
              <Cell text="Desc." flex={0.75} styles={styles} header />
              <Cell text="Impuesto" flex={0.8} styles={styles} header />
              <Cell text="Total" flex={0.95} styles={styles} header last />
            </View>

            {invoice.lineItems.map((lineItem, index) => (
              <View
                key={lineItem.id}
                style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <View style={[styles.cell, { flex: 4.5 }]}>
                  <Text style={styles.lineTitle}>{lineItem.itemName}</Text>
                  {lineItem.itemDescription ? (
                    <Text style={styles.lineDescription}>{lineItem.itemDescription}</Text>
                  ) : null}
                  {lineItem.unitLabel ? (
                    <Text style={styles.lineMeta}>Unidad: {lineItem.unitLabel}</Text>
                  ) : null}
                </View>
                <Cell
                  text={formatNumber(lineItem.quantity)}
                  flex={0.65}
                  styles={styles}
                  alt={index % 2 === 1}
                />
                <Cell
                  text={formatCurrency(lineItem.unitPrice, invoice.currencyCode)}
                  flex={0.85}
                  styles={styles}
                  alt={index % 2 === 1}
                />
              <Cell
                text={formatPercent(
                  calculateQuoteLineDiscountPercentFromAmount({
                    discountTotal: lineItem.discountTotal,
                    quantity: lineItem.quantity,
                    unitPrice: lineItem.unitPrice
                  })
                )}
                flex={0.75}
                styles={styles}
                alt={index % 2 === 1}
                />
                <Cell
                  text={formatCurrency(lineItem.taxTotal, invoice.currencyCode)}
                  flex={0.8}
                  styles={styles}
                  alt={index % 2 === 1}
                />
                <Cell
                  text={formatCurrency(lineItem.lineTotal, invoice.currencyCode)}
                  flex={0.95}
                  styles={styles}
                  alt={index % 2 === 1}
                  last
                />
              </View>
            ))}
          </View>
        </View>

        {/* Footer area: notes + totals */}
        <View style={styles.footerArea} wrap={false}>
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas y condiciones</Text>
            <Text style={styles.notesBody}>
              {invoice.notes?.trim() || "Sin notas adicionales para esta factura."}
            </Text>
          </View>

          <View style={styles.totalsCard}>
            <MetaRow
              label="Subtotal"
              value={formatCurrency(documentCalculation.subtotal, invoice.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Descuentos por linea"
              value={formatCurrency(lineDiscountTotal, invoice.currencyCode)}
              styles={styles}
            />
            {invoice.discountApplicationMode === "before_tax" ? (
              <>
                <MetaRow
                  label={`Descuento global (${formatPercent(documentDiscountPercent)})`}
                  value={`-${formatCurrency(
                    documentCalculation.documentDiscountTotal,
                    invoice.currencyCode
                  )}`}
                  styles={styles}
                />
                <MetaRow
                  label="Base imponible"
                  value={formatCurrency(
                    documentCalculation.baseImponible,
                    invoice.currencyCode
                  )}
                  styles={styles}
                />
                <MetaRow
                  label="Impuestos"
                  value={formatCurrency(
                    documentCalculation.taxTotal,
                    invoice.currencyCode
                  )}
                  styles={styles}
                />
              </>
            ) : (
              <>
                <MetaRow
                  label="Impuestos"
                  value={formatCurrency(
                    documentCalculation.taxTotal,
                    invoice.currencyCode
                  )}
                  styles={styles}
                />
                <MetaRow
                  label="Total antes de descuento"
                  value={formatCurrency(
                    documentCalculation.totalBeforeDocumentDiscount,
                    invoice.currencyCode
                  )}
                  styles={styles}
                />
                <MetaRow
                  label={`Descuento comercial (${formatPercent(documentDiscountPercent)})`}
                  value={`-${formatCurrency(
                    documentCalculation.documentDiscountTotal,
                    invoice.currencyCode
                  )}`}
                  styles={styles}
                />
              </>
            )}
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(documentCalculation.total, invoice.currencyCode)}
              </Text>
            </View>
          </View>
        </View>

        {issuerBankAccounts && issuerBankAccounts.length > 0 ? (
          <View style={styles.bankDetailsSection} wrap={false}>
            <Text style={styles.bankDetailsTitle}>
              Cuentas para transferencias bancarias
            </Text>
            <View style={styles.bankDetailsTable}>
              {issuerBankAccounts.map((entry, index) => (
                <View key={index} style={styles.bankDetailsRow}>
                  <View style={[styles.bankDetailsCell, styles.bankDetailsBankCell]}>
                    <Text style={styles.bankDetailsLabel}>Banco</Text>
                    <Text style={styles.bankDetailsValue}>{entry.bank}</Text>
                  </View>
                  <View style={styles.bankDetailsCell}>
                    <Text style={styles.bankDetailsLabel}>Cuenta</Text>
                    <Text style={styles.bankDetailsValue}>{entry.account}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Document footer — always at bottom */}
        <View style={styles.docFooter} fixed>
          <View style={styles.docFooterDivider} />
          <View style={styles.docFooterRow}>
            <Text style={styles.docFooterText}>
              Generado el {formatDateTime(generatedAt)}
            </Text>
            {watermarkUrl ? (
              <Image style={styles.docFooterLogo} src={watermarkUrl} />
            ) : (
              <Text style={styles.docFooterText}>OperaPyme</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

function createStyles(palette: ThemePaletteDefinition) {
  return StyleSheet.create({
    page: {
      paddingTop: 30,
      paddingRight: 30,
      paddingBottom: 48,
      paddingLeft: 30,
      backgroundColor: palette.colors.paper,
      color: palette.colors.ink,
      fontSize: 10
    },
    accentBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: palette.colors.primary400
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
      alignItems: "flex-start"
    },
    brandBlock: {
      flexDirection: "row",
      gap: 14,
      flex: 1,
      alignItems: "flex-start"
    },
    logo: {
      width: 66,
      height: 66,
      objectFit: "contain"
    },
    logoFallback: {
      width: 66,
      height: 66,
      borderRadius: 12,
      backgroundColor: palette.colors.primary300,
      alignItems: "center",
      justifyContent: "center"
    },
    logoFallbackText: {
      fontSize: 20,
      fontWeight: 700,
      color: palette.colors.ink
    },
    brandCopy: {
      gap: 3,
      flex: 1,
      paddingTop: 2
    },
    eyebrow: {
      color: palette.colors.primary400,
      fontSize: 8.5,
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: 0.8
    },
    issuerName: {
      fontSize: 17,
      fontWeight: 700,
      lineHeight: 1.2
    },
    issuerMetaGrid: {
      flexDirection: "column",
      marginTop: 3,
      gap: 2
    },
    issuerMeta: {
      color: palette.colors.inkSoft,
      fontSize: 8.75,
      lineHeight: 1.32
    },
    issuerMetaFull: {
      color: palette.colors.inkSoft,
      fontSize: 8.75,
      lineHeight: 1.32
    },
    documentTitle: {
      marginTop: 4,
      fontSize: 11,
      color: palette.colors.inkSoft
    },
    metaCard: {
      width: 166,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 12,
      gap: 7
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8
    },
    metaLabel: {
      color: palette.colors.inkMuted,
      fontSize: 8.25
    },
    metaValue: {
      color: palette.colors.ink,
      fontSize: 8.75,
      fontWeight: 600,
      textAlign: "right"
    },
    metaValueAccent: {
      color: palette.colors.primary400,
      fontSize: 9.25,
      fontWeight: 700,
      textAlign: "right"
    },
    recipientSection: {
      marginTop: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      paddingTop: 12,
      paddingRight: 14,
      paddingBottom: 12,
      paddingLeft: 14,
      gap: 10
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 700
    },
    sectionSubtitle: {
      fontSize: 8,
      color: palette.colors.inkSoft,
      backgroundColor: palette.colors.primary200,
      paddingTop: 1.5,
      paddingBottom: 1.5,
      paddingLeft: 6,
      paddingRight: 6,
      borderRadius: 20
    },
    recipientGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 10,
      columnGap: 12
    },
    recipientField: {
      width: "48.3%",
      gap: 2
    },
    fieldLabel: {
      fontSize: 7.2,
      color: palette.colors.inkMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4
    },
    fieldValue: {
      fontSize: 8.9,
      color: palette.colors.ink,
      lineHeight: 1.22
    },
    tableWrapper: {
      marginTop: 16,
      borderWidth: 1,
      borderColor: palette.colors.line,
      borderRadius: 14
    },
    tableShell: {
      borderRadius: 13,
      overflow: "hidden"
    },
    tableHeaderRow: {
      flexDirection: "row",
      backgroundColor: palette.colors.primary400,
      borderTopLeftRadius: 13,
      borderTopRightRadius: 13
    },
    tableRow: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: palette.colors.line,
      backgroundColor: "#ffffff"
    },
    tableRowAlt: {
      backgroundColor: palette.colors.sand
    },
    cell: {
      paddingTop: 8,
      paddingRight: 7,
      paddingBottom: 8,
      paddingLeft: 7,
      borderRightWidth: 1,
      borderRightColor: palette.colors.line,
      justifyContent: "flex-start"
    },
    cellLast: {
      borderRightWidth: 0
    },
    cellHeaderText: {
      fontSize: 7.6,
      fontWeight: 700,
      color: "#ffffff"
    },
    cellText: {
      fontSize: 8.3,
      color: palette.colors.ink
    },
    lineTitle: {
      fontSize: 9.1,
      fontWeight: 700
    },
    lineDescription: {
      marginTop: 2,
      fontSize: 8.15,
      lineHeight: 1.28,
      color: palette.colors.inkSoft
    },
    lineMeta: {
      marginTop: 2,
      fontSize: 7.7,
      color: palette.colors.inkMuted
    },
    footerArea: {
      marginTop: 16,
      flexDirection: "row",
      gap: 12,
      alignItems: "stretch"
    },
    notesCard: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 12,
      gap: 6
    },
    notesTitle: {
      fontSize: 9.2,
      fontWeight: 700
    },
    notesBody: {
      fontSize: 8.2,
      color: palette.colors.inkSoft,
      lineHeight: 1.34
    },
    totalsCard: {
      width: 200,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 12,
      gap: 7
    },
    totalDivider: {
      height: 1,
      backgroundColor: palette.colors.line,
      marginTop: 4,
      marginBottom: 4
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8
    },
    totalLabel: {
      fontSize: 11.5,
      fontWeight: 700
    },
    totalValue: {
      fontSize: 11.5,
      fontWeight: 700,
      color: palette.colors.primary400
    },
    bankDetailsSection: {
      marginTop: 14,
      borderLeftWidth: 3,
      borderLeftColor: palette.colors.primary400,
      paddingLeft: 10,
      gap: 6
    },
    bankDetailsTitle: {
      fontSize: 9.2,
      fontWeight: 700,
      color: palette.colors.ink
    },
    bankDetailsTable: {
      gap: 4
    },
    bankDetailsRow: {
      flexDirection: "row",
      gap: 18
    },
    bankDetailsCell: {
      flex: 1,
      gap: 2
    },
    bankDetailsBankCell: {
      flex: 1.1
    },
    bankDetailsLabel: {
      fontSize: 7.2,
      color: palette.colors.inkMuted,
      textTransform: "uppercase",
      letterSpacing: 0.35
    },
    bankDetailsValue: {
      fontSize: 8.4,
      color: palette.colors.ink,
      lineHeight: 1.25
    },
    docFooter: {
      position: "absolute",
      bottom: 16,
      left: 30,
      right: 30,
      gap: 5
    },
    docFooterDivider: {
      height: 1,
      backgroundColor: palette.colors.line
    },
    docFooterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    docFooterText: {
      fontSize: 7.4,
      color: palette.colors.inkMuted
    },
    docFooterLogo: {
      height: 12,
      width: 46,
      objectFit: "contain"
    }
  });
}

function MetaRow({
  label,
  value,
  accent = false,
  styles
}: {
  label: string;
  value: string;
  accent?: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={accent ? styles.metaValueAccent : styles.metaValue}>{value}</Text>
    </View>
  );
}

function RecipientField({
  label,
  value,
  styles
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.recipientField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function Cell({
  text,
  flex,
  header = false,
  alt = false,
  last = false,
  styles
}: {
  text: string;
  flex: number;
  header?: boolean;
  alt?: boolean;
  last?: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View
      style={[
        styles.cell,
        { flex },
        last ? styles.cellLast : {},
        !header && alt ? styles.tableRowAlt : {}
      ]}
    >
      <Text style={header ? styles.cellHeaderText : styles.cellText}>{text}</Text>
    </View>
  );
}

function formatCurrency(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-DO", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatPercent(value: number) {
  return `${formatNumber(value)}%`;
}

function formatRecipientKind(value: InvoiceDetail["recipientKind"]) {
  if (value === "customer") {
    return "Cliente vinculado";
  }

  if (value === "lead") {
    return "Lead vinculado";
  }

  return "Lead rapido";
}

function formatStatus(value: InvoiceDetail["status"]) {
  if (value === "issued") {
    return "Emitida";
  }

  if (value === "paid") {
    return "Pagada";
  }

  if (value === "void") {
    return "Anulada";
  }

  return "Borrador";
}
