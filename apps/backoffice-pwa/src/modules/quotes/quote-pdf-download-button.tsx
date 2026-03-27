import { useMemo, useState } from "react";

import { Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { getPrimaryTenantMembership } from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { useTenantTheme } from "@operapyme/ui";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { getQuoteDetail } from "@/lib/supabase/backoffice-data";
import { QuotePdfDocument } from "@/modules/quotes/quote-pdf-document";

export function QuotePdfDownloadButton({
  quoteId,
  quoteNumber
}: {
  quoteId: string;
  quoteNumber: string;
}) {
  const { t } = useTranslation("backoffice");
  const { accessContext, activeTenantId } = useBackofficeAuth();
  const { palette } = useTenantTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTenantName = useMemo(() => {
    const membership = getPrimaryTenantMembership(accessContext, activeTenantId);

    return membership?.tenantName ?? "OperaPyme";
  }, [accessContext, activeTenantId]);

  const logoUrl =
    typeof window === "undefined"
      ? undefined
      : `${window.location.origin}/pwa-icon.svg`;

  async function handleDownload() {
    if (!activeTenantId) {
      setErrorMessage(t("quotes.pdf.noTenantError"));
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const quote = await getQuoteDetail(activeTenantId, quoteId);
      const blob = await pdf(
        <QuotePdfDocument
          generatedAt={new Date().toISOString()}
          issuerName={activeTenantName}
          logoUrl={logoUrl}
          palette={palette}
          quote={quote}
        />
      ).toBlob();

      downloadBlob(blob, `${quoteNumber}.pdf`);
    } catch (error) {
      setErrorMessage(
        t("quotes.pdf.downloadError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          void handleDownload();
        }}
        disabled={isGenerating}
      >
        <Download className="size-4" aria-hidden="true" />
        {isGenerating
          ? t("quotes.pdf.generatingAction")
          : t("quotes.pdf.downloadAction")}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-peach-400">{errorMessage}</p>
      ) : null}
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
}
