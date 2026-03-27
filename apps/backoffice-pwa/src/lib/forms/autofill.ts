export const operationalAutofillIgnoreProps = {
  "data-1p-ignore": "true",
  "data-bwignore": "true",
  "data-lpignore": "true",
  "data-protonpass-ignore": "true"
} as const;

export function buildOperationalAutofillProps(autoComplete: string) {
  return {
    ...operationalAutofillIgnoreProps,
    autoComplete
  } as const;
}
