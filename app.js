{
'use strict';
const NS='http://www.w3.org/2000/svg';
const RM=matchMedia('(prefers-reduced-motion: reduce)'),fineHover=matchMedia('(hover: hover) and (pointer: fine)');
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-t,3);
const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const smooth=t=>t*t*(3-2*t);
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function rng(s){return()=>{s=(s*9301+49297)%233280;return s/233280}}
function el(n,a,p){const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
const hex=h=>h.replace('#','').match(/\w\w/g).map(x=>parseInt(x,16));
function mix(a,b,t){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}
function stopsAt(stops,p){for(let i=1;i<stops.length;i++){if(p<=stops[i][0]){const[a,c0]=stops[i-1],[b,c1]=stops[i];return mix(c0,c1,smooth(clamp((p-a)/((b-a)||1))))}}return mix(stops[stops.length-1][1],stops[stops.length-1][1],0)}
const isWide=()=>innerWidth>900;
const motion=()=>!RM.matches&&isWide()&&innerHeight>680;

/* ================= SKYLINES ================= */
/* Downtown Toronto from the lake, west to east. Design space: heights for a 440-unit tall view. k scales everything. */
const NAMES={
  rogers:['Rogers Centre','Home of the Blue Jays. Opened in 1989 as SkyDome, with a retractable roof.'],
  cn:['CN Tower','553 metres tall, completed in 1976.'],
  rbp:['Royal Bank Plaza','Its windows are coated in real gold.'],
  td:['TD Centre','Designed by Ludwig Mies van der Rohe. The first tower opened in 1967.'],
  ccw:['Commerce Court West','CIBC\'s 1972 tower, the tallest in Canada until 1975.'],
  fcp:['First Canadian Place','BMO\'s headquarters, 298 metres, completed in 1975.'],
  scotia:['Scotia Plaza','Scotiabank\'s red-granite tower, completed in 1988.'],
  bay:['Bay Adelaide Centre','Its west tower opened in 2009.'],
  brook:['Brookfield Place','Home of the Allen Lambert Galleria by Santiago Calatrava.'],
  soldiers:['Soldiers\' Tower','U of T\'s memorial bell tower, completed in 1924.'],
  uc:['University College','One of U of T\'s founding colleges. Its building dates to 1859.'],
  con:['Convocation Hall','U of T\'s domed rotunda, opened in 1907.'],
  robarts:['Robarts Library','U of T\'s main humanities and social sciences library, opened in 1973.'],
  rotman:['Rotman School of Management','U of T\'s business school, at 105 St. George Street.'],
  rom:['Royal Ontario Museum','The Michael Lee-Chin Crystal, opened in 2007.']
};
function nameIt(e,key){if(!key)return e;e.classList.add('nm');e.dataset.name=NAMES[key][0];e.dataset.fact=NAMES[key][1];return e}
function winGrid(g,x,y,w,H,k,r,win,cls){if(!win)return;const sy=24*k,sx=16*k;for(let wy=y+20*k;wy<H-12*k;wy+=sy)for(let wx=x+8*k;wx<x+w-10*k;wx+=sx){if(r()<.22){const e=el('rect',{x:wx,y:wy,width:7*k,height:9*k,fill:win,class:'w'},g);e.dataset.k=(.56+r()*.3).toFixed(3)}}}
function filler(g,x0,x1,H,minH,maxH,c,r,win,k=1,cls='bld'){let x=x0;while(x<x1){const w=(36+r()*90)*k,h=minH+r()*(maxH-minH);el('rect',{x,y:H-h,width:w+1,height:h,fill:c,class:cls},g);winGrid(g,x,H-h,w,H,k,r,win);if(r()<.2)el('rect',{x:x+w/2-2*k,y:H-h-22*k,width:4*k,height:22*k,fill:c,class:cls},g);x+=w+r()*4*k}return x}
function downtown(g,ox,H,c,win,r,k=1,named=false,cls='bld'){
  const P=(d,key)=>nameIt(el('path',{d,fill:c,class:cls},g),named&&key);
  const R=(x,y,w,h,key)=>nameIt(el('rect',{x,y,width:w,height:h,fill:c,class:cls},g),named&&key);
  const X=v=>ox+v*k,Y=v=>H-v*k;
  const boxes=[[0,70,90],[74,50,130],[128,64,110],[196,46,170],[246,80,120],[330,58,190],[392,70,150]];
  for(const[x,w,h]of boxes){R(X(x),Y(h),w*k+1,h*k);winGrid(g,X(x),Y(h),w*k,H,k,r,win)}
  // Rogers Centre
  {const x=X(470),w=190*k,y=Y(58);P(`M${x} ${H} V${y+24*k} Q${x+w/2} ${y-34*k} ${x+w} ${y+24*k} V${H}Z`,'rogers');for(let i=1;i<6;i++)el('line',{x1:x+w*i/6,y1:y+(10+Math.abs(3-i)*6)*k,x2:x+w*i/6,y2:H,stroke:win||'#cae6f8','stroke-width':1.5*k,opacity:.45,'pointer-events':'none'},g)}
  // CN Tower
  {const cx=X(720);const grp=nameIt(el('g',{class:'cn'},g),named&&'cn');const q=(d)=>el('path',{d,fill:c,class:cls},grp);const rr=(x,y,w,h,rx)=>el('rect',{x,y,width:w,height:h,rx:rx||0,fill:c,class:cls},grp);
    q(`M${cx-24*k} ${H} L${cx-9*k} ${Y(248)} L${cx+9*k} ${Y(248)} L${cx+24*k} ${H}Z`);
    q(`M${cx-34*k} ${Y(246)} Q${cx} ${Y(236)} ${cx+34*k} ${Y(246)} L${cx+30*k} ${Y(262)} L${cx-30*k} ${Y(262)}Z`);
    rr(cx-36*k,Y(274),72*k,13*k,6*k);rr(cx-26*k,Y(284),52*k,12*k,5*k);rr(cx-7*k,Y(326),14*k,44*k);rr(cx-10*k,Y(338),20*k,13*k,4*k);rr(cx-3.5*k,Y(404),7*k,68*k);rr(cx-1.5*k,Y(418),3*k,16*k);
    el('rect',{x:cx-32*k,y:Y(269),width:64*k,height:3*k,fill:win||'#cae6f8',opacity:.8,'pointer-events':'none'},grp)}
  const cond=[[770,44,230,1],[818,56,200,0],[878,40,250,-1],[922,62,180,0],[988,48,210,0]];
  for(const[x,w,h,s]of cond){const xx=X(x),ww=w*k,y=Y(h);if(s)P(s>0?`M${xx} ${H} V${y+18*k} L${xx+ww} ${y} V${H}Z`:`M${xx} ${H} V${y} L${xx+ww} ${y+18*k} V${H}Z`);else R(xx,y,ww+1,h*k);winGrid(g,xx,y,ww,H,k,r,win)}
  // Royal Bank Plaza (stepped, gold glass)
  {const x=X(1050),y=Y(150),s=12*k;const e=P(`M${x} ${H} V${y+40*k} H${x+s} V${y+26*k} H${x+2*s} V${y+12*k} H${x+3*s} V${y} H${x+50*k} V${y+20*k} H${x+62*k} V${y+34*k} H${x+74*k} V${H}Z`,'rbp');e.classList.add('rbp')}
  R(X(1132),Y(175),52*k,175*k,'td');R(X(1190),Y(155),46*k,155*k,'td');winGrid(g,X(1132),Y(175),52*k,H,k,r,win);winGrid(g,X(1190),Y(155),46*k,H,k,r,win);
  {const x=X(1242),w=54*k,y=Y(195);const grp=nameIt(el('g',{},g),named&&'ccw');el('rect',{x,y,width:w,height:195*k,fill:c,class:cls},grp);el('rect',{x:x+6*k,y:y-10*k,width:w-12*k,height:12*k,fill:c,class:cls},grp);winGrid(g,x,y,w,H,k,r,win)}
  {const x=X(1302),w=70*k,y=Y(250);P(`M${x} ${H} V${y+8*k} L${x+8*k} ${y} H${x+w-8*k} L${x+w} ${y+8*k} V${H}Z`,'fcp');winGrid(g,x,y,w,H,k,r,win)}
  {const x=X(1380),w=64*k,y=Y(232),s=w/4;P(`M${x} ${H} V${y+16*k} L${x+s} ${y} L${x+2*s} ${y+16*k} L${x+3*s} ${y} L${x+4*s} ${y+16*k} V${H}Z`,'scotia');winGrid(g,x,y+16*k,w,H,k,r,win)}
  R(X(1452),Y(178),56*k,178*k,'bay');winGrid(g,X(1452),Y(178),56*k,H,k,r,win);
  for(const[x,w,h]of[[1514,46,180],[1566,40,156]]){const xx=X(x),ww=w*k,y=Y(h);const grp=nameIt(el('g',{},g),named&&'brook');el('path',{d:`M${xx} ${H} V${y+20*k} H${xx+8*k} V${y+8*k} H${xx+ww-8*k} V${y+20*k} H${xx+ww} V${H}Z`,fill:c,class:cls},grp);el('rect',{x:xx+ww/2-2*k,y:y-26*k,width:4*k,height:30*k,fill:c,class:cls},grp);winGrid(g,xx,y+20*k,ww,H,k,r,win)}
  const east=[[1616,60,140],[1682,38,262,1],[1726,58,170],[1790,70,120],[1866,48,190],[1920,80,110],[2006,56,150],[2068,90,96],[2164,60,130],[2230,80,100],[2316,84,124]];
  for(const[x,w,h,s]of east){const xx=X(x),ww=w*k,y=Y(h);if(s)P(`M${xx} ${H} V${y+18*k} L${xx+ww} ${y} V${H}Z`);else R(xx,y,ww+1,h*k);winGrid(g,xx,y,ww,H,k,r,win)}
  return ox+2400*k;
}
function campus(g,ox,H,c,win,r,k=1){
  const X=v=>ox+v*k,Y=v=>H-v*k;
  const G=key=>nameIt(el('g',{},g),key);
  const P=(grp,d)=>el('path',{d,fill:c,class:'bld'},grp);
  const R=(grp,x,y,w,h)=>el('rect',{x,y,width:w,height:h,fill:c,class:'bld'},grp);
  // Soldiers' Tower
  {const s=G('soldiers');const x=X(40),w=34*k;R(s,x,Y(200),w,200*k);P(s,`M${x-3*k} ${Y(200)} L${x+w/2} ${Y(250)} L${x+w+3*k} ${Y(200)}Z`);for(const dx of[0,w-6*k])R(s,x+dx,Y(214),6*k,16*k)}
  // University College
  {const s=G('uc');const x=X(110);R(s,x,Y(105),300*k,105*k);P(s,`M${x} ${Y(105)} L${x+30*k} ${Y(132)} L${x+60*k} ${Y(105)}Z`);P(s,`M${x+240*k} ${Y(105)} L${x+270*k} ${Y(132)} L${x+300*k} ${Y(105)}Z`);R(s,x+128*k,Y(178),44*k,178*k);P(s,`M${x+124*k} ${Y(178)} L${x+150*k} ${Y(210)} L${x+176*k} ${Y(178)}Z`);
    for(let i=0;i<9;i++)el('rect',{x:x+(14+i*32)*k,y:Y(70),width:8*k,height:22*k,rx:4*k,fill:win,class:'w','pointer-events':'none'},g).dataset.k=(.6+r()*.25).toFixed(3)}
  // Convocation Hall
  {const s=G('con');const x=X(460),w=150*k;R(s,x,Y(92),w,92*k);P(s,`M${x+8*k} ${Y(92)} Q${x+w/2} ${Y(170)} ${x+w-8*k} ${Y(92)}Z`);R(s,x+w/2-6*k,Y(172),12*k,16*k);R(s,x+30*k,Y(112),90*k,20*k);
    for(let i=0;i<6;i++)el('rect',{x:x+(34+i*15)*k,y:Y(88),width:4*k,height:80*k,fill:win,opacity:.5,'pointer-events':'none'},g)}
  // Robarts Library
  {const s=G('robarts');const x=X(660);R(s,x,Y(120),230*k,120*k);P(s,`M${x+30*k} ${Y(120)} L${x+62*k} ${Y(232)} L${x+168*k} ${Y(232)} L${x+200*k} ${Y(120)}Z`);P(s,`M${x+96*k} ${Y(232)} L${x+115*k} ${Y(262)} L${x+134*k} ${Y(232)}Z`);
    for(let y=140;y<224;y+=16)el('rect',{x:x+70*k,y:Y(y),width:90*k,height:3*k,fill:win,opacity:.35,'pointer-events':'none'},g)}
  // Rotman School of Management
  {const s=G('rotman');const x=X(950);R(s,x,Y(120),200*k,120*k);R(s,x+70*k,Y(196),160*k,76*k);R(s,x+60*k,Y(124),180*k,6*k);
    for(let i=0;i<10;i++)el('rect',{x:x+(80+i*15)*k,y:Y(190),width:2*k,height:64*k,fill:win,opacity:.55,'pointer-events':'none'},g);
    for(let i=0;i<12;i++)el('rect',{x:x+(10+i*16)*k,y:Y(110),width:2*k,height:100*k,fill:win,opacity:.45,'pointer-events':'none'},g)}
  // Royal Ontario Museum Crystal
  {const s=G('rom');const x=X(1240);R(s,x+120*k,Y(90),140*k,90*k);P(s,`M${x} ${H} L${x+22*k} ${Y(160)} L${x+70*k} ${Y(108)} L${x+110*k} ${Y(206)} L${x+150*k} ${Y(96)} L${x+190*k} ${Y(140)} L${x+206*k} ${H}Z`)}
  return ox+1500*k;
}
function makeSky(id,W,H,fn){const s=el('svg',{viewBox:`0 0 ${W} ${H}`,preserveAspectRatio:'xMidYMax slice'});fn(s);document.getElementById(id).appendChild(s);return s}
function towerCrane(g,x,H,h,c){const t=H-h;el('rect',{x,y:t,width:10,height:h,fill:'none',stroke:c,'stroke-width':2},g);for(let y=t;y<H;y+=14)el('line',{x1:x,y1:y,x2:x+10,y2:y+14,stroke:c,'stroke-width':1.2},g);el('line',{x1:x-150,y1:t,x2:x+60,y2:t,stroke:c,'stroke-width':3},g);el('line',{x1:x+5,y1:t-26,x2:x-150,y2:t,stroke:c,'stroke-width':1.2},g);el('line',{x1:x+5,y1:t-26,x2:x+60,y2:t,stroke:c,'stroke-width':1.2},g);el('rect',{x:x+38,y:t,width:22,height:12,fill:c},g);el('line',{x1:x-90,y1:t,x2:x-90,y2:t+60,stroke:c,'stroke-width':1.2},g)}
makeSky('far',5200,330,s=>filler(s,0,5200,330,50,190,'#cae6f8',rng(7)));
makeSky('mid',5200,300,s=>filler(s,0,5200,300,40,170,'#8cc0e0',rng(21)));
makeSky('near',5200,440,s=>{const r=rng(42);filler(s,0,1420,440,40,120,'#3066a0',r,'#cae6f8');downtown(s,1420,440,'#3066a0','#cae6f8',r);towerCrane(s,3350,440,250,'#0e2540');filler(s,3820,5200,440,40,120,'#3066a0',r,'#cae6f8')});
// footer city: thin silhouette
{const s=document.getElementById('footCity');s.setAttribute('viewBox','0 0 3200 440');const r=rng(5);filler(s,0,420,440,40,120,'#12294a',r,null,1,'f');downtown(s,420,440,'#12294a',null,r,1,false,'f');filler(s,2820,3200,440,40,120,'#12294a',r,null,1,'f');filler(s,2820-400,2820,440,40,160,'#12294a',r,null,1,'f')}

/* ================= HERO KEYS ================= */
const startBtn=$('#startBtn');
function startBuilding(){startBtn.classList.add('down');setTimeout(()=>startBtn.classList.remove('down'),160);$('#what').scrollIntoView({behavior:RM.matches?'auto':'smooth',block:'start'})}
startBtn.addEventListener('click',startBuilding);
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&!e.altKey&&(e.key==='b'||e.key==='B')&&$('#top').getBoundingClientRect().bottom>0&&!$('#modal').open){e.preventDefault();startBuilding()}});

