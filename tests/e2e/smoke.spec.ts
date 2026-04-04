import { devices, expect, test } from "@playwright/test";

test("loads the auth entry for the backoffice", async ({ page }) => {
  await page.goto("/auth");
  await expect(
    page.getByText(
      /Inicia sesión en tu cuenta|Sign in to your account|Supabase pendiente|Supabase pending/i
    )
  ).toBeVisible();
});

test("exposes the manifest and english auth copy on mobile", async ({
  browser,
  request
}) => {
  const context = await browser.newContext({
    ...devices["iPhone 12"]
  });
  const page = await context.newPage();

  await page.goto("/auth?lang=en");

  const englishAuthHeading = page.getByRole("heading", {
    name: /Sign in to your account/i
  });
  const englishUnconfiguredHeading = page.getByRole("heading", {
    name: /The backoffice needs a Supabase connection before opening a session/i
  });

  await expect
    .poll(async () => {
      return (
        (await englishAuthHeading.count()) > 0 ||
        (await englishUnconfiguredHeading.count()) > 0
      );
    })
    .toBeTruthy();

  const manifestLink = page.locator('link[rel="manifest"]');

  await expect(manifestLink).toHaveAttribute("href", "/manifest.webmanifest");

  const manifest = await request.get("/manifest.webmanifest");
  const payload = await manifest.json();

  expect(payload.display).toBe("standalone");
  expect(payload.start_url).toBe("/");

  await context.close();
});
