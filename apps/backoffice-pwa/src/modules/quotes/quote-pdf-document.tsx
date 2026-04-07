import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";

import type { ThemePaletteDefinition } from "@operapyme/ui";

import type { QuoteDetail } from "@/lib/supabase/backoffice-data";
import {
  calculateQuoteDocumentDiscountTotalFromCombinedDiscount,
  calculateQuoteLineDiscountTotal
} from "@/lib/forms/quote-line-discounts";

export interface QuotePdfDocumentProps {
  generatedAt: string;
  issuerAddress?: string | null;
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
  quote: QuoteDetail;
}

export function QuotePdfDocument({
  generatedAt,
  issuerAddress,
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
  quote
}: QuotePdfDocumentProps) {
  const styles = createStyles(palette);
  const lineDiscountTotal = calculateQuoteLineDiscountTotal(quote.lineItems);
  const documentDiscountTotal = calculateQuoteDocumentDiscountTotalFromCombinedDiscount({
    lineItems: quote.lineItems,
    totalDiscount: quote.discountTotal
  });

  return (
    <Document
      author="OperaPyme"
      creator="OperaPyme"
      title={`${quote.quoteNumber} - ${quote.title}`}
      subject={quote.title}
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
              <Text style={styles.eyebrow}>Cotizacion comercial</Text>
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
              <Text style={styles.documentTitle}>{quote.title}</Text>
            </View>
          </View>

          <View style={styles.metaCard}>
            <MetaRow label="Numero" value={quote.quoteNumber} styles={styles} accent />
            <MetaRow
              label="Emitida"
              value={formatDate(quote.issuedOn ?? quote.createdAt)}
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

        {/* Recipient section */}
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

        {/* Line items table */}
        <View style={styles.tableWrapper}>
        <View style={styles.tableShell}>
          <View style={styles.tableHeaderRow}>
            <Cell text="Detalle" flex={3.2} styles={styles} header />
            <Cell text="Cant." flex={0.8} styles={styles} header />
            <Cell text="Precio" flex={1} styles={styles} header />
            <Cell text="Desc." flex={0.9} styles={styles} header />
            <Cell text="Impuesto" flex={0.9} styles={styles} header />
            <Cell text="Total" flex={1} styles={styles} header last />
          </View>

          {quote.lineItems.map((lineItem, index) => (
            <View
              key={lineItem.id}
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <View style={[styles.cell, { flex: 3.2 }]}>
                <Text style={styles.lineTitle}>{lineItem.itemName}</Text>
                {lineItem.itemCode ? (
                  <Text style={styles.lineMeta}>Codigo: {lineItem.itemCode}</Text>
                ) : null}
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
                alt={index % 2 === 1}
              />
              <Cell
                text={formatCurrency(lineItem.unitPrice, quote.currencyCode)}
                flex={1}
                styles={styles}
                alt={index % 2 === 1}
              />
              <Cell
                text={formatCurrency(lineItem.discountTotal, quote.currencyCode)}
                flex={0.9}
                styles={styles}
                alt={index % 2 === 1}
              />
              <Cell
                text={formatCurrency(lineItem.taxTotal, quote.currencyCode)}
                flex={0.9}
                styles={styles}
                alt={index % 2 === 1}
              />
              <Cell
                text={formatCurrency(lineItem.lineTotal, quote.currencyCode)}
                flex={1}
                styles={styles}
                alt={index % 2 === 1}
                last
              />
            </View>
          ))}
        </View>
        </View>

        {/* Footer area: notes + totals */}
        <View style={styles.footerArea}>
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas y condiciones</Text>
            <Text style={styles.notesBody}>
              {quote.notes?.trim() || "Sin notas adicionales para esta version."}
            </Text>
          </View>

          <View style={styles.totalsCard}>
            <MetaRow
              label="Subtotal"
              value={formatCurrency(quote.subtotal, quote.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Descuentos por linea"
              value={formatCurrency(lineDiscountTotal, quote.currencyCode)}
              styles={styles}
            />
            <MetaRow
              label="Descuento global"
              value={formatCurrency(documentDiscountTotal, quote.currencyCode)}
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
      paddingTop: 36,
      paddingRight: 36,
      paddingBottom: 52,
      paddingLeft: 36,
      backgroundColor: palette.colors.paper,
      color: palette.colors.ink,
      fontSize: 10.5
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
      gap: 20,
      alignItems: "flex-start"
    },
    brandBlock: {
      flexDirection: "row",
      gap: 16,
      flex: 1,
      alignItems: "flex-start"
    },
    logo: {
      width: 76,
      height: 76,
      objectFit: "contain"
    },
    logoFallback: {
      width: 76,
      height: 76,
      borderRadius: 12,
      backgroundColor: palette.colors.primary300,
      alignItems: "center",
      justifyContent: "center"
    },
    logoFallbackText: {
      fontSize: 22,
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
      fontSize: 19,
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
      fontSize: 9.5,
      lineHeight: 1.4
    },
    issuerMetaFull: {
      color: palette.colors.inkSoft,
      fontSize: 9.5,
      lineHeight: 1.4
    },
    documentTitle: {
      marginTop: 4,
      fontSize: 12,
      color: palette.colors.inkSoft
    },
    metaCard: {
      width: 178,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 14,
      gap: 9
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
    metaValueAccent: {
      color: palette.colors.primary400,
      fontSize: 10,
      fontWeight: 700,
      textAlign: "right"
    },
    recipientSection: {
      marginTop: 22,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 16,
      gap: 12
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 700
    },
    sectionSubtitle: {
      fontSize: 9,
      color: palette.colors.inkSoft,
      backgroundColor: palette.colors.primary200,
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 7,
      paddingRight: 7,
      borderRadius: 20
    },
    recipientGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12
    },
    recipientField: {
      width: "47%",
      gap: 3
    },
    fieldLabel: {
      fontSize: 8,
      color: palette.colors.inkMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5
    },
    fieldValue: {
      fontSize: 10.5,
      color: palette.colors.ink,
      lineHeight: 1.35
    },
    tableWrapper: {
      marginTop: 22,
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
      paddingTop: 11,
      paddingRight: 10,
      paddingBottom: 11,
      paddingLeft: 10,
      borderRightWidth: 1,
      borderRightColor: palette.colors.line,
      justifyContent: "flex-start"
    },
    cellLast: {
      borderRightWidth: 0
    },
    cellHeaderText: {
      fontSize: 8.5,
      fontWeight: 700,
      color: "#ffffff"
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
      marginTop: 3,
      fontSize: 9,
      lineHeight: 1.4,
      color: palette.colors.inkSoft
    },
    lineMeta: {
      marginTop: 3,
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
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 16,
      gap: 8
    },
    notesTitle: {
      fontSize: 10,
      fontWeight: 700
    },
    notesBody: {
      fontSize: 9.5,
      color: palette.colors.inkSoft,
      lineHeight: 1.55
    },
    totalsCard: {
      width: 216,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.colors.line,
      backgroundColor: palette.colors.sand,
      padding: 16,
      gap: 9
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
      fontSize: 13,
      fontWeight: 700
    },
    totalValue: {
      fontSize: 13,
      fontWeight: 700,
      color: palette.colors.primary400
    },
    docFooter: {
      position: "absolute",
      bottom: 20,
      left: 36,
      right: 36,
      gap: 6
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
      fontSize: 8,
      color: palette.colors.inkMuted
    },
    docFooterLogo: {
      height: 14,
      width: 52,
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