/* ================= HEADER ================= */
const topBar=$('#topBar'),ind=$('#ind'),trolley=$('#trolley'),rail=trolley.parentElement;
const navLinks=$$('.nav a.lk, .nav a.sp');
const navMap={top:null,what:'what',why:'what',board:'board',tracks:'board',prizes:'prizes',day:'day',bandsN:'day',sponsors:'sponsors',judges:'judges',faq:'faq',hosts:'hosts',build:null,notify:'hosts'};
const navSecs=[['top','#top'],['what','#what'],['why','#why'],['board','#board'],['tracks','#tracks'],['prizes','#prizes'],['day','#day'],['bandsN','#bandsN'],['sponsors','#sponsors'],['judges','#judges'],['faq','#faq'],['hosts','#hosts'],['build','#build'],['notify','#notify']].map(([k,s])=>[k,$(s)]).filter(([,s])=>s);
const themed=$$('[data-theme]');
let curNav,headerLayout;
function measureHeader(y){const bounds=new Map([...new Set([...navSecs.map(([,s])=>s),...themed])].map(s=>{const r=s.getBoundingClientRect();return[s,[r.top+y,r.bottom+y]]}));const links=new Map(navLinks.map(a=>[a,[a.offsetLeft,a.offsetWidth]]));headerLayout={bounds,links,max:document.documentElement.scrollHeight-innerHeight,railW:rail.clientWidth,indW:ind.offsetWidth};curNav=undefined}
function moveInd(key,links,indW){if(key===curNav)return;curNav=key;const a=key&&navLinks.find(l=>l.dataset.sec===key),[x,w]=links.get(a)||[],show=indW&&w&&!a.classList.contains('sp');navLinks.forEach(l=>{if(l===a)l.setAttribute('aria-current','true');else l.removeAttribute('aria-current')});if(show)ind.style.transform=`translateX(${x}px) scaleX(${w/indW})`;ind.style.opacity=show?1:0}
const menuBtn=$('#menuBtn'),menu=$('#menu');
function closeMenu(restore=false){if(!menu.classList.contains('open'))return;menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');if(restore)menuBtn.focus()}
menuBtn.addEventListener('click',()=>{if(menu.classList.contains('open')){closeMenu();return}menu.classList.add('open');menuBtn.setAttribute('aria-expanded','true');$('a',menu).focus()});
menu.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const section=$(a.hash);if(section){section.tabIndex=-1;section.focus({preventScroll:true})}closeMenu()});
document.addEventListener('focusin',e=>{if(e.target!==menuBtn&&!menu.contains(e.target))closeMenu()});
document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!menuBtn.contains(e.target))closeMenu(menu.contains(document.activeElement))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){e.preventDefault();closeMenu(true)}});
addEventListener('resize',()=>{if(!menu.classList.contains('open')||menuBtn.getClientRects().length)return;const active=document.activeElement;closeMenu();if(menu.contains(active)){const link=navLinks.find(a=>a.hash===active.hash&&a.offsetWidth)||navLinks.find(a=>a.offsetWidth);link?.focus()}});
function header(y){
  if(!headerLayout)measureHeader(y);
  const {bounds,links,max,railW,indW}=headerLayout,active=(s,line)=>{const [top,bottom]=bounds.get(s);return top<=line&&bottom>line};
  const key=navSecs.find(([,s])=>active(s,y+innerHeight*.45))?.[0],sec=themed.find(s=>active(s,y+40));
  moveInd(navMap[key]??null,links,indW);topBar.classList.toggle('on-dark',sec?.dataset.theme==='dark');if(!RM.matches)trolley.style.transform=`translateX(${max>0?clamp(y/max)*railW:0}px)`;
}

