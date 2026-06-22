import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:8086/admin/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('admin');
    await inputs[1].fill('admin123');
  }
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  console.log('Logged in, URL:', page.url());

  await page.goto('http://localhost:8086/admin/categories', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/mc/htgw/categories.png', fullPage: true });
  console.log('Categories screenshot done');

  await page.goto('http://localhost:8086/admin/messages', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/mc/htgw/messages.png', fullPage: true });
  console.log('Messages screenshot done');

  await browser.close();
}

main().catch(function(e) { console.error(e); process.exit(1); });
