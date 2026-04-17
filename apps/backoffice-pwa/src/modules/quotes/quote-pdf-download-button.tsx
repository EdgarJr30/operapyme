import { type ComponentType, useMemo, useState } from "react";

import { Download } from "lucide-react";

import { getPrimaryTenantMembership } from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { useTenantTheme } from "@operapyme/ui";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button, type ButtonProps } from "@/components/ui/button";
import { getQuoteDetail } from "@/lib/supabase/backoffice-data";
import { getTenantBrandingSettings } from "@/lib/supabase/settings-data";
import type { QuotePdfDocumentProps } from "@/modules/quotes/quote-pdf-document";

interface QuotePdfRuntime {
  pdf: typeof import("@react-pdf/renderer").pdf;
  QuotePdfDocument: ComponentType<QuotePdfDocumentProps>;
}

let quotePdfRuntimePromise: Promise<QuotePdfRuntime> | null = null;
let brandWatermarkPromise: Promise<string | null> | null = null;

function loadBrandWatermark(): Promise<string | null> {
  if (!brandWatermarkPromise) {
    brandWatermarkPromise = (async () => {
      try {
        const response = await fetch("/operapyme-logo.svg");
        const svgText = await response.text();
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const objectUrl = URL.createObjectURL(blob);
        return await new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 960;
            canvas.height = 260;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              URL.revokeObjectURL(objectUrl);
              reject(new Error("Canvas context unavailable"));
              return;
            }
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0, 480, 130);
            URL.revokeObjectURL(objectUrl);
            resolve(canvas.toDataURL("image/png"));
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("SVG load failed"));
          };
          img.src = objectUrl;
        });
      } catch {
        return null;
      }
    })();
  }
  return brandWatermarkPromise;
}

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
  size = "sm",
  variant = "secondary"
}: {
  quoteId: string;
  quoteNumber: string;
  size?: ButtonProps["size"];
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

  async function handleDownload() {
    if (!activeTenantId) {
      toast.error(t("quotes.pdf.noTenantError"));
      return;
    }

    setIsGenerating(true);

    try {
      const [quote, tenantSettings, watermarkUrl] = await Promise.all([
        getQuoteDetail(activeTenantId, quoteId),
        getTenantBrandingSettings(activeTenantId),
        loadBrandWatermark()
      ]);
      const { pdf, QuotePdfDocument } = await loadQuotePdfRuntime();
      const blob = await pdf(
        <QuotePdfDocument
          generatedAt={new Date().toISOString()}
          issuerAddress={tenantSettings.address}
          issuerBankAccounts={tenantSettings.bankAccounts}
          issuerCedula={tenantSettings.cedula}
          issuerEmail={tenantSettings.email}
          issuerName={tenantSettings.name || activeTenantName}
          issuerPhone={tenantSettings.phone}
          issuerRnc={tenantSettings.rnc}
          issuerSecondaryPhone={tenantSettings.secondaryPhone}
          issuerWebsiteUrl={tenantSettings.websiteUrl}
          logoUrl={tenantSettings.logoUrl}
          watermarkUrl={watermarkUrl}
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
      size={size}
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