/* ================= POINTER ================= */
const ptr={x:-1e4,y:-1e4,vx:0,t:0};
function resetPointer(){ptr.x=ptr.y=-1e4;ptr.vx=ptr.t=0}
addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!fineHover.matches||!motion()||(!visible.has(craneScene)&&!visible.has(why)))return;const now=performance.now(),dt=Math.max(8,now-ptr.t);ptr.vx=ptr.t&&dt<=200?(e.clientX-ptr.x)/dt*1000:0;ptr.x=e.clientX;ptr.y=e.clientY;ptr.t=now;wake()},{passive:true});
addEventListener('pointerleave',resetPointer);fineHover.addEventListener('change',resetPointer);

/* ================= CRANE ================= */
const cs=$('#craneSvg'),load=$('#load'),sign=$('#sign'),slings=$('#slings'),craneScene=$('#what');
const CR={};
function buildCrane(){
  cs.innerHTML='';slings.innerHTML='';
  const vw=innerWidth,vh=innerHeight;cs.setAttribute('viewBox',`0 0 ${vw} ${vh}`);
  const mx=vw-clamp(vw*.1,96,170),jy=Math.max(150,vh*.17),jh=26;
  Object.assign(CR,{vw,vh,mx,jy,jh,py:jy+jh+30});
  const ink='#0e2540';
  CR.mast=el('g',{},cs);
  const gy=vh-30,cp=el('clipPath',{id:'mastClip'},el('defs',{},cs));el('rect',{x:mx,y:jy,width:40,height:gy-jy},cp);
  const lat=el('g',{'clip-path':'url(#mastClip)'},CR.mast);
  for(let y=jy;y<gy;y+=40){el('line',{x1:mx,y1:y,x2:mx+40,y2:y+40,stroke:ink,'stroke-width':1.5},lat);el('line',{x1:mx+40,y1:y,x2:mx,y2:y+40,stroke:ink,'stroke-width':1.5},lat)}
  el('rect',{x:mx,y:jy,width:40,height:gy-jy,fill:'none',stroke:ink,'stroke-width':3},CR.mast);
  el('path',{d:`M${mx-30} ${gy+16} L${mx-16} ${gy} H${mx+56} L${mx+70} ${gy+16}Z`,fill:'#cae6f8',stroke:ink,'stroke-width':3,'stroke-linejoin':'round'},CR.mast);
  el('line',{x1:mx-150,y1:gy+16,x2:Math.min(vw,mx+190),y2:gy+16,stroke:ink,'stroke-width':2},CR.mast);
  for(let x=mx-142;x<Math.min(vw,mx+190);x+=14)el('line',{x1:x,y1:gy+16,x2:x-8,y2:gy+26,stroke:ink,'stroke-width':1.2,opacity:.55},CR.mast);
  el('rect',{x:mx-34,y:jy+jh+4,width:58,height:42,fill:'#f2faff',stroke:ink,'stroke-width':3},CR.mast);el('rect',{x:mx-27,y:jy+jh+11,width:22,height:16,fill:'#cae6f8'},CR.mast);
  CR.jib=el('g',{},cs);
  const L=-900,Rr=mx+300;
  el('line',{x1:L,y1:jy,x2:Rr,y2:jy,stroke:ink,'stroke-width':4},CR.jib);
  el('line',{x1:L,y1:jy+jh,x2:mx+40,y2:jy+jh,stroke:ink,'stroke-width':3},CR.jib);
  for(let x=mx;x>L;x-=40)el('line',{x1:x,y1:jy+jh,x2:x-40,y2:jy,stroke:ink,'stroke-width':1.5},CR.jib);
  el('line',{x1:mx+20,y1:jy-66,x2:mx+20,y2:jy,stroke:ink,'stroke-width':3},CR.jib);
  el('line',{x1:mx+20,y1:jy-66,x2:L,y2:jy,stroke:ink,'stroke-width':1.5},CR.jib);
  el('line',{x1:mx+20,y1:jy-66,x2:Rr-20,y2:jy,stroke:ink,'stroke-width':1.5},CR.jib);
  el('rect',{x:mx+120,y:jy+2,width:110,height:50,fill:'#3066a0'},CR.jib);
  CR.tr=el('g',{},CR.jib);
  el('rect',{x:-28,y:jy+jh+3,width:56,height:15,fill:'#3066a0'},CR.tr);
  CR.wheels=[-15,15].map(dx=>{const w=el('g',{transform:`translate(${dx} ${jy+jh-1})`},CR.tr);el('circle',{r:9,fill:'#f2faff',stroke:ink,'stroke-width':3},w);const sp=el('g',{},w);el('line',{x1:-6,y1:0,x2:6,y2:0,stroke:ink,'stroke-width':2},sp);el('line',{x1:0,y1:-6,x2:0,y2:6,stroke:ink,'stroke-width':2},sp);return sp});
  el('rect',{x:-3,y:jy+jh+18,width:6,height:6,fill:ink},CR.tr);
  el('circle',{cx:0,cy:CR.py,r:7,fill:'none',stroke:ink,'stroke-width':3},CR.tr);
  // load: cable, hook, slings (in load coordinates, pivot = pulley)
  CR.cable=el('line',{x1:0,y1:0,x2:0,y2:100,stroke:ink,'stroke-width':2.5},slings);
  CR.hook=el('path',{d:'M0 0 v12 a8 8 0 1 1 -8 8',fill:'none',stroke:ink,'stroke-width':3},slings);
  CR.sl=el('line',{stroke:ink,'stroke-width':2},slings);CR.sr=el('line',{stroke:ink,'stroke-width':2},slings);
  CR.sw=sign.offsetWidth;CR.sh=sign.offsetHeight;CR.slH=56;
  CR.targetTop=clamp((vh-CR.sh)/2,CR.py+CR.slH+40,Math.max(CR.py+CR.slH+40,vh-CR.sh-16));
  CR.tx=CR.mx-40;CR.vx=0;CR.th=0;CR.om=0;CR.init=true;
}
function craneFrame(dt){
  const r=craneScene.getBoundingClientRect(),vh=innerHeight,sr=ptr.vx?sign.getBoundingClientRect():null;
  const p=clamp(-r.top/(r.height-vh));
  const rise=easeIO(clamp(p/.12)),swing=easeIO(clamp((p-.04)/.12)),hoist=ease(clamp((p-.13)/.15));
  const lift=(1-rise)*vh*.6;CR.mast.setAttribute('transform',`translate(0 ${lift})`);
  const ang=-58*(1-swing);CR.jib.setAttribute('transform',`translate(0 ${lift}) rotate(${ang} ${CR.mx+20} ${CR.jy})`);
  const start=CR.mx-40,mid=CR.vw/2,end=-CR.sw*.8;
  let target;if(p<.3)target=start;else if(p<.5)target=lerp(start,mid,easeIO((p-.3)/.2));else if(p<.72)target=mid;else target=lerp(mid,end,easeIO((p-.72)/.28));
  if(CR.init){CR.tx=target;CR.vx=CR.th=CR.om=0;CR.init=false}
  const prevV=CR.vx,k=1-Math.exp(-dt*7);const nx=Math.abs(target-CR.tx)<.05?target:CR.tx+(target-CR.tx)*k;CR.vx=(nx-CR.tx)/Math.max(dt,1e-3);CR.tx=nx;const ax=(CR.vx-prevV)/Math.max(dt,1e-3);
  CR.tr.setAttribute('transform',`translate(${CR.tx} 0)`);CR.wheels.forEach(w=>w.setAttribute('transform',`rotate(${CR.tx*6.4})`));
  // pendulum: heavy sign, slow and well damped
  const w0=2.0,z=.7;let acc=-w0*w0*CR.th-2*z*w0*CR.om-ax*.00022;
  // cursor nudges it
  if(sr&&ptr.x>sr.left&&ptr.x<sr.right&&ptr.y>sr.top-40&&ptr.y<sr.bottom)acc+=-clamp(ptr.vx,-2500,2500)*.0006;
  CR.om+=acc*dt;CR.th=clamp(CR.th+CR.om*dt,-.028,.028);if(Math.abs(CR.th)<.0002&&Math.abs(CR.om)<.001)CR.th=CR.om=0;
  const signTop=lerp(vh+80,CR.targetTop,hoist);const Lc=Math.max(24,signTop-CR.py-CR.slH);
  CR.cable.setAttribute('y2',Lc);CR.hook.setAttribute('transform',`translate(0 ${Lc})`);
  const bx=CR.sw*.38-6,by=Lc+CR.slH-6;
  CR.sl.setAttribute('x1',0);CR.sl.setAttribute('y1',Lc+20);CR.sl.setAttribute('x2',-bx);CR.sl.setAttribute('y2',by);
  CR.sr.setAttribute('x1',0);CR.sr.setAttribute('y1',Lc+20);CR.sr.setAttribute('x2',bx);CR.sr.setAttribute('y2',by);
  sign.style.left=(-CR.sw/2)+'px';sign.style.top=(Lc+CR.slH)+'px';
  // pivot at pulley; the jib is horizontal by the time the load is visible
  const jibOk=swing>.995;load.style.opacity=jibOk?1:0;
  load.style.transform=`translate3d(${CR.tx}px,${CR.py+lift}px,0) rotate(${CR.th}rad)`;
  return CR.tx!==target||Math.abs(CR.vx)>.05||CR.th!==0||CR.om!==0;
}

