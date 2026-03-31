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
  calculateQuoteDocumentDiscountTotalFromCombinedDiscount,
  calculateQuoteLineDiscountTotal
} from "@/lib/forms/quote-line-discounts";

export interface InvoicePdfDocumentProps {
  generatedAt: string;
  issuerName: string;
  logoUrl?: string | null;
  palette: ThemePaletteDefinition;
  invoice: InvoiceDetail;
}

export function InvoicePdfDocument({
  generatedAt,
  issuerName,
  logoUrl,
  palette,
  invoice
}: InvoicePdfDocumentProps) {
  const styles = createStyles(palette);
  const lineDiscountTotal = calculateQuoteLineDiscountTotal(invoice.lineItems);
  const documentDiscountTotal = calculateQuoteDocumentDiscountTotalFromCombinedDiscount({
    lineItems: invoice.lineItems,
    totalDiscount: invoice.discountTotal
  });

  return (
    <Document
      author="OperaPyme"
      creator="OperaPyme"
      title={`${invoice.invoiceNumber} - ${invoice.title}`}
      subject={invoice.title}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            {logoUrl ? (
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
              <Text style={styles.documentTitle}>{invoice.title}</Text>
            </View>
          </View>

          <View style={styles.metaCard}>
            <MetaRow label="Numero" value={invoice.invoiceNumber} styles={styles} />
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

        <View style={styles.tableShell}>
          <View style={styles.tableHeaderRow}>
            <Cell text="Detalle" flex={3.2} styles={styles} header />
            <Cell text="Cant." flex={0.8} styles={styles} header />
            <Cell text="Precio" flex={1} styles={styles} header />
            <Cell text="Desc." flex={0.9} styles={styles} header />
            <Cell text="Impuesto" flex={0.9} styles={styles} header />
            <Cell text="Total" flex={1} styles={styles} header />
          </View>

          {invoice.lineItems.map((lineItem) => (
            <View key={lineItem.id} style={styles.tableRow}>
              <View style={[styles.cell, { flex: 3.2 }]}>
                <Text style={styles.lineTitle}>{lineItem.itemName}</Text>
                {lineItem.itemDescription ? (
                  <Text style={styles.lineDescription}>{lineItem.itemDescription}</Text>
                ) : null}
                {lineItem.unitLabel ? (
                  <Text style={styles.lineMeta}>Unidad: {lineItem.unitLabel}</Text>
                ) : null}
              </View>
              <Cell text={formatNumber(lineItem.quantity)} flex={0.8} styles={styles} />
              <Cell
                text={formatCurrency(lineItem.unitPrice, invoice.currencyCode)}
                flex={1}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.discountTotal, invoice.currencyCode)}
                flex={0.9}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.taxTotal, invoice.currencyCode)}
                flex={0.9}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.lineTotal, invoice.currencyCode)}
                flex={1}
                styles={styles}
              />
            </View>
          ))}
        </View>

        <View style={styles.footerArea}>
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas y condiciones</Text>
            <Text style={styles.notesBody}>
              {invoice.notes?.trim() || "Sin notas adicionales para esta factura."}
            </Text>
            <Text style={styles.generatedAt}>
              Generado el {formatDateTime(generatedAt)}
            </Text>
          </View>

          <View style={styles.totalsCard}>
            <MetaRow
              label="Subtotal"
              value={formatCurrency(invoice.subtotal, invoice.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Descuentos por linea"
              value={formatCurrency(lineDiscountTotal, invoice.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Descuento global"
              value={formatCurrency(documentDiscountTotal, invoice.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Impuestos"
              value={formatCurrency(invoice.taxTotal, invoice.currencyCode)}
              styles={styles}
            />
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.grandTotal, invoice.currencyCode)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function createStyles(palette: ThemePaletteDefinition) {
  return StyleSheet.create({
    page: {
      paddingTop: 32,
      paddingRight: 32,
      paddingBottom: 36,
      paddingLeft: 32,
      backgroundColor: palette.colors.paper,
      color: palette.colors.ink,
      fontSize: 10.5
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 18
    },
    brandBlock: {
      flexDirection: "row",
      gap: 14,
      flex: 1
    },
    logo: {
      width: 52,
      height: 52,
      objectFit: "contain"
    },
    logoFallback: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: palette.colors.primary300,
      alignItems: "center",
      justifyContent: "center"
    },
    logoFallbackText: {
      fontSize: 16,
      fontWeight: 700,
      color: palette.colors.ink
    },
    brandCopy: {
      gap: 4,
      flex: 1
    },
    eyebrow: {
      color: palette.colors.inkMuted,
      fontSize: 9,
      textTransform: "uppercase"
    },
    issuerName: {
      fontSize: 18,
      fontWeight: 700
    },
    documentTitle: {
      fontSize: 12,
      color: palette.colors.inkSoft
    },
    metaCard: {
      width: 180,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      paddingTop: 12,
      paddingRight: 14,
      paddingBottom: 12,
      paddingLeft: 14,
      gap: 8
    },
    recipientSection: {
      marginTop: 22,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: "#FFFFFF",
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 700
    },
    sectionSubtitle: {
      fontSize: 9,
      textTransform: "uppercase",
      color: palette.colors.inkMuted
    },
    recipientGrid: {
      marginTop: 12,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10
    },
    fieldCard: {
      width: "48%",
      borderRadius: 16,
      backgroundColor: palette.colors.sand,
      paddingTop: 10,
      paddingRight: 12,
      paddingBottom: 10,
      paddingLeft: 12,
      gap: 4
    },
    fieldLabel: {
      fontSize: 8.5,
      textTransform: "uppercase",
      color: palette.colors.inkMuted
    },
    fieldValue: {
      fontSize: 10,
      color: palette.colors.ink
    },
    tableShell: {
      marginTop: 22,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: palette.colors.line
    },
    tableHeaderRow: {
      flexDirection: "row",
      backgroundColor: palette.colors.primary300
    },
    tableRow: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: palette.colors.line,
      backgroundColor: "#FFFFFF"
    },
    cell: {
      paddingTop: 12,
      paddingRight: 10,
      paddingBottom: 12,
      paddingLeft: 10,
      justifyContent: "center"
    },
    cellHeader: {
      fontSize: 8.5,
      fontWeight: 700,
      textTransform: "uppercase",
      color: palette.colors.ink
    },
    cellText: {
      fontSize: 9.6,
      color: palette.colors.ink
    },
    lineTitle: {
      fontSize: 10,
      fontWeight: 700
    },
    lineDescription: {
      marginTop: 4,
      fontSize: 9,
      color: palette.colors.inkSoft,
      lineHeight: 1.45
    },
    lineMeta: {
      marginTop: 6,
      fontSize: 8.4,
      color: palette.colors.inkMuted
    },
    footerArea: {
      marginTop: 22,
      flexDirection: "row",
      gap: 16
    },
    notesCard: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: "#FFFFFF",
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      gap: 10
    },
    notesTitle: {
      fontSize: 11,
      fontWeight: 700
    },
    notesBody: {
      fontSize: 9.5,
      lineHeight: 1.5,
      color: palette.colors.inkSoft
    },
    generatedAt: {
      fontSize: 8.5,
      color: palette.colors.inkMuted
    },
    totalsCard: {
      width: 200,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      gap: 8
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12
    },
    metaLabel: {
      fontSize: 9,
      color: palette.colors.inkSoft
    },
    metaValue: {
      fontSize: 9.5,
      fontWeight: 700,
      color: palette.colors.ink
    },
    totalDivider: {
      marginTop: 2,
      borderTopWidth: 1,
      borderTopColor: palette.colors.line
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4
    },
    totalLabel: {
      fontSize: 11,
      fontWeight: 700
    },
    totalValue: {
      fontSize: 14,
      fontWeight: 800,
      color: palette.colors.primary400
    }
  });
}

function MetaRow({
  label,
  value,
  styles
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
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
    <View style={styles.fieldCard}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function Cell({
  flex,
  header = false,
  styles,
  text
}: {
  flex: number;
  header?: boolean;
  styles: ReturnType<typeof createStyles>;
  text: string;
}) {
  return (
    <View style={[styles.cell, { flex }]}>
      <Text style={header ? styles.cellHeader : styles.cellText}>{text}</Text>
    </View>
  );
}

function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: currencyCode
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-DO", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatRecipientKind(value: InvoiceDetail["recipientKind"]) {
  if (value === "customer") {
    return "Cliente";
  }

  if (value === "lead") {
    return "Lead";
  }

  return "Ad hoc";
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
