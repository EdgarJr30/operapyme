import { expect, test } from "@playwright/test";

test("loads the auth entry for the backoffice", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText(
      /Acceso al backoffice|Backoffice access|Supabase pendiente|Supabase pending/i
    )
  ).toBeVisible();
});