/* ================= BANDS ================= */
const tapes=$$('.tape').map(t=>{const run=$('.run',t);const unit=run.innerHTML;run.insertAdjacentHTML('beforeend',`<span class="tape-copy" aria-hidden="true">${unit}</span>`.repeat(3));return{t,run,unitW:0,sp:+t.dataset.speed,sec:t.closest('.bands'),paused:false}});
function measureTapes(){
  const widths=tapes.map(o=>o.run.scrollWidth/4);
  for(const [i,o] of tapes.entries()){
    const w=widths[i];if(w===o.unitW)continue;
    const phase=o.animation?(o.animation.currentTime/o.duration)%1:0;o.animation?.cancel();o.unitW=w;o.animation=null;
    if(w&&o.sp){o.duration=w/Math.abs(o.sp)*1000;const poses=[0,-w].map(x=>({transform:`translate3d(${x}px,0,0)`}));o.animation=o.run.animate(o.sp<0?poses.reverse():poses,{duration:o.duration,iterations:Infinity});o.animation.pause();o.animation.currentTime=(1+phase)*o.duration}
  }
}
$$('.bands .pause').forEach(b=>b.addEventListener('click',()=>{const sec=b.closest('.bands');const now=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(now));tapes.filter(o=>o.sec===sec).forEach(o=>o.paused=now);redraw()}));
let scrollV=0,lastY=scrollY;
// Only playback rate settling needs JS frames; the browser moves the tapes.
function tapeFrame(){
  let settling=false;
  for(const o of tapes){
    if(!o.animation)continue;const playing=!RM.matches&&visible.has(o.sec)&&!o.paused;
    if(!playing){if(o.animation.playState!=='paused')o.animation.pause();continue}
    const rate=(1+Math.min(4,Math.abs(scrollV)/700))*(scrollV<-30?-1:1);
    if(rate<0&&o.animation.currentTime<o.duration)o.animation.currentTime+=o.duration;
    if(o.animation.playbackRate!==rate)o.animation.updatePlaybackRate(rate);
    if(o.animation.playState!=='running')o.animation.play();settling=settling||scrollV!==0;
  }
  return settling;
}

