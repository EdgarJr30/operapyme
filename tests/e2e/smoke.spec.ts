import { expect, test } from "@playwright/test";

test("loads the backoffice home and reserved admin route", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Construye una interfaz calmada/i
    })
  ).toBeVisible();

  await page.getByRole("link", { name: /^Admin$/i }).click();
  await expect(
    page.getByRole("heading", {
      name: /Centro de auditoria y trazabilidad/i
    })
  ).toBeVisible();
});
