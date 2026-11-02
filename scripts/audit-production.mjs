// node scripts/audit-production.mjs [Playwright module URL]
const { chromium } = await import(process.argv[2] || 'playwright');
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'state/audit-2026-11-01';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({channel:'chrome',headless:true});
const context = await browser.newContext({viewport:{width:1366,height:900}});
const page = await context.newPage();
page.setDefaultTimeout(10000);
const results = [], errors = [], requests = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
page.on('pageerror', e => errors.push(e.message));
context.on('request', r => { if(['xhr','fetch'].includes(r.resourceType())) requests.push({method:r.method(),url:r.url()}); });
const base = 'https://feria-imperio.vercel.app';
async function test(name, fn) { try { const details = await fn(); results.push({name,status:'completed',details}); console.log(JSON.stringify(results.at(-1))); } catch(e) { results.push({name,status:'test-error',error:e.message}); console.log(JSON.stringify(results.at(-1))); await page.screenshot({path:`${out}/failure-${results.length}.png`,fullPage:true}).catch(()=>{}); } await writeFile(`${out}/results.json`,JSON.stringify({results,errors,requests},null,2)); }
async function loginBuyer(p, name='María Gómez') {
 await p.getByRole('button',{name:'Iniciar sesión',exact:true}).click();
 await p.getByRole('dialog').getByRole('button',{name:new RegExp(name)}).click();
 await p.getByRole('dialog').waitFor({state:'hidden'});
}
async function logout(p) {
 await p.locator('header').getByRole('button').filter({has:p.locator('img')}).click();
 await p.getByRole('button',{name:/Cerrar Sesión/i}).click();
}
let checkout, orderURL;
try {
 await test('Home, search and filters',async()=>{
  await page.goto(base); await page.getByRole('heading',{name:'Explorá las Tiendas de la Feria'}).waitFor();
  await page.locator('a[href="/tienda/fer-01"]').first().waitFor();
  const stores=await page.locator('a[href^="/tienda/"]').count();
  await page.getByRole('combobox',{name:'Filtrar por paseo'}).selectOption('parque_sarmiento');
  await page.waitForTimeout(700); const filtered=await page.locator('a[href^="/tienda/"]').count();
  await page.getByRole('combobox',{name:'Filtrar por paseo'}).selectOption('todas');
  await page.getByPlaceholder('Buscar puestos, rubros o artículos (ej: mate, cazuela)...').fill('mate');
  await page.getByRole('heading',{name:/Artículos encontrados/}).waitFor();
  const search=await page.locator('#catalogo').innerText();
  await page.getByPlaceholder('Buscar puestos, rubros o artículos (ej: mate, cazuela)...').fill('zzzinexistenteQA');
  await page.waitForTimeout(700); const empty=await page.locator('#catalogo').innerText();
  let clearButtonWorks=true;
  try { await page.getByRole('button',{name:'Limpiar búsqueda',exact:true}).first().click({timeout:2000}); } catch { clearButtonWorks=false; }
  await page.screenshot({path:`${out}/search-clear-overlap.png`,fullPage:true});
  await page.getByPlaceholder('Buscar puestos, rubros o artículos (ej: mate, cazuela)...').fill('');
  return {stores,filtered,search,empty,clearButtonWorks};
 });
 await test('Store, product and guest cart',async()=>{
  await page.goto(`${base}/tienda/fer-01`); await page.waitForTimeout(800);
  const store=await page.locator('h1').innerText();
  await page.goto(`${base}/producto/prd-01`); await page.getByRole('button',{name:'Agregar al carrito'}).waitFor();
  const product=await page.locator('h1').innerText();
  await page.getByRole('button',{name:'Agregar al carrito'}).click();
  await page.getByRole('button',{name:'Aumentar cantidad'}).click();
  await page.getByRole('button',{name:'Disminuir cantidad'}).click();
  await page.getByRole('button',{name:'Cerrar carrito'}).click();
  const guestCartButton=await page.getByRole('button',{name:/Mi carrito/}).count();
  await page.reload(); await page.getByRole('button',{name:'Agregar al carrito'}).waitFor();
  return {store,product,guestCartButton,cart:await page.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_cart')))};
 });
 await test('Checkout two stores, receipt validation and reload',async()=>{
  await loginBuyer(page);
  await page.goto(`${base}/producto/prd-03`); await page.getByRole('button',{name:'Agregar al carrito'}).click();
  [checkout]=await Promise.all([context.waitForEvent('page'),page.getByRole('link',{name:/^Comprar/}).click()]);
  checkout.setDefaultTimeout(10000); await checkout.waitForLoadState();
  await checkout.getByRole('button',{name:'Finalizar compra',exact:true}).waitFor();
  const before=await checkout.locator('main').innerText();
  await checkout.getByRole('button',{name:'Finalizar compra',exact:true}).click();
  await checkout.getByRole('heading',{name:'Compra realizada',exact:true}).waitFor(); orderURL=checkout.url();
  await checkout.locator('input[type=file]').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('QA invalid')});
  const invalid=await checkout.getByRole('alert').allTextContents();
  await checkout.locator('input[type=file]').setInputFiles('public/favicon.png');
  await checkout.getByAltText('Comprobante 1',{exact:true}).waitFor();
  await checkout.getByRole('button',{name:'Guardar comprobantes'}).click();
  await checkout.getByRole('status').filter({hasText:'Comprobantes guardados'}).waitFor();
  await checkout.reload(); await checkout.getByAltText('Comprobante 1',{exact:true}).waitFor();
  await checkout.screenshot({path:`${out}/purchase-receipt.png`,fullPage:true});
  return {before,orderURL,invalid,confirmation:await checkout.locator('main').innerText(),cartCleared:await checkout.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_cart')).state.items.length===0)};
 });
 await test('Footer Inicio and Paseos from product',async()=>{
  await page.goto(`${base}/producto/prd-01`); await page.getByRole('button',{name:'Agregar al carrito'}).waitFor();
  await page.locator('footer').getByRole('link',{name:'Inicio',exact:true}).click();
  const inicio={url:page.url(),targetExists:await page.locator('#inicio').count()};
  await page.locator('footer').getByRole('link',{name:'Paseos de Ferias',exact:true}).click();
  return {inicio,paseos:{url:page.url(),targetExists:await page.locator('#ferias').count()}};
 });
 await test('Postular link for authenticated buyer',async()=>{
  await page.locator('footer').getByRole('link',{name:'Postular mi Puesto',exact:true}).click();
  await page.waitForTimeout(800);
  return {url:page.url(),targetExists:await page.locator('#contacto').count(),feriasExists:await page.locator('#ferias').count()};
 });
 await test('Buyer re-login and saved purchase',async()=>{
  await logout(page); await loginBuyer(page);
  await page.goto(orderURL); await page.getByRole('heading',{name:'Compra realizada',exact:true}).waitFor();
  return {demoBuyerCanRecover:true};
 });
 await test('Vendor sales and receipt preview same browser',async()=>{
  await logout(page); await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();
  await page.getByRole('tab',{name:'Soy Feriante'}).click();
  const dialog=page.getByRole('dialog');
  console.log('VENDOR_DIALOG '+await dialog.innerText());
  const fields=dialog.locator('input'); await fields.first().fill('fer-01');
  await dialog.locator('form').getByRole('button',{name:/Iniciar|Ingresar|Acceder/}).click();
  await page.waitForURL('**/admin'); await page.getByRole('heading',{name:'Ventas',exact:true}).waitFor();
  await page.getByRole('button',{name:/Ver comprobante 1 del pedido/}).click();
  await page.getByRole('dialog',{name:'Comprobante de transferencia'}).waitFor();
  await page.screenshot({path:`${out}/vendor-receipt.png`,fullPage:true});
  await page.getByRole('button',{name:'Cerrar comprobante'}).click();
  return {saleCount:await page.getByRole('article',{name:/Venta /}).count(),receiptOpens:true};
 });
 await test('Independent browser cannot see order or vendor sale',async()=>{
  const independent=await browser.newContext(); const p=await independent.newPage(); p.setDefaultTimeout(10000);
  await p.goto(base); await loginBuyer(p); await p.goto(orderURL);
  await p.getByText('No encontramos este pedido para tu cuenta.',{exact:true}).waitFor();
  const message=await p.locator('main').innerText();
  await logout(p); await p.getByRole('button',{name:'Iniciar sesión',exact:true}).click(); await p.getByRole('tab',{name:'Soy Feriante'}).click();
  await p.getByRole('dialog').locator('input').first().fill('fer-01');
  await p.getByRole('dialog').locator('form').getByRole('button',{name:/Iniciar|Ingresar|Acceder/}).click();
  await p.getByText('Todavía no tenés ventas',{exact:true}).waitFor();
  await p.screenshot({path:`${out}/independent-vendor-no-sales.png`,fullPage:true});
  await independent.close(); return {sameBuyerCannotRecover:message,independentVendorSales:0};
 });
 await test('Privacy and guides',async()=>{
  await page.getByRole('button',{name:'Políticas de Privacidad'}).click();
  const privacy=await page.getByRole('dialog').innerText(); await page.keyboard.press('Escape');
  if(await page.getByRole('dialog').count()) await page.getByRole('dialog').getByRole('button',{name:/Cerrar/}).first().click();
  await page.getByRole('button',{name:'Guía de feriante'}).click();
  const guide=await page.getByRole('dialog').innerText(); await page.keyboard.press('Escape');
  return {privacy,guide};
 });
 await test('Mobile navigation and dark mode',async()=>{
  await page.goto(base); await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Abrir menú de navegación'}).click();
  const menu=await page.getByRole('navigation',{name:'Navegación de cuenta'}).innerText(); await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Cambiar a modo oscuro'}).click();
  const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,dark:document.documentElement.classList.contains('dark')}));
  await page.screenshot({path:`${out}/mobile-dark.png`,fullPage:true});
  await page.setViewportSize({width:1366,height:900}); return {menu,overflow};
 });
 await test('Registration then re-login loses account identity',async()=>{
  await logout(page); await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click(); await page.getByRole('button',{name:'Crear tu cuenta',exact:true}).click();
  const email='qa.auditoria@example.com';
  await page.locator('#register-comprador-nombre').fill('QA Auditoría'); await page.locator('#register-comprador-email').fill(email);
  await page.locator('#register-comprador-password').fill('QAoriginal987'); await page.locator('#register-comprador-confirm-password').fill('QAoriginal987');
  console.log('REGISTER_BUTTONS '+await page.getByRole('dialog').locator('form').innerText());
  await page.getByRole('dialog').getByRole('button',{name:'Crear cuenta',exact:true}).click(); await page.getByRole('dialog').waitFor({state:'hidden'});
  const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_auth')).state.currentComprador);
  await logout(page); await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Iniciar Sesión',exact:true}).click();
  await page.locator('#login-comprador-nombre').fill(email); await page.locator('#login-comprador-password').fill('WRONGpassword');
  await page.getByRole('button',{name:'Iniciar Sesión como Comprador'}).click(); await page.getByRole('dialog').waitFor({state:'hidden'});
  const second=await page.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_auth')).state.currentComprador);
  return {first,second,identityChanged:first.id!==second.id,wrongPasswordAccepted:true};
 });
 await test('Postulation reports success with local storage only',async()=>{
  await logout(page); await page.goto(`${base}/#contacto`);
  await page.locator('input[name=nombreCompleto]').fill('QA Auditoría'); await page.locator('input[name=nombreEmprendimiento]').fill('PRUEBA QA NO REAL');
  await page.locator('input[name=email]').fill('qa.auditoria@example.com');
  await page.locator('textarea').fill('Prueba funcional autorizada. No es una postulación real.');
  const before=requests.length;
  await page.getByRole('button',{name:'Enviar Consulta / Postulación'}).click(); await page.getByText('¡Solicitud Enviada!',{exact:true}).waitFor();
  return {requestsDuringSubmit:requests.slice(before),stored:await page.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_consultas')))};
 });
 await test('Missing routes and entities',async()=>{
  const cases=[];
  for(const path of ['/ruta-qa-inexistente','/producto/qa-no-existe','/tienda/qa-no-existe','/checkout?pedido=qa-no-existe','/admin']) {
   const response=await page.goto(base+path); await page.waitForTimeout(700); cases.push({path,http:response.status(),headings:await page.locator('h1,h2').allTextContents()});
  } return cases;
 });
} finally { await writeFile(`${out}/results.json`,JSON.stringify({results,errors,requests},null,2)); await browser.close(); }