/* ================= WHY RIG ================= */
const rig=$('#rig'),why=$('#why');
const pends=$$('.pend',rig).map((e,i)=>({e,plate:$('.plate',e),chs:$$('.ch',e),th:0,om:0,i}));
let rigLanded=false,RIG_L=70,rigY=0;
function buildLift(){RIG_L=parseFloat(getComputedStyle($('.pend',rig)).paddingTop)||70;const s=$('#lift');s.innerHTML='';const w=rig.clientWidth,h=170;s.setAttribute('viewBox',`0 0 ${w} ${h}`);const hx=w/2,hy=h-74;const ink='#0e2540';
  const d=el('defs',{},s);const g=el('linearGradient',{id:'cableFade',x1:0,y1:0,x2:0,y2:hy,gradientUnits:'userSpaceOnUse'},d);el('stop',{offset:'0','stop-color':ink,'stop-opacity':0},g);el('stop',{offset:'.55','stop-color':ink,'stop-opacity':1},g);
  el('line',{x1:hx,y1:0,x2:hx,y2:hy-16,stroke:'url(#cableFade)','stroke-width':2.5},s);
  el('rect',{x:hx-9,y:hy-22,width:18,height:10,rx:2,fill:ink},s);
  el('path',{d:`M${hx} ${hy-12}v8a8 8 0 1 1-8 8`,fill:'none',stroke:ink,'stroke-width':3.5,'stroke-linecap':'round'},s);
  const ax=[w*.26,w*.74];for(const x of ax){el('line',{x1:hx,y1:hy+4,x2:x,y2:h,stroke:ink,'stroke-width':2},s);el('rect',{x:x-7,y:h-7,width:14,height:7,fill:ink},s)}}
function rigFrame(dt){
  const vh=innerHeight,rr=rig.getBoundingClientRect(),plates=Math.abs(ptr.vx)>30?pends.map(o=>o.plate.getBoundingClientRect()):[];
  const t=clamp((vh*.98-(rr.top-rigY))/(vh*.5));
  const c1=1.2,c3=c1+1;const eb=t<=0?0:1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);
  rigY=+((1-eb)*-90).toFixed(2);rig.style.transform=`translate3d(0,${rigY}px,0)`;
  if(t>=1&&!rigLanded){rigLanded=true;pends.forEach((o,i)=>o.om+=[.32,-.42,.28][i])}if(t<.4)rigLanded=false;
  const L=RIG_L;
  for(const o of pends){
    let acc=-18*o.th-.8*o.om;
    // the cursor is a solid object: moving through a plate shoves it along with the cursor
    const pr=plates[o.i],pad=10;
    if(pr&&ptr.x>pr.left-pad&&ptr.x<pr.right+pad&&ptr.y>pr.top-pad&&ptr.y<pr.bottom+pad)acc+=clamp(ptr.vx,-2200,2200)*.0042;
    acc+=(o.i%2?1:-1)*clamp(scrollV,-3000,3000)*.000012;
    o.om+=acc*dt;o.th+=o.om*dt;if(!scrollV&&!pr&&Math.abs(o.th)<.0015&&Math.abs(o.om)<.008)o.th=o.om=0;
    if(Math.abs(o.th)>.42){o.th=Math.sign(o.th)*.42;o.om*=-.35}
    const x=L*Math.sin(o.th),y=L*(1-Math.cos(o.th));
    o.plate.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    const rot=`rotate(${(-o.th).toFixed(4)}rad)`;o.chs[0].style.transform=rot;o.chs[1].style.transform=rot;
  }
  return pends.some(o=>o.th!==0||o.om!==0);
}

/* ================= BILLBOARD ================= */
const bb=$('#bb'),bbScene=$('#board'),bbPin=$('#boardPin'),dash=$('#roadDash'),poles=$('#roadPoles'),roadFar=$('#roadFar');
const BB={fit:1};
function buildRoad(){
  const vw=innerWidth;poles.innerHTML='';roadFar.innerHTML='';
  const W=vw*3;poles.setAttribute('viewBox',`0 0 ${W} 150`);poles.setAttribute('width',W);poles.style.width=W+'px';
  BB.poleGap=300;for(let x=60;x<W;x+=BB.poleGap){el('line',{x1:x,y1:150,x2:x,y2:20,stroke:'#3066a0','stroke-width':5},poles);el('line',{x1:x-22,y1:32,x2:x+22,y2:32,stroke:'#3066a0','stroke-width':4},poles);if(x+BB.poleGap<W)el('path',{d:`M${x-18} 34 Q${x+BB.poleGap/2} 64 ${x+BB.poleGap-18} 34`,fill:'none',stroke:'#3066a0','stroke-width':1.5,opacity:.7},poles)}
  roadFar.setAttribute('viewBox',`0 0 ${W} 120`);roadFar.style.width=W+'px';filler(roadFar,0,W,120,20,100,'#cae6f8',rng(77));
  const legs=$('#legs');legs.innerHTML='';const st={fill:'none',stroke:'#3066a0'};
  for(const x of[200,840]){el('line',{x1:x-26,y1:0,x2:x-26,y2:120,...st,'stroke-width':7},legs);el('line',{x1:x+26,y1:0,x2:x+26,y2:120,...st,'stroke-width':7},legs);for(let y=0;y<120;y+=40){el('line',{x1:x-26,y1:y,x2:x+26,y2:y+40,...st,'stroke-width':3},legs);el('line',{x1:x+26,y1:y,x2:x-26,y2:y+40,...st,'stroke-width':3},legs)}}
  el('line',{x1:100,y1:34,x2:940,y2:34,...st,'stroke-width':5},legs);el('line',{x1:100,y1:16,x2:940,y2:16,...st,'stroke-width':2},legs);for(let x=100;x<=940;x+=42)el('line',{x1:x,y1:16,x2:x,y2:34,...st,'stroke-width':2},legs);
  // fit billboard below the heading
  bb.style.transform='translateX(-50%)';const head=$('.wrap',bbPin).getBoundingClientRect();const bbh=bb.offsetHeight;const avail=innerHeight-44-(head.bottom-bbPin.getBoundingClientRect().top)-28;BB.fit=clamp(avail/bbh,.5,1);
}
function boardFrame(){
  const r=bbScene.getBoundingClientRect(),vh=innerHeight,vw=innerWidth;
  const p=clamp(-r.top/(r.height-vh)),q=ease(clamp(p/.62));
  const X=lerp(vw*.42,0,q),ry=lerp(-66,0,q),s=lerp(.3,1,q)*BB.fit;
  bb.style.transform=`translateX(-50%) translateX(${X}px) rotateY(${ry}deg) scale(${s})`;
  bb.classList.toggle('on',q>.93);
  dash.style.transform=`translateX(${-((p*vw*3.2)%132)}px)`;
  poles.style.transform=`translateX(${-((p*vw*1.8)%BB.poleGap)}px)`;
  roadFar.style.transform=`translateX(${-p*vw*.35}px)`;
}

/* ================= PRIZES STAGE ================= */
const stage=$('#stage'),lecs=$$('.lec',stage),cones=$$('.cone',stage),cans=$$('.can',stage),pools=$$('.pool',stage);
function alignStage(){stage.style.transform='';lecs.forEach(l=>l.style.transform='none');const sr=stage.getBoundingClientRect(),lecterns=lecs.map(l=>l.getBoundingClientRect());lecs.forEach((l,j)=>{const i=+l.dataset.i,lr=lecterns[j];const cx=lr.left-sr.left+lr.width/2;cones[i].style.left=cx+'px';cans[i].style.left=cx+'px';cones[i].style.width=(lr.width*1.9)+'px';pools[i].style.left=cx+'px';pools[i].style.width=(lr.width*1.75)+'px'})}
function stageFrame(){
  const vh=innerHeight,sr=stage.parentElement.getBoundingClientRect();
  const t=clamp((vh-sr.top)/(vh*.95));const tilt=ease(clamp(t/.6));
  stage.style.transform=`rotateX(${lerp(30,0,tilt)}deg) translateY(${lerp(70,0,tilt)}px) scale(${lerp(.9,1,tilt)})`;
  const order={2:0,1:1,0:2};
  lecs.forEach(l=>{const i=+l.dataset.i;const rise=ease(clamp((t-.4-order[i]*.09)/.22));l.style.transform=`translateY(${(1-rise)*120}%)`;const on=rise>.97;cones[i].classList.toggle('on',on);cans[i].classList.toggle('on',on);pools[i].classList.toggle('on',on)});
}

