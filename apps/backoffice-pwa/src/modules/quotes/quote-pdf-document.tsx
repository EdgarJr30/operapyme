import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";

import type { ThemePalette } from "@operapyme/ui";

import type { QuoteDetail } from "@/lib/supabase/backoffice-data";

interface QuotePdfDocumentProps {
  generatedAt: string;
  issuerName: string;
  logoUrl?: string | null;
  palette: ThemePalette;
  quote: QuoteDetail;
}

export function QuotePdfDocument({
  generatedAt,
  issuerName,
  logoUrl,
  palette,
  quote
}: QuotePdfDocumentProps) {
  const styles = createStyles(palette);

  return (
    <Document
      author="OperaPyme"
      creator="OperaPyme"
      title={`${quote.quoteNumber} - ${quote.title}`}
      subject={quote.title}
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
              <Text style={styles.eyebrow}>Cotizacion comercial</Text>
              <Text style={styles.issuerName}>{issuerName}</Text>
              <Text style={styles.documentTitle}>{quote.title}</Text>
            </View>
          </View>

          <View style={styles.metaCard}>
            <MetaRow label="Numero" value={quote.quoteNumber} styles={styles} />
            <MetaRow
              label="Emitida"
              value={formatDate(quote.createdAt)}
              styles={styles}
            />
            <MetaRow
              label="Valida hasta"
              value={quote.validUntil ? formatDate(quote.validUntil) : "Sin fecha"}
              styles={styles}
            />
            <MetaRow label="Estado" value={formatStatus(quote.status)} styles={styles} />
          </View>
        </View>

        <View style={styles.recipientSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destinatario</Text>
            <Text style={styles.sectionSubtitle}>{formatRecipientKind(quote.recipientKind)}</Text>
          </View>
          <View style={styles.recipientGrid}>
            <RecipientField
              label="Empresa o referencia"
              value={quote.recipientDisplayName}
              styles={styles}
            />
            <RecipientField
              label="Contacto"
              value={quote.recipientContactName ?? "No especificado"}
              styles={styles}
            />
            <RecipientField
              label="Correo"
              value={quote.recipientEmail ?? "No especificado"}
              styles={styles}
            />
            <RecipientField
              label="WhatsApp"
              value={quote.recipientWhatsApp ?? "No especificado"}
              styles={styles}
            />
            <RecipientField
              label="Telefono"
              value={quote.recipientPhone ?? "No especificado"}
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

          {quote.lineItems.map((lineItem) => (
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
              <Cell
                text={formatNumber(lineItem.quantity)}
                flex={0.8}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.unitPrice, quote.currencyCode)}
                flex={1}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.discountTotal, quote.currencyCode)}
                flex={0.9}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.taxTotal, quote.currencyCode)}
                flex={0.9}
                styles={styles}
              />
              <Cell
                text={formatCurrency(lineItem.lineTotal, quote.currencyCode)}
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
              {quote.notes?.trim() || "Sin notas adicionales para esta version."}
            </Text>
            <Text style={styles.generatedAt}>
              Generado el {formatDateTime(generatedAt)}
            </Text>
          </View>

          <View style={styles.totalsCard}>
            <MetaRow
              label="Subtotal"
              value={formatCurrency(quote.subtotal, quote.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Descuentos"
              value={formatCurrency(quote.discountTotal, quote.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Impuestos"
              value={formatCurrency(quote.taxTotal, quote.currencyCode)}
              styles={styles}
            />
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(quote.grandTotal, quote.currencyCode)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function createStyles(palette: ThemePalette) {
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
      fontSize: 17,
      fontWeight: 700
    },
    documentTitle: {
      fontSize: 13,
      color: palette.colors.inkSoft
    },
    metaCard: {
      width: 172,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 14,
      gap: 8
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8
    },
    metaLabel: {
      color: palette.colors.inkMuted,
      fontSize: 9
    },
    metaValue: {
      color: palette.colors.ink,
      fontSize: 9.5,
      fontWeight: 600,
      textAlign: "right"
    },
    recipientSection: {
      marginTop: 22,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 16,
      gap: 12
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 700
    },
    sectionSubtitle: {
      fontSize: 9.5,
      color: palette.colors.inkSoft
    },
    recipientGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12
    },
    recipientField: {
      width: "47%",
      gap: 4
    },
    fieldLabel: {
      fontSize: 8.5,
      color: palette.colors.inkMuted,
      textTransform: "uppercase"
    },
    fieldValue: {
      fontSize: 10.5,
      color: palette.colors.ink,
      lineHeight: 1.35
    },
    tableShell: {
      marginTop: 22,
      borderWidth: 1,
      borderColor: palette.colors.line,
      borderRadius: 18,
      overflow: "hidden"
    },
    tableHeaderRow: {
      flexDirection: "row",
      backgroundColor: palette.colors.primary200
    },
    tableRow: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: palette.colors.line,
      backgroundColor: "#ffffff"
    },
    cell: {
      paddingTop: 12,
      paddingRight: 10,
      paddingBottom: 12,
      paddingLeft: 10,
      borderRightWidth: 1,
      borderRightColor: palette.colors.line,
      justifyContent: "flex-start"
    },
    cellHeader: {
      fontSize: 9,
      fontWeight: 700,
      color: palette.colors.ink
    },
    cellText: {
      fontSize: 9.5,
      color: palette.colors.ink
    },
    lineTitle: {
      fontSize: 10,
      fontWeight: 700
    },
    lineDescription: {
      marginTop: 4,
      fontSize: 9,
      lineHeight: 1.4,
      color: palette.colors.inkSoft
    },
    lineMeta: {
      marginTop: 4,
      fontSize: 8.5,
      color: palette.colors.inkMuted
    },
    footerArea: {
      marginTop: 22,
      flexDirection: "row",
      gap: 16
    },
    notesCard: {
      flex: 1,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 16,
      gap: 8
    },
    notesTitle: {
      fontSize: 11,
      fontWeight: 700
    },
    notesBody: {
      fontSize: 9.5,
      color: palette.colors.inkSoft,
      lineHeight: 1.5
    },
    generatedAt: {
      marginTop: 10,
      fontSize: 8.5,
      color: palette.colors.inkMuted
    },
    totalsCard: {
      width: 210,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 16,
      gap: 8
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
      fontSize: 12,
      fontWeight: 700
    },
    totalValue: {
      fontSize: 12,
      fontWeight: 700,
      color: palette.colors.ink
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
  styles
}: {
  text: string;
  flex: number;
  header?: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View
      style={[
        styles.cell,
        { flex },
        ...(header ? [] : [{ backgroundColor: "#ffffff" }])
      ]}
    >
      <Text style={header ? styles.cellHeader : styles.cellText}>{text}</Text>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
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

function formatCurrency(value: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${currencyCode.toUpperCase()} ${value.toFixed(2)}`;
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-DO", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatRecipientKind(kind: QuoteDetail["recipientKind"]) {
  switch (kind) {
    case "customer":
      return "Cliente vinculado";
    case "lead":
      return "Lead vinculado";
    case "ad_hoc":
      return "Lead rapido";
  }
}

function formatStatus(status: QuoteDetail["status"]) {
  switch (status) {
    case "draft":
      return "Borrador";
    case "sent":
      return "Enviada";
    case "viewed":
      return "Vista";
    case "approved":
      return "Aprobada";
    case "rejected":
      return "Rechazada";
    case "expired":
      return "Expirada";
  }
}
