const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const mac='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (fs.existsSync(mac)?mac:undefined),headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const u=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)?route.continue():route.abort();});
 await page.goto(process.env.CAMP_TEST_URL || 'http://127.0.0.1:5174');await page.screenshot({path:path.join(os.tmpdir(),'camp-title.png'),fullPage:true});
 await page.getByRole('button',{name:/Begin your adventure/}).click();await page.getByLabel('First name').fill('Scout');await page.getByRole('button',{name:'Let’s go'}).click();
 await page.screenshot({path:path.join(os.tmpdir(),'camp-map.png'),fullPage:true});
 await page.getByRole('button',{name:'Continue the journey'}).click();await page.getByRole('button',{name:'Light the first lantern'}).click();
 await page.screenshot({path:path.join(os.tmpdir(),'camp-lesson.png'),fullPage:true});
 let draft=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('camp-compass.trail.')))));
 await page.getByRole('button',{name:draft.deck[0].answer,exact:false}).click();
 await page.getByRole('button',{name:'Next lantern'}).click();
 await page.getByRole('button',{name:'Pause',exact:false}).click();assert(await page.getByRole('dialog').isVisible());
 await page.getByRole('button',{name:'Return to camp',exact:true}).click();
 await page.getByRole('button',{name:'Continue the journey'}).click();await page.getByRole('button',{name:'Resume at stop 2'}).click();
 await page.reload();await page.getByRole('button',{name:'Continue as Scout'}).click();await page.getByRole('button',{name:'Continue the journey'}).click();await page.getByRole('button',{name:'Resume at stop 2'}).click();
 for(let i=1;i<6;i++){
  draft=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('camp-compass.trail.')))));
  assert.equal(draft.index,i);const q=draft.deck[i];
  await page.getByRole('button',{name:q.answer,exact:false}).click();
  await page.getByRole('button',{name:i===5?'Complete the trail':'Next lantern',exact:false}).click();
 }
 assert(await page.getByRole('heading',{name:'Lanterns blazing!'}).isVisible());await page.screenshot({path:path.join(os.tmpdir(),'camp-results.png'),fullPage:true});
 const store=await page.evaluate(()=>JSON.parse(localStorage.getItem('camp-compass.v1')));assert.equal(store.children[0].sessions[0].correct,6);assert.equal(store.children[0].sessions[0].errors,0);
 await page.getByRole('button',{name:'Next trail'}).click();assert(await page.getByRole('button',{name:'Light the first lantern'}).isVisible());
 await page.getByRole('button',{name:'Expedition',exact:false}).click();assert(await page.locator('.usa-state.is-lit').count()>0);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(os.tmpdir(),'camp-mobile.png'),fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 
 // Exercise a matching trail using an existing v1 family save.
 await page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('camp-compass.v1'));data.settings.sound=false;data.children[0].completedLessons['ne-shapes']={stars:3,bestAccuracy:100,attempts:1,completedAt:Date.now()};localStorage.setItem('camp-compass.v1',JSON.stringify(data));});
 await page.goto((process.env.CAMP_TEST_URL || 'http://127.0.0.1:5174')+'?play=match');
 await page.getByRole('button',{name:'Continue as Scout'}).click();
 await page.getByRole('button',{name:'Continue the journey'}).click();
 await page.getByRole('button',{name:'Light the first lantern'}).click();
 draft=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('camp-compass.trail.')))));
 const match=draft.deck[0];assert.equal(match.kind,'match');
 // Match one pair by keyboard; make a mistake with the second; recover it.
 const left=page.locator('.match-col').first();const right=page.locator('.match-col').last();
 await left.getByRole('button',{name:match.left[0].label,exact:true}).focus();await page.keyboard.press('Enter');
 await right.locator('[data-capital="'+match.left[0].id+'"]').click();
 await left.getByRole('button',{name:match.left[1].label,exact:true}).click();
 await right.locator('[data-capital="'+match.left[2].id+'"]').click();
 await page.screenshot({path:path.join(os.tmpdir(),'camp-match-mobile.png'),fullPage:true});
 await page.getByRole('button',{name:'Try that connection'}).click();
 assert(await left.getByRole('button',{name:match.left[0].label,exact:true}).isDisabled());
 for(const item of match.left.slice(1)){await left.getByRole('button',{name:item.label,exact:true}).click();await right.locator('[data-capital="'+item.id+'"]').click();}
 draft=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('camp-compass.trail.')))));
 assert.equal(draft.correct,4);assert.equal(draft.errors,1);assert.equal(draft.stateErrors[match.left[1].id],1);assert.equal(draft.factsFound.length,4);
 await page.getByRole('button',{name:'Next lantern'}).click();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Complete the remaining mixed trail through its visible controls.
 for(let i=1;i<draft.deck.length;i++){
  const q=draft.deck[i];
  if(q.kind==='choice')await page.locator('.choice-grid').getByRole('button',{name:q.answer,exact:false}).click();
  else if(q.kind==='tap')await page.locator('[data-state="'+q.stateId+'"]').click();
  else for(const item of q.left){await left.getByRole('button',{name:item.label,exact:true}).click();await right.locator('[data-capital="'+item.id+'"]').click();}
  await page.getByRole('button',{name:i===draft.deck.length-1?'Complete the trail':'Next lantern',exact:false}).click();
 }
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('camp-compass.v1')));const session=after.children[0].sessions.at(-1);assert.equal(session.errors,1);assert.equal(session.stateErrors[match.left[1].id],1);assert.equal(after.settings.sound,false);assert.equal(after.children[0].completedLessons['ne-meet'].stars,3);
 
 // Complete a passport challenge with a legacy progress fixture.
 await page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('camp-compass.v1'));for(const id of ['ne-meet','ne-shapes','ne-capitals-north','ne-mid','ne-capitals-south','ne-facts'])data.children[0].completedLessons[id]={stars:3,bestAccuracy:100,attempts:1,completedAt:Date.now()};localStorage.setItem('camp-compass.v1',JSON.stringify(data));});
 await page.goto(process.env.CAMP_TEST_URL || 'http://127.0.0.1:5174');await page.getByRole('button',{name:'Continue as Scout'}).click();await page.getByRole('button',{name:'Continue the journey'}).click();await page.getByRole('button',{name:'Light the first lantern'}).click();
 draft=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('camp-compass.trail.')))));
 assert.equal(draft.lessonId,'ne-exam');
 for(let i=0;i<draft.deck.length;i++){
  const q=draft.deck[i];
  if(q.kind==='choice')await page.locator('.choice-grid').getByRole('button',{name:q.answer,exact:false}).click();
  else {await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.getByRole('button',{name:'Reset map view',exact:true}).click();await page.locator('[data-state="'+q.stateId+'"]').focus();await page.keyboard.press('Enter');}
  await page.getByRole('button',{name:i===draft.deck.length-1?'Complete the trail':'Next lantern',exact:false}).click();
 }
 assert(await page.getByText('Maple Camp passport stamped',{exact:false}).isVisible());await page.getByRole('button',{name:'Camps',exact:true}).click();assert(await page.locator('.passport-seal.earned').count()===0); // recommended camp advances
 await page.getByRole('tab',{name:/Maple Camp/}).click();assert(await page.locator('.passport-seal.earned').count()===1);
 await page.getByRole('button',{name:'Story journal',exact:true}).click();await page.getByRole('textbox',{name:'Search states or capitals'}).fill('Maine');assert.equal(await page.locator('.journal-card').count(),1);
 await page.getByRole('button',{name:'Camps',exact:false}).click();await page.getByRole('button',{name:'Settings',exact:true}).click();assert.equal(await page.getByLabel('Sounds',{exact:true}).isChecked(),false);
 await page.getByRole('button',{name:'Parent reports',exact:true}).click();assert(await page.getByRole('heading').count()>0);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: new explorer, complete trail, pause, resume, reload, scores, discoveries, next trail reset, mobile width, matching recovery, legacy save, passport unlock, keyboard map, journal search, settings, parent entry, no browser errors');
})().catch(e=>{console.error(e);process.exit(1)});