/* ================= THE DAY ================= */
const day=$('#day'),track=$('#track'),dpin=$('#dayPin'),skyG=$('#skyG'),sun=$('#sun'),moon=$('#moon'),clock=$('#clock'),head=$('#dayHead'),ruler=$('#ruler'),rFill=$('#rFill'),rKnob=$('#rKnob'),pano=$('#pano'),btip=$('#btip');
let pwins=[],dayBucket=-1,hoveredLandmark,dismissedLandmark;
let dayTravel=0,dayRulerWidth=0;
function buildPano(){
  const active=focusedLandmark();hoveredLandmark=dismissedLandmark=null;btip.classList.remove('on');
  pano.innerHTML='';pano.style.width='';if(!motion()){if(active)$('#dayH').focus({preventScroll:true});return}
  const H=pano.getBoundingClientRect().height,W=track.scrollWidth;dayTravel=Math.max(0,W-innerWidth);dayRulerWidth=ruler.clientWidth;pano.setAttribute('viewBox',`0 0 ${W} ${H}`);pano.setAttribute('width',W);pano.style.width=W+'px';
  const k=H/520,r=rng(99),c='#3066a0',win='#cae6f8';const stops=$$('.stop',track);const sx=i=>stops[i].offsetLeft;
  const g=el('g',{},pano);
  let x=filler(g,0,Math.max(0,sx(0)-1500*k-60),H,90*k,300*k,c,r,win,k);
  const cs0=Math.max(x,sx(0)-200*k);filler(g,x,cs0,H,90*k,260*k,c,r,win,k);
  x=campus(g,cs0,H,c,win,r,k);
  const dt0=Math.max(x+40*k,sx(4)-1100*k);x=filler(g,x,dt0,H,90*k,300*k,c,r,win,k);
  x=downtown(g,dt0,H,c,win,r,k,true);
  filler(g,x,W+50,H,90*k,300*k,c,r,win,k);
  $$('.nm',pano).forEach((landmark,i)=>{const id='landmark-desc-'+i;const desc=el('desc',{id},landmark);desc.textContent=landmark.dataset.fact;landmark.setAttribute('tabindex','0');landmark.setAttribute('role','img');landmark.setAttribute('aria-label',landmark.dataset.name);landmark.setAttribute('aria-describedby',id)});
  pwins=$$('.w',pano);dayBucket=-1;
  if(active)$('#'+active.getAttribute('aria-describedby'),pano)?.parentElement.focus({preventScroll:true});
}
const SKY=[[0,'eaf6ff','f2faff'],[.24,'d6ecfb','eef8ff'],[.42,'cfe7f8','f6ead0'],[.55,'a9cbe6','f5d39c'],[.63,'6b8fbc','f1ae7c'],[.71,'33558a','d28c78'],[.79,'1a3459','4f5d86'],[.88,'0e2038','1a3155'],[1,'0b1a2e','0b1a2e']];
const SKYT=SKY.map(s=>[s[0],s[1]]),SKYH=SKY.map(s=>[s[0],s[2]]);
function dayFrame(){
  const r=day.getBoundingClientRect(),vh=innerHeight,vw=innerWidth;
  const p=clamp(-r.top/(r.height-vh));
  track.style.transform=`translate3d(${-p*dayTravel}px,0,0)`;
  const top=stopsAt(SKYT,p),hor=stopsAt(SKYH,p);skyG.style.background=`linear-gradient(${top} 0%, ${hor} 58%, ${hor} 100%)`;
  const dark=p>.66;dpin.classList.toggle('night',dark);head.style.color=dark?'#f2faff':'#0e2540';ruler.style.color=dark?'#cae6f8':'#3066a0';
  const m=Math.round(p*600);clock.textContent=String(10+Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
  rFill.style.transform=`scaleX(${p})`;rKnob.style.transform=`translateX(${p*dayRulerWidth}px)`;
  // sun arcs left to right and sets behind the buildings (they are drawn above it)
  const q=clamp(p/.8);const sxp=vw*lerp(.38,.9,q);const up=Math.sin(clamp(q/.42)*Math.PI/2);const down=smooth(clamp((q-.42)/.58));const peak=Math.max(vh*.2,196);const syp=lerp(Math.max(vh*.42,peak+90),peak,up)+(vh+70-peak)*down;
  sun.style.transform=`translate(${sxp}px,${syp}px)`;sun.style.background=q<.55?'#ffc24b':mix('#ffc24b','#ff8f4a',smooth((q-.55)/.45));
  moon.style.left=vw*.62+'px';moon.style.top=vh*.2+'px';moon.style.opacity=clamp((p-.82)/.08);
  pano.style.setProperty('--bfill',stopsAt([[0,'3066a0'],[.55,'3066a0'],[.75,'1d3c66'],[1,'15305a']],p));pano.style.setProperty('--bhover',p>.66?'#2a5288':'#4a82bf');
  $$('.rbp',pano).forEach(e=>e.setAttribute('fill',p>.6?'#b8893a':'#3066a0'));
  const b=Math.floor(p*100);if(b!==dayBucket){dayBucket=b;for(const w of pwins){const k=+w.dataset.k;w.setAttribute('fill',p>k?(k<.72?'#ffc24b':'#f7d27a'):(p>.6?'#1a3459':'#cae6f8'))}}
}
function showLandmark(t,x,y){const r=dpin.getBoundingClientRect();btip.innerHTML=`<b>${t.dataset.name}</b>${t.dataset.fact}`;btip.style.left=clamp(x-r.left,150,r.width-150)+'px';btip.style.top=Math.max(110,y-r.top)+'px';btip.classList.add('on')}
function focusedLandmark(){const t=document.activeElement;return pano.contains(t)&&t.matches('.nm')?t:null}
function showFocusedLandmark(){const t=focusedLandmark();if(!t||t===dismissedLandmark){btip.classList.remove('on');return}const r=t.getBoundingClientRect();showLandmark(t,(r.left+r.right)/2,r.top)}
dpin.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!fineHover.matches||btip.contains(e.target))return;const t=e.target.closest('.nm');if(t===hoveredLandmark)return;if(hoveredLandmark===dismissedLandmark&&hoveredLandmark!==focusedLandmark())dismissedLandmark=null;hoveredLandmark=t;if(t&&t!==dismissedLandmark&&motion())showLandmark(t,e.clientX,e.clientY);else showFocusedLandmark()});
dpin.addEventListener('pointerleave',()=>{if(hoveredLandmark!==focusedLandmark())dismissedLandmark=null;hoveredLandmark=null;showFocusedLandmark()});
pano.addEventListener('focusin',e=>{const t=e.target;if(!t.matches('.nm'))return;hoveredLandmark=dismissedLandmark=null;
  const r=day.getBoundingClientRect(),item=t.getBoundingClientRect(),trackLeft=track.getBoundingClientRect().left,travel=dayTravel;
  const offset=clamp((item.left+item.right)/2-trackLeft-innerWidth/2,0,travel);
  if(travel){window.scrollTo({top:scrollY+r.top+offset/travel*(r.height-innerHeight),behavior:'instant'});dayFrame()}
  showFocusedLandmark()});
pano.addEventListener('focusout',()=>{hoveredLandmark=dismissedLandmark=null;btip.classList.remove('on')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&!modal.open&&btip.classList.contains('on')){e.preventDefault();dismissedLandmark=hoveredLandmark||focusedLandmark();btip.classList.remove('on')}});

/* ================= FLOOR PLAN ================= */
const plan=$('#plan'),walls=$('#walls');
function buildWalls(){
  walls.innerHTML='';const p=plan.getBoundingClientRect();walls.setAttribute('viewBox',`0 0 ${p.width} ${p.height}`);
  const st={fill:'none',stroke:'#8cc0e0','stroke-width':3,pathLength:1};
  el('rect',{x:1.5,y:1.5,width:p.width-3,height:p.height-3,...st,'stroke-width':6},walls);
  $$('.room',plan).forEach(r=>{const b=r.getBoundingClientRect();el('rect',{x:b.left-p.left,y:b.top-p.top,width:b.width,height:b.height,...st},walls)});
}
$$('.room',plan).forEach(r=>{const s=el('svg',{class:'door',viewBox:'0 0 40 40','aria-hidden':'true'});s.innerHTML='<defs><radialGradient id="spill" cx="0.5" cy="1" r="0.8"><stop offset="0" stop-color="#ffc24b" stop-opacity=".45"/><stop offset="1" stop-color="#ffc24b" stop-opacity="0"/></radialGradient></defs><rect class="gap" x="2" y="35" width="34" height="7"/><path class="spill" d="M2 38 L36 38 L36 4 Q2 4 2 38Z"/><path class="arc" d="M36 38 A34 34 0 0 0 2 4"/><line class="leaf" x1="2" y1="38" x2="36" y2="38"/>';r.appendChild(s)});
function planFrame(){const p=plan.getBoundingClientRect(),vh=innerHeight;walls.style.setProperty('--d',String(1-clamp((vh*.92-p.top)/(vh*.6))))}

