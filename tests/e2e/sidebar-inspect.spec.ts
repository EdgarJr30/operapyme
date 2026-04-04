import { test } from '@playwright/test';

test('inspect sidebar CSS variables', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173');
  await page.waitForLoadState('networkidle');

  const styles = await page.evaluate(() => {
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    return {
      hasDarkClass: root.classList.contains('dark'),
      rootClasses: root.className,
      colorScheme: rootStyle.colorScheme,
      vfLightSidebarSurface: rootStyle.getPropertyValue('--vf-light-sidebar-surface').trim(),
      vfDarkSidebarSurface: rootStyle.getPropertyValue('--vf-dark-sidebar-surface').trim(),
      vfActiveSidebarSurface: rootStyle.getPropertyValue('--vf-active-sidebar-surface').trim(),
      colorSidebarSurface: rootStyle.getPropertyValue('--color-sidebar-surface').trim(),
      // check inline styles on root
      rootInlineStyle: root.getAttribute('style'),
    };
  });

  console.log(JSON.stringify(styles, null, 2));
});
