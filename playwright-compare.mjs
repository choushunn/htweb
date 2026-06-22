import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Login
  await page.goto('http://localhost:8086/admin/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Find inputs and fill
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('admin');
    await inputs[1].fill('admin123');
  }
  // Click submit
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  console.log('Current URL after login:', page.url());

  // Navigate to categories page
  await page.goto('http://localhost:8086/admin/categories', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const categoriesHtml = await page.evaluate(() => {
    const card = document.querySelector('.admin-table-card');
    if (!card) return 'NOT FOUND';
    const clone = card.cloneNode(true);
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(function(el) {
      if (typeof el.className === 'string') {
        var classes = (el.className || '').split(' ');
        var filtered = classes.filter(function(c) {
          return !c.startsWith('css-') && !c.startsWith('_R_') && c !== 'trae-browser-inspect-draggable' && c !== 'ant-table-css-var';
        });
        el.className = filtered.join(' ');
      }
    });
    return clone.outerHTML.substring(0, 5000);
  });
  console.log('=== CATEGORIES PAGE CARD HTML ===');
  console.log(categoriesHtml);

  // Navigate to messages page
  await page.goto('http://localhost:8086/admin/messages', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const messagesHtml = await page.evaluate(() => {
    const card = document.querySelector('.admin-table-card');
    if (!card) return 'NOT FOUND';
    const clone = card.cloneNode(true);
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(function(el) {
      if (typeof el.className === 'string') {
        var classes = (el.className || '').split(' ');
        var filtered = classes.filter(function(c) {
          return !c.startsWith('css-') && !c.startsWith('_R_') && c !== 'trae-browser-inspect-draggable' && c !== 'ant-table-css-var';
        });
        el.className = filtered.join(' ');
      }
    });
    return clone.outerHTML.substring(0, 5000);
  });
  console.log('=== MESSAGES PAGE CARD HTML ===');
  console.log(messagesHtml);

  await browser.close();
}

main().catch(console.error);
