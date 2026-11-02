import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Usage: node scripts/verify-guides.mjs [Playwright module URL] [local app URL]
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const output = join(tmpdir(), 'feria-guide-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-proxy-server'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

async function openGuide(role) {
  const trigger = page
    .locator('footer')
    .getByRole('button', { name: `Guía de ${role}`, exact: true });
  await trigger.click();
  await page.getByRole('dialog', { name: `Guía de ${role}` }).waitFor();
  return trigger;
}

async function checkSteps(count) {
  const dialog = page.getByRole('dialog');
  assert.equal(
    await dialog.getByRole('button', { name: /Paso \d:/ }).count(),
    count,
  );
  assert.equal(
    await dialog
      .getByRole('button', { name: 'Anterior', exact: true })
      .isDisabled(),
    true,
  );
  for (let index = 0; index < count; index++) {
    assert.match(
      await dialog.innerText(),
      new RegExp(`Paso ${index + 1} de ${count}`),
    );
    await dialog.locator('img').evaluate((image) => image.decode());
    assert.equal(
      await dialog.locator('img').evaluate((image) => image.naturalWidth),
      1200,
    );
    if (index < count - 1)
      await dialog
        .getByRole('button', { name: 'Siguiente', exact: true })
        .click();
  }
  await dialog.getByRole('button', { name: 'Anterior', exact: true }).click();
  await page.keyboard.press('ArrowRight');
  await dialog.getByRole('button', { name: 'Finalizar', exact: true }).click();
  assert.equal(await page.getByRole('dialog').count(), 0);
}

try {
  await page.goto(baseURL);
  assert.equal(
    await page
      .locator('footer')
      .getByRole('button', { name: 'Guía de feriante' })
      .count(),
    0,
  );
  const trigger = await openGuide('usuario');
  await page.screenshot({ path: join(output, 'desktop.png') });
  await checkSteps(5);
  assert.equal(
    await trigger.evaluate((element) => document.activeElement === element),
    true,
  );
  await openGuide('usuario');
  assert.match(await page.getByRole('dialog').innerText(), /Paso 1 de 5/);
  for (let index = 0; index < 14; index++) {
    await page.keyboard.press('Tab');
    assert.equal(
      await page
        .getByRole('dialog')
        .evaluate((element) => element.contains(document.activeElement)),
      true,
    );
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.notEqual(
    await page.locator('body').evaluate((element) => element.style.overflow),
    'hidden',
  );

  // Buyer session uses the public guide as well.
  await page
    .getByRole('button', { name: 'Iniciar sesión', exact: true })
    .click();
  await page.locator('#login-comprador-nombre').fill('Cliente Prueba');
  await page.locator('#login-comprador-password').fill('comprador123');
  await page.locator('#login-comprador-password').press('Enter');
  await page.getByRole('button', { name: /Cliente Prueba/ }).waitFor();
  await openGuide('usuario');
  assert.equal(
    await page
      .getByRole('dialog')
      .getByText('Guía de feriante', { exact: true })
      .count(),
    0,
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Cliente Prueba/ }).click();
  await page
    .getByRole('button', { name: 'Cerrar Sesión', exact: true })
    .click();

  await page.goto(`${baseURL}/admin`);
  assert.equal(
    await page
      .locator('footer')
      .getByRole('button', { name: 'Guía de feriante' })
      .count(),
    0,
  );
  await page
    .getByRole('button', { name: 'Iniciar Sesión como Feriante' })
    .click();
  await page.locator('#login-usuario-feriante').fill('El Gaucho Tradición');
  await page.locator('#login-password-feriante').fill('feria123');
  await page.locator('#login-password-feriante').press('Enter');
  await page.getByRole('heading', { name: /Mi Taller •/ }).waitFor();
  await page.reload();
  assert.equal(
    await page
      .locator('footer')
      .getByRole('button', { name: 'Guía de usuario' })
      .count(),
    0,
  );
  await openGuide('feriante');
  await checkSteps(6);

  // Both guides fit narrow screens; their image links allow full-size inspection.
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 740 });
    await openGuide('feriante');
    assert.equal(
      await page
        .getByRole('dialog')
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
      true,
    );
    await page.screenshot({ path: join(output, `mobile-${width}.png`) });
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByTitle('Cerrar sesión del puesto').click();
  await openGuide('usuario');
  assert.equal(
    await page
      .locator('footer')
      .getByRole('button', { name: 'Guía de feriante' })
      .count(),
    0,
  );
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 375, height: 740 });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await openGuide('usuario');
  await page.screenshot({ path: join(output, 'mobile-dark.png') });
  assert.deepEqual(errors, []);
  console.log(
    `PASS: guest, buyer, seller, persisted session, logout, 11 slides, focus trap, Escape, keyboard, mobile, dark mode. Screenshots: ${output}`,
  );
} finally {
  await browser.close();
}
