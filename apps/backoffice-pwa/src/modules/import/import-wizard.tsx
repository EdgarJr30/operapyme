import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@operapyme/i18n";

import { useImportWizardState, type WizardStep } from "./use-import-wizard-state";
import { ImportStepUpload } from "./steps/import-step-upload";
import { ImportStepMapping } from "./steps/import-step-mapping";
import { ImportStepPreview } from "./steps/import-step-preview";
import { ImportStepProcessing } from "./steps/import-step-processing";
import { ImportStepComplete } from "./steps/import-step-complete";

const STEPS: WizardStep[] = ["upload", "mapping", "preview", "processing", "complete"];

export function ImportWizard() {
  const { t } = useTranslation("backoffice");
  const controls = useImportWizardState();
  const { state, goToNextStep, goToPrevStep, setStep, setCompleteSummary } = controls;

  const currentIdx = STEPS.indexOf(state.step);

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <nav aria-label="Pasos de importacion">
        <ol className="flex items-center gap-0">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const stepLabel = t(`import.steps.${step}`);

            return (
              <li key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={[
                      "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                      isDone
                        ? "bg-accent text-white"
                        : isCurrent
                          ? "border-2 border-accent bg-paper text-accent"
                          : "border-2 border-line bg-paper text-ink-muted"
                    ].join(" ")}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isDone ? "✓" : idx + 1}
                  </div>
                  <span
                    className={[
                      "hidden text-[10px] sm:block",
                      isCurrent ? "font-medium text-ink" : "text-ink-muted"
                    ].join(" ")}
                  >
                    {stepLabel}
                  </span>
                </div>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={[
                      "mx-1 mb-5 h-px flex-1 min-w-[16px] transition-colors sm:mx-2",
                      idx < currentIdx ? "bg-accent" : "bg-line"
                    ].join(" ")}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state.step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {state.step === "upload" && (
            <ImportStepUpload controls={controls} onNext={goToNextStep} />
          )}

          {state.step === "mapping" && (
            <ImportStepMapping
              controls={controls}
              onNext={goToNextStep}
              onBack={goToPrevStep}
            />
          )}

          {state.step === "preview" && (
            <ImportStepPreview
              controls={controls}
              onNext={goToNextStep}
              onBack={goToPrevStep}
            />
          )}

          {state.step === "processing" && (
            <ImportStepProcessing
              controls={controls}
              onComplete={(summary) => {
                setCompleteSummary(summary);
                setStep("complete");
              }}
            />
          )}

          {state.step === "complete" && (
            <ImportStepComplete controls={controls} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
