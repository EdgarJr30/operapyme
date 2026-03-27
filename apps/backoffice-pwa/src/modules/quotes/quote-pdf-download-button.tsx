import { type ComponentType, useMemo, useState } from "react";

import { Download } from "lucide-react";

import { getPrimaryTenantMembership } from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { useTenantTheme } from "@operapyme/ui";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button, type ButtonProps } from "@/components/ui/button";
import { getQuoteDetail } from "@/lib/supabase/backoffice-data";
import type { QuotePdfDocumentProps } from "@/modules/quotes/quote-pdf-document";

interface QuotePdfRuntime {
  pdf: typeof import("@react-pdf/renderer").pdf;
  QuotePdfDocument: ComponentType<QuotePdfDocumentProps>;
}

let quotePdfRuntimePromise: Promise<QuotePdfRuntime> | null = null;

function loadQuotePdfRuntime() {
  if (!quotePdfRuntimePromise) {
    quotePdfRuntimePromise = Promise.all([
      import("@react-pdf/renderer"),
      import("@/modules/quotes/quote-pdf-document")
    ]).then(([{ pdf }, { QuotePdfDocument }]) => ({
      pdf,
      QuotePdfDocument
    }));
  }

  return quotePdfRuntimePromise;
}

function warmQuotePdfRuntime() {
  void loadQuotePdfRuntime();
}

export function QuotePdfDownloadButton({
  quoteId,
  quoteNumber,
  variant = "secondary"
}: {
  quoteId: string;
  quoteNumber: string;
  variant?: ButtonProps["variant"];
}) {
  const { t } = useTranslation("backoffice");
  const { accessContext, activeTenantId } = useBackofficeAuth();
  const { palette } = useTenantTheme();
  const [isGenerating, setIsGenerating] = useState(false);

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
      toast.error(t("quotes.pdf.noTenantError"));
      return;
    }

    setIsGenerating(true);

    try {
      const quote = await getQuoteDetail(activeTenantId, quoteId);
      const { pdf, QuotePdfDocument } = await loadQuotePdfRuntime();
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
      toast.success(t("quotes.pdf.downloadSuccess"));
    } catch (error) {
      toast.error(
        t("quotes.pdf.downloadError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      onFocus={warmQuotePdfRuntime}
      onClick={() => {
        void handleDownload();
      }}
      onPointerEnter={warmQuotePdfRuntime}
      disabled={isGenerating}
    >
      <Download className="size-4" aria-hidden="true" />
      {isGenerating
        ? t("quotes.pdf.generatingAction")
        : t("quotes.pdf.downloadAction")}
    </Button>
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
