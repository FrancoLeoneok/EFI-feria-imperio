import assert from 'node:assert/strict';
const { chromium } = await import(process.argv[2] || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto(process.argv[3] || 'http://127.0.0.1:5181');
  const result = await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { PRODUCTOS_MOCK, FERIANTES_MOCK, COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    const repo = await import('/src/repositories/questions.ts');
    const product = PRODUCTOS_MOCK[0];
    const owner = FERIANTES_MOCK.find((seller) => seller.id === product.ferianteId);
    const other = FERIANTES_MOCK.find((seller) => seller.id !== product.ferianteId);
    const failures = [];
    async function denied(name, operation) {
      try { await operation(); failures.push(name); } catch { /* Expected denial. */ }
    }
    useAuthStore.getState().logout();
    await denied('anonymous question', () => repo.askQuestion(product.id, 'Hola'));
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
    await denied('blank', () => repo.askQuestion(product.id, '   '));
    await denied('too long', () => repo.askQuestion(product.id, 'a'.repeat(1001)));
    await denied('missing product', () => repo.askQuestion('missing', 'Hola'));
    await repo.askQuestion(product.id, '¿Se puede personalizar?');
    const question = (await repo.listQuestions())[0];
    await denied('buyer answer', () => repo.answerQuestion(question.id, 'Sí'));
    useAuthStore.getState().loginDirecto(other);
    await denied('other seller', () => repo.answerQuestion(question.id, 'Sí'));
    useAuthStore.getState().loginDirecto(owner);
    return { failures, question, product };
  });
  assert.deepEqual(result.failures, []);
  await page.goto(new URL('/admin', page.url()).href);
  const section = page.getByRole('region', { name: 'Preguntas', exact: true });
  await section.getByText('1 pregunta pendiente', { exact: true }).waitFor();
  await section.getByRole('textbox').fill('Sí, lo personalizamos a tu gusto.');
  await section.getByRole('button', { name: 'Publicar respuesta' }).click();
  await section.getByText('No tenés preguntas pendientes.', { exact: true }).waitFor();
  assert.equal(await section.getByText('1 pregunta pendiente', { exact: true }).count(), 0);
  await section.getByRole('button', { name: 'Respondidas', exact: true }).click();
  await section.getByText('Sí, lo personalizamos a tu gusto.', { exact: true }).waitFor();
  const duplicateRejected = await page.evaluate(async (id) => {
    const { answerQuestion } = await import('/src/repositories/questions.ts');
    try { await answerQuestion(id, 'Otra'); return false; } catch { return true; }
  }, result.question.id);
  assert.equal(duplicateRejected, true);
  await page.reload();
  await section.getByText('No tenés preguntas pendientes.', { exact: true }).waitFor();
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    useAuthStore.getState().logout();
  });
  await page.goto(new URL(`/tienda/${result.product.ferianteId}`, page.url()).href);
  // Product cards expose a detail button; choose the requested product by its card.
  const heading = page.getByRole('heading', { name: result.product.titulo, exact: true });
  await heading.waitFor();
  await heading.click();
  const detail = page.getByRole('main');
  await page.waitForURL(`**/producto/${result.product.id}`);
  await detail.waitFor();
  await detail.getByText('Sí, lo personalizamos a tu gusto.', { exact: true }).waitFor();
  await detail.getByRole('button', { name: 'Iniciá sesión para preguntar' }).click();
  await page.getByRole('dialog').waitFor();
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
  });
  await detail.getByRole('textbox').fill('¿Cuánto demora la personalización?');
  await detail.getByRole('button', { name: 'Enviar pregunta' }).click();
  await detail.getByText('Se publicó correctamente.', { exact: true }).waitFor();
  await detail.getByText('¿Cuánto demora la personalización?', { exact: true }).waitFor();
  assert.equal(await detail.getByRole('textbox').inputValue(), '');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []);
  console.log('PASS: permissions, validation, pending count, answer history, persistence and public mobile product view.');
} finally { await browser.close(); }
