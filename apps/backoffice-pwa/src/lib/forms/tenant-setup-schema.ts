import { z } from "zod";

export const tenantSetupSchema = z.object({
  name: z
    .string()
    .min(2, "Ingresa el nombre comercial del tenant.")
    .max(120, "Mantener el nombre por debajo de 120 caracteres."),
  slug: z
    .string()
    .min(3, "Ingresa un slug de al menos 3 caracteres.")
    .max(60, "Mantener el slug por debajo de 60 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Usa solo minusculas, numeros y guiones simples."
    )
});

export type TenantSetupFormValues = z.infer<typeof tenantSetupSchema>;

export function slugifyTenantName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
