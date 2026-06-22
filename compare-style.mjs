import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Login
  await page.goto('http://localhost:8086/admin/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('admin');
    await inputs[1].fill('admin123');
  }
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);

  // Check categories page card styles
  await page.goto('http://localhost:8086/admin/categories', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const catStyles = await page.evaluate(function() {
    var card = document.querySelector('.admin-table-card');
    if (!card) return null;
    var body = card.querySelector('.ant-card-body');
    var style = window.getComputedStyle(body);
    return {
      padding: style.padding,
      borderRadius: style.borderRadius,
      border: style.border,
      boxShadow: card.style.boxShadow,
      className: card.className,
      bodyClassName: body.className
    };
  });
  console.log('=== CATEGORIES CARD STYLES ===');
  console.log(JSON.stringify(catStyles, null, 2));

  // Check messages page card styles
  await page.goto('http://localhost:8086/admin/messages', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const msgStyles = await page.evaluate(function() {
    var card = document.querySelector('.admin-table-card');
    if (!card) return null;
    var body = card.querySelector('.ant-card-body');
    var style = window.getComputedStyle(body);
    return {
      padding: style.padding,
      borderRadius: style.borderRadius,
      border: style.border,
      boxShadow: card.style.boxShadow,
      className: card.className,
      bodyClassName: body.className
    };
  });
  console.log('=== MESSAGES CARD STYLES ===');
  console.log(JSON.stringify(msgStyles, null, 2));

  await browser.close();
}

main().catch(function(e) { console.error(e.message); process.exit(1); });