/* ================= FAQ ================= */
$$('.qi').forEach(q=>{const b=$('.q',q),a=$('.a',q);a.hidden=b.getAttribute('aria-expanded')!=='true';b.addEventListener('click',()=>{const open=a.hidden;b.setAttribute('aria-expanded',String(open));q.classList.toggle('open',open);a.hidden=!open})});

const faqFilters=$('#faqFilters'),faqSearch=$('#faqSearch'),faqCategory=$('#faqCategory'),faqCount=$('#faqCount');
const faqText=text=>text.toLowerCase().replace(/['’]/g,'');
const faqGroups=$$('.faq-group').map(group=>({group,items:$$('.qi',group).map(item=>({item,text:faqText(item.textContent)}))}));
function filterFaq(){
  const terms=faqText(faqSearch.value.trim()).split(/\s+/).filter(Boolean),category=faqCategory.value;
  let count=0;
  for(const {group,items} of faqGroups){
    const matchesCategory=!category||category===group.dataset.category;
    let visible=0;
    for(const {item,text} of items){item.hidden=!matchesCategory||!terms.every(term=>text.includes(term));if(!item.hidden)visible++}
    group.hidden=visible===0;count+=visible;
  }
  faqCount.textContent=count===0?'No questions match.':`${count} ${count===1?'question':'questions'}`;
}
function restoreFaqFilters(){
  const params=new URLSearchParams(location.search);
  faqSearch.value=params.get('faq')||'';
  faqCategory.value=params.get('faqCategory')||'';
  if(faqCategory.selectedIndex<0)faqCategory.value='';
  filterFaq();
}
function updateFaqFilters(){
  filterFaq();
  if(location.protocol==='file:')return;
  const url=new URL(location.href);
  for(const [key,value] of [['faq',faqSearch.value.trim()],['faqCategory',faqCategory.value]]){
    if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);
  }
  history.replaceState(history.state,'',url);
}
faqSearch.addEventListener('input',updateFaqFilters);
faqCategory.addEventListener('change',updateFaqFilters);
addEventListener('popstate',restoreFaqFilters);
restoreFaqFilters();faqFilters.hidden=false;

/* ================= CLUBS ================= */
const hosts=$('#hosts');

/* ================= HERO LAYERS ================= */
const hero=$('#top'),par=$$('[data-px],[data-py]',hero);
function heroFrame(y){const vh=innerHeight,r=hero.getBoundingClientRect(),p=(vh-r.top)/(vh+r.height)-.5;
  for(const e of par)e.style.transform=`translate3d(${(+e.dataset.px||0)*p*2}px,${(+e.dataset.py||0)*p*2}px,0)`}

/* ================= MODALS ================= */
const modal=$('#modal'),mTitle=$('#mTitle'),mSub=$('#mSub'),mBody=$('#mBody'),mClose=$('#mClose'),mStatus=$('#mStatus');
const BRIEFS=[
  {sponsor:'Sponsor TBA',track:'Fintech',problem:'Cut sign-up drop-off for first-time investors',context:'Most people who start opening an investing account never finish. The sponsor wants to know why, and what would get them over the line.',win:'A tested onboarding flow or prototype, a clear customer insight, and a plan to measure the change.'},
  {sponsor:'Sponsor TBA',track:'Health',problem:'Turn clinic wait times into a better patient experience',context:'Patients spend a long time waiting with no idea what is happening. The sponsor wants to make that time less stressful and more useful.',win:'A pilot plan a clinic could run next month, with a prototype of what the patient sees.'},
  {sponsor:'Sponsor TBA',track:'Consumer',problem:'Price a subscription students will actually keep',context:'Students sign up for free trials and cancel. The sponsor wants pricing and packaging that students stick with.',win:'A pricing model backed by real student input, and a landing page or prototype that tests it.'}
];
const okIcon='<svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#ffc24b"/><path d="M19 33 l9 9 l17 -19" fill="none" stroke="#0e2540" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const previewNote='<small>Preview build: this form is not connected yet, so nothing was sent.</small>';
const F=(id,label,type='text',attrs='')=>`<div class="fld"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${attrs}${type==='email'?' spellcheck="false"':''} aria-describedby="${id}-err"><span class="err" id="${id}-err"></span></div>`;
const S=(id,label,opts,sel)=>`<label class="fld" for="${id}">${label}<select id="${id}" name="${id}">${opts.map(o=>`<option${o===sel?' selected':''}>${o}</option>`).join('')}</select></label>`;
const VIEWS={
  notify:o=>({t:'Get notified',s:'We\'ll send one email when applications open in January.',b:`<form novalidate data-form="notify">${F('n-name','Full name','text','autocomplete="name" required')}${F('n-email','Email','email','autocomplete="email" required')}<div class="two">${S('n-school','School',['University of Toronto','University of Waterloo','Toronto Metropolitan University','York University','Another school'])}${S('n-year','Year',['First','Second','Third','Fourth or later','Graduate'])}</div><label class="chk"><input type="checkbox" id="n-ok" name="consent" required aria-describedby="n-ok-err"><span>Email me about CTRL Build. I can unsubscribe any time.</span></label><span class="err" id="n-ok-err"></span><button class="btn solid" type="submit">Get notified</button></form>`,
    done:v=>`<div class="done">${okIcon}<h3>You're on the list, ${v.first}.</h3><p>We'll email ${v.email} when applications open in January.</p>${previewNote}</div>`}),
  sponsor:o=>({t:o.call?'Book a call':'Sponsor a challenge',s:o.call?'Twenty minutes with the sponsorship team. Pick a time that works.':'Tell us a little about your company and the problem you would bring.',b:`<form novalidate data-form="sponsor">${F('s-name','Your name','text','autocomplete="name" required')}<div class="two">${F('s-co','Company','text','autocomplete="organization" required')}${F('s-email','Work email','email','autocomplete="email" required')}</div>${S('s-pkg','Package',['Not sure yet','Title, $10,000','Gold, $5,000','Silver, $2,500','Community, $1,000','In-kind'],o.pkg?({Title:'Title, $10,000',Gold:'Gold, $5,000',Silver:'Silver, $2,500',Community:'Community, $1,000'}[o.pkg]):'Not sure yet')}<label class="fld" for="s-msg">What problem would you bring? (optional)<textarea id="s-msg" name="s-msg"></textarea></label><label class="chk"><input type="checkbox" id="s-call" ${o.call?'checked':''}><span>I'd like a 20-minute call</span></label><div id="s-when" ${o.call?'':'hidden'}>${S('s-time','Best time for a call',['Weekday mornings','Weekday afternoons','Weekday evenings'])}</div><button class="btn solid" type="submit">${o.call?'Request a call':'Send to the team'}</button></form>`,
    done:v=>`<div class="done">${okIcon}<h3>Thanks, ${v.first}.</h3><p>The sponsorship team will reply to ${v.email}${v.call?' to set up your call':''}.</p>${previewNote}</div>`}),
  prospectus:()=>({t:'Get the prospectus',s:'The full sponsorship prospectus: packages, audience and how challenges work.',b:`<form novalidate data-form="prospectus">${F('p-name','Your name','text','autocomplete="name" required')}${F('p-email','Work email','email','autocomplete="email" required')}${F('p-co','Company','text','autocomplete="organization"')}<button class="btn solid" type="submit">Email me the prospectus</button></form>`,
    done:v=>`<div class="done">${okIcon}<h3>On its way, ${v.first}.</h3><p>We'll send the prospectus to ${v.email}.</p>${previewNote}</div>`}),
  brief:o=>{const b=BRIEFS[o.i||0];return{t:b.problem,s:`${b.sponsor}, ${b.track} track`,b:`<div class="brief"><dl><dt>The problem</dt><dd>${b.context}</dd><dt>What a strong answer looks like</dt><dd>${b.win}</dd><dt>When you get the full brief</dt><dd>At the opening bell, 10:00 on event day.</dd></dl><p style="margin:18px 0 0;font-size:14px;color:#5b6f86">Sample brief. Real sponsor challenges are posted in February.</p><div style="display:grid;gap:10px;margin-top:18px"><button class="btn solid" type="button" data-open="notify">Get notified when applications open</button></div></div>`}},
  coc:()=>({t:'Code of conduct',s:'Draft. The final version is published before applications open.',b:`<div class="legal-t"><p>CTRL Build is for everyone. We expect every participant, mentor, judge, sponsor and organizer to:</p><ul><li>Treat people with respect, in person and online.</li><li>Keep it free of harassment, discrimination and intimidation.</li><li>Respect sponsor confidentiality and other teams' work.</li><li>Follow organizer and venue instructions.</li></ul><p>Anyone who breaks these rules may be asked to leave. Raise concerns with any organizer on the day, or contact the team before the event.</p></div>`}),
  privacy:()=>({t:'Privacy',s:'Draft. The final notice is published with the application form.',b:`<div class="legal-t"><p>We collect only what we need to run the event: your name, email, school and year, plus anything you choose to add.</p><ul><li>We use it to contact you about CTRL Build.</li><li>We share your profile with sponsors only if you opt in.</li><li>We delete application data after the event unless you ask us to keep you on the list.</li></ul><p>Photos may be taken on the day. You can ask an organizer to leave you out.</p></div>`})
};
let modalTrigger;
const emailError='Enter an email like name@mail.utoronto.ca.';
const validEmail=input=>!input.validity.typeMismatch&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
const escapeHTML=value=>value.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function fieldError(input,message){$('#'+input.id+'-err').textContent=message;if(message)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid')}
function openModal(kind,opts={},trigger=document.activeElement){
  if(kind==='call'){kind='sponsor';opts.call=true}
  const v=VIEWS[kind](opts);mTitle.textContent=v.t;mSub.textContent=v.s;mBody.innerHTML=v.b;mStatus.textContent='';
  if(kind==='notify'&&opts.email)$('#n-email',mBody).value=opts.email;
  if(!modal.open){modalTrigger=trigger;modal.showModal()}
  const first=matchMedia('(pointer:fine)').matches?$('input,select,textarea,button',mBody):null;(first||mTitle).focus();
  const f=$('form',mBody);if(!f)return;
  const callBox=$('#s-call',f);if(callBox)callBox.addEventListener('change',()=>{$('#s-when',f).hidden=!callBox.checked});
  f.addEventListener('submit',e=>{e.preventDefault();let invalid;
    $$('[required]',f).forEach(i=>{let message='';if(i.type==='checkbox'){if(!i.checked)message='Tick this box so we can email you.'}else if(!i.value.trim())message=i.labels[0].textContent.trim()+' is required.';else if(i.type==='email'&&!validEmail(i))message=emailError;fieldError(i,message);if(message&&!invalid)invalid=i});
    if(invalid){mStatus.textContent=document.activeElement===invalid?$('#'+invalid.id+'-err').textContent:'';invalid.focus();return}const val=id=>{const i=$('#'+id,f);return i?i.value.trim():''};const name=val('n-name')||val('s-name')||val('p-name');
    const vv={first:escapeHTML(name.split(/\s+/)[0]),email:escapeHTML(val('n-email')||val('s-email')||val('p-email')),call:callBox&&callBox.checked};
    mBody.innerHTML=v.done(vv);mTitle.textContent=kind==='notify'?'You\'re in':kind==='prospectus'?'Prospectus requested':'Message ready';mSub.textContent='';mClose.focus();
    mStatus.textContent=$('.done h3',mBody).textContent+' '+$('.done small',mBody).textContent;
  });
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(!b)return;e.preventDefault();openModal(b.dataset.open,{i:+b.dataset.brief||0,pkg:b.dataset.pkg},b)});
mClose.addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
modal.addEventListener('close',()=>{if(modal.open)return;if(modalTrigger?.isConnected)modalTrigger.focus();modalTrigger=null});
const footEmail=$('#footEmail');
footEmail.addEventListener('input',()=>{if(footEmail.hasAttribute('aria-invalid'))fieldError(footEmail,'')});
$('#footForm').addEventListener('submit',e=>{e.preventDefault();const email=footEmail.value.trim();const message=validEmail(footEmail)?'':emailError;fieldError(footEmail,message);if(message){footEmail.focus();return}openModal('notify',{email},e.submitter||footEmail)});

/* ================= LOOP ================= */
function fitHero(){const h=$('.hero'),c=$('.hero-grid > :first-child');if(innerWidth<=900){h.style.removeProperty('--skyH');return}const top=c.getBoundingClientRect().bottom+scrollY-h.getBoundingClientRect().top-scrollY;h.style.setProperty('--skyH',clamp(innerHeight-top-16,170,330)+'px')}
function rebuild(){
  const animated=motion();fitHero();measureTapes();buildRoad();alignStage();buildWalls();buildLift();resetPointer();buildPano();
  if(animated){buildCrane()}else{
    load.style.transform=load.style.opacity='';sign.style.left=sign.style.top='';bb.classList.add('on');for(const e of [dash,poles,roadFar,stage,rig])e.style.transform='';rigY=0;
    for(const o of pends){o.th=o.om=0;for(const e of [o.plate,...o.chs])e.style.transform=''}rigLanded=false;
    for(const e of [...cones,...cans,...pools])e.classList.add('on');walls.style.setProperty('--d','0');dpin.classList.remove('night');clock.textContent='10:00';btip.classList.remove('on');
  }
  craneSettling=rigSettling=false;invalidate();
}
let rz,raf,started=false,dirty=true,lastT=0,craneSettling=false,rigSettling=false;
// Keep visibility decisions here so scene frames only measure visible geometry.
const visible=new Set(),sceneIO=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else{visible.delete(e.target);if(e.target===craneScene){CR.init=true;craneSettling=false}if(e.target===why)rigSettling=false}}redraw()});
const layoutRO=new ResizeObserver(invalidate);
function wake(){if(started&&!raf)raf=requestAnimationFrame(loop)}
function redraw(){dirty=true;wake()}
function invalidate(){headerLayout=undefined;redraw()}
addEventListener('scroll',redraw,{passive:true});
addEventListener('resize',()=>{invalidate();clearTimeout(rz);rz=setTimeout(rebuild,150)});
RM.addEventListener('change',()=>{if(started)rebuild()});
function loop(now){
  raf=undefined;const dt=lastT?clamp((now-lastT)/1000,.001,.05):1/60,y=scrollY,draw=dirty;dirty=false;
  scrollV+=((y-lastY)/dt-scrollV)*Math.min(1,dt*8);if(Math.abs(scrollV)<1)scrollV=0;lastY=y;lastT=now;
  const kick=now-ptr.t<80&&Math.abs(ptr.vx)>1;if(!kick)ptr.vx=0;
  if(draw){header(y);if(!RM.matches&&visible.has(hero))heroFrame(y)}
  if(motion()){
    if(visible.has(craneScene)&&(draw||kick||craneSettling))craneSettling=craneFrame(dt);
    if(visible.has(why)&&(draw||kick||rigSettling))rigSettling=rigFrame(dt);
    if(draw){if(visible.has(bbScene))boardFrame();if(visible.has(stage.parentElement))stageFrame();if(visible.has(day))dayFrame();if(visible.has(plan))planFrame()}
  }
  const tapeSettling=tapeFrame();
  if(tapeSettling||craneSettling||rigSettling)wake();else{lastT=0;scrollV=0}
}
function start(){started=true;lastY=scrollY;rebuild();for(const s of new Set([hero,craneScene,why,bbScene,stage.parentElement,day,plan,hosts,...tapes.map(o=>o.sec)]))sceneIO.observe(s);for(const s of new Set([...navSecs.map(([,s])=>s),...themed,rail,...navLinks]))layoutRO.observe(s)}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else addEventListener('load',start);
}
