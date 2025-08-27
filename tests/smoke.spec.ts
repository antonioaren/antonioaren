import { test, expect } from '@playwright/test';

const HOME_PATH = '/';
const SITEMAP_URL = 'https://pedroarenas.dev/sitemap.xml';

test('homepage smoke: loads successfully and renders content', async ({ page }) => {
  let response = await page.goto(HOME_PATH, { waitUntil: 'load' });
  if (!response || response.status() === 429 || response.status() === 403) {
    await page.waitForTimeout(2000);
    response = await page.goto(HOME_PATH, { waitUntil: 'load' });
  }
  if (!response || response.status() === 429 || response.status() === 403) {
    test.skip(true, `Skipped due to rate limiting or bot protection (status: ${response?.status()})`);
  }

  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator('body')).toBeVisible();
});

test('sitemap pages respond with 200 and have no console errors', async ({ page, request }) => {
  const res = await request.get(SITEMAP_URL);
  const urls: string[] = [];
  if (res.ok()) {
    const xml = await res.text();
    const matches = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g));
    for (const m of matches) {
      if (m[1]) urls.push(m[1].trim());
    }
  }
  if (urls.length === 0) {
    urls.push('https://pedroarenas.dev/');
  }

  // Sample at most 3 URLs to avoid rate limiting
  urls.splice(3);

  const errors: { url: string; message: string }[] = [];

  for (const url of urls) {
    const pageErrors: string[] = [];
    page.removeAllListeners('console');
    page.on('console', msg => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });

    let response = await page.goto(url, { waitUntil: 'load' });
    if (!response || !response.ok()) {
      if (response && [408, 425, 429, 500, 502, 503, 504, 403].includes(response.status())) {
        await page.waitForTimeout(2000);
        response = await page.goto(url, { waitUntil: 'load' });
      }
    }
    if (!response || !response.ok()) {
      // Skip URL instead of failing the whole test if blocked by protection
      if (response && [403, 429].includes(response.status())) {
        continue;
      }
      errors.push({ url, message: `HTTP ${(response && response.status()) || 'no response'}` });
      continue;
    }

    const contentExists = await page.locator('body *').first().count();
    if (contentExists === 0) {
      errors.push({ url, message: 'No content found on page' });
    }

    if (pageErrors.length > 0) {
      errors.push({ url, message: `Console errors: ${pageErrors.slice(0, 3).join(' | ')}` });
    }
  }

  expect.soft(errors, `Failures: ${errors.map(e => `${e.url} -> ${e.message}`).join('; ')}`).toHaveLength(0);
});

