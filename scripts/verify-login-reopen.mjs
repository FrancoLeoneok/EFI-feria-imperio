const { chromium } = await import(process.argv[2] || 'playwright');
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-proxy-server'] });
const page = await browser.newPage();
try {
  await page.goto(process.argv[3] || 'http://127.0.0.1:5173');
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    useAuthStore.getState().logout();
    useAuthStore.getState().openLoginModal('feriante');
  });
  await page.locator('#login-usuario-feriante').fill('Carlos');
  await page.getByRole('dialog').getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.waitForURL('**/admin');
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    useAuthStore.getState().logout();
    useAuthStore.getState().openLoginModal();
  });
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.locator('#login-comprador-nombre').count(), 1, 'Reopening after logout must show the login form');
  assert.equal(await page.getByText('¡Operación Exitosa!').count(), 0);
  console.log('PASS: feriante login → logout → reopen shows login form');
} finally { await browser.close(); }


