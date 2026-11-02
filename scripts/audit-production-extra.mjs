// node scripts/audit-production-extra.mjs [Playwright module URL]
const { chromium } = await import(process.argv[2] || 'playwright');
import { mkdir, writeFile } from 'node:fs/promises';
const out='state/audit-2026-11-01'; await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1366,height:900}});
const page=await context.newPage(); page.setDefaultTimeout(10000);
const base='https://feria-imperio.vercel.app'; const results=[];
async function test(name,fn){try{results.push({name,details:await fn(),status:'completed'});}catch(e){results.push({name,status:'test-error',error:e.message});}console.log(JSON.stringify(results.at(-1)));await writeFile(`${out}/extra-results.json`,JSON.stringify(results,null,2));}
async function buyer(){await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:/María Gómez/}).click();}
async function seller(){await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await page.getByRole('tab',{name:'Soy Feriante'}).click();await page.locator('#login-usuario-feriante').fill('fer-01');await page.getByRole('dialog').locator('form').getByRole('button',{name:'Iniciar sesión',exact:true}).click();await page.waitForURL('**/admin');}
async function logout(){await page.locator('header').getByRole('button').filter({has:page.locator('img')}).click();await page.locator('header').getByRole('button',{name:/Cerrar Sesión/i}).first().click();}
try{
 await page.goto(base);
 await test('Product question and seller answer through public UI',async()=>{
  await buyer();await page.goto(`${base}/producto/prd-01`);
  await page.getByLabel('¿Qué querés saber sobre este producto?').fill('PRUEBA QA: ¿incluye bombilla?');
  await page.getByRole('button',{name:'Enviar pregunta',exact:true}).click();await page.getByRole('status').filter({hasText:'Se publicó correctamente.'}).waitFor();
  await logout();await seller();
  const questions=await page.getByRole('region',{name:'Preguntas',exact:true}).innerText();console.log('QUESTIONS_REGION '+questions);
  await page.screenshot({path:`${out}/vendor-questions.png`,fullPage:true});
  await page.getByLabel(/Respuesta para/).first().fill('PRUEBA QA: sí, incluye bombilla.');await page.getByRole('button',{name:'Publicar respuesta',exact:true}).first().click();
  await page.getByRole('button',{name:'Respondidas',exact:true}).click();await page.getByText('PRUEBA QA: sí, incluye bombilla.',{exact:true}).waitFor();
  await page.goto(`${base}/producto/prd-01`);await page.getByText('PRUEBA QA: sí, incluye bombilla.',{exact:true}).waitFor();
  await page.screenshot({path:`${out}/question-answer.png`,fullPage:true});return {published:true,answered:true,visibleOnProduct:true};
 });
 await test('Deleting seeded product reappears after reload',async()=>{
  await page.goto(`${base}/admin`);await page.getByRole('button',{name:'Editar producto Mate Imperial Cincelado en Alpaca',exact:true}).waitFor();
  const row=page.getByRole('row').filter({has:page.getByRole('button',{name:'Editar producto Mate Imperial Cincelado en Alpaca',exact:true})});
  page.once('dialog',d=>d.accept());await row.getByTitle('Eliminar producto',{exact:true}).click();
  await page.getByRole('button',{name:'Editar producto Mate Imperial Cincelado en Alpaca',exact:true}).waitFor({state:'hidden'});
  const removedImmediately=true;await page.reload();await page.getByRole('button',{name:'Editar producto Mate Imperial Cincelado en Alpaca',exact:true}).waitFor();
  await page.screenshot({path:`${out}/deleted-product-reappears.png`,fullPage:true});return {removedImmediately,reappearedAfterReload:true};
 });
 await test('Stock disabled prevents adding and buying existing cart',async()=>{
  await logout();await buyer();await page.goto(`${base}/producto/prd-01`);await page.getByRole('button',{name:'Agregar al carrito'}).click();await page.getByRole('button',{name:'Cerrar carrito'}).click();
  await logout();await seller();await page.getByRole('switch',{name:'Disponibilidad de Mate Imperial Cincelado en Alpaca',exact:true}).click();
  await page.goto(`${base}/producto/prd-01`);await page.getByRole('button',{name:'Sin stock',exact:true}).waitFor();
  const disabled=await page.getByRole('button',{name:'Sin stock',exact:true}).isDisabled();
  await logout();await buyer();await page.goto(`${base}/checkout`);await page.getByRole('button',{name:'Finalizar compra',exact:true}).click();
  await page.getByRole('alert').filter({hasText:/ya no está disponible/}).waitFor();
  return {addDisabled:disabled,checkoutError:await page.getByRole('alert').allTextContents()};
 });
 await test('Guest cart unreachable after closing drawer',async()=>{
  await logout();await page.goto(`${base}/producto/prd-03`);await page.getByRole('button',{name:'Agregar al carrito'}).click();await page.getByRole('button',{name:'Cerrar carrito'}).click();
  const desktop=await page.getByRole('button',{name:/Mi carrito/}).count();
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Abrir menú de navegación'}).click();
  const mobile=await page.getByRole('button',{name:/Mi carrito/}).count();await page.screenshot({path:`${out}/guest-menu-no-cart.png`,fullPage:true});
  await page.setViewportSize({width:1366,height:900});await page.keyboard.press('Escape');return {desktopCartButtons:desktop,mobileCartButtons:mobile,items:await page.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_cart')).state.items.length)};
 });
 await test('Out of stock product card allows adding',async()=>{
  await page.goto(base);await buyer();
  const card=page.getByRole('article').filter({has:page.getByRole('heading',{name:'Tabla para Asado en Algarrobo Macizo',exact:true})});
  await card.waitFor();const text=await card.innerText();const add=card.getByRole('button',{name:/Agregar .* al carrito/});
  const enabled=await add.isEnabled();await add.click();const items=await page.evaluate(()=>JSON.parse(localStorage.getItem('feria_imperio_cart')).state.items);
  await page.screenshot({path:`${out}/out-of-stock-added.png`,fullPage:true});await page.getByRole('button',{name:'Cerrar carrito'}).click();await logout();return {text,enabled,addedOutOfStock:items.some(i=>i.producto.id==='prd-05')};
 });
 await test('Contact storage failure still reports sent',async()=>{
  await page.goto(`${base}/#contacto`);await page.locator('[name=nombreCompleto]').fill('QA Storage');await page.locator('[name=nombreEmprendimiento]').fill('PRUEBA NO REAL');await page.locator('[name=email]').fill('qa.storage@example.com');
  await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='feria_imperio_consultas')throw new DOMException('QA quota','QuotaExceededError');return original.call(this,key,value);};});
  await page.getByRole('button',{name:'Enviar Consulta / Postulación'}).click();await page.getByText('¡Solicitud Enviada!',{exact:true}).waitFor();
  return {successDespiteStorageFailure:true,stored:await page.evaluate(()=>localStorage.getItem('feria_imperio_consultas'))};
 });
}finally{await browser.close();}
