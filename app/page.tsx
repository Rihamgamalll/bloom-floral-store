'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Star, Truck, X } from 'lucide-react';
import SmoothScroll from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const HEROES = [1,2,3,4,5].map(i => `/assets/hero-${i}.png`);
const FLOATERS = Array.from({length:14},(_,i)=>`/assets/floating-${String(i+1).padStart(2,'0')}.png`);
const EDITORIALS = Array.from({length:7},(_,i)=>`/assets/editorial-${String(i+1).padStart(2,'0')}.png`);

const FLORAL_FLIGHT = [
  {src:'/assets/floating-01.png',left:7,top:14,size:68,dx:180,dy:210,rot:360,depth:.72},
  {src:'/assets/floating-02.png',left:18,top:5,size:76,dx:260,dy:260,rot:-420,depth:.82},
  {src:'/assets/floating-09.png',left:31,top:12,size:88,dx:-150,dy:300,rot:310,depth:.55},
  {src:'/assets/floating-10.png',left:74,top:9,size:92,dx:-230,dy:250,rot:-330,depth:.58},
  {src:'/assets/floating-07.png',left:88,top:25,size:116,dx:-250,dy:320,rot:260,depth:.52},
  {src:'/assets/floating-11.png',left:91,top:55,size:104,dx:-320,dy:180,rot:-300,depth:.9},
  {src:'/assets/floating-13.png',left:12,top:61,size:110,dx:280,dy:160,rot:280,depth:.92},
  {src:'/assets/floating-14.png',left:56,top:2,size:102,dx:70,dy:280,rot:-360,depth:.76},
  {src:'/assets/floating-01.png',left:44,top:66,size:56,dx:140,dy:110,rot:440,depth:.66},
  {src:'/assets/floating-02.png',left:67,top:69,size:62,dx:-170,dy:120,rot:-410,depth:.7},
];

const PRODUCTS = [
  ['Ivory Whisper', 1450, 'Whites'], ['Velvet Promise', 1790, 'Bold'], ['Soft Morning', 1350, 'Romantic'],
  ['Golden Hour', 1890, 'Gift'], ['Sage & Silk', 1690, 'Whites'], ['Pearl Garden', 1550, 'Romantic'],
  ['Midnight Gold', 2100, 'Bold'], ['Blush Letter', 1490, 'Romantic'], ['Tulip Poetry', 1850, 'Romantic'],
  ['Apricot Muse', 1720, 'Gift'], ['Lavender Note', 1650, 'Romantic'], ['Red Signature', 2250, 'Bold'],
  ['Chocolate Bloom', 1950, 'Gift'], ['Birthday Cloud', 1780, 'Gift'], ['Navy Pearl', 2050, 'Whites'],
].map((p,i)=>({ id:i+1, name:p[0] as string, price:p[1] as number, category:p[2] as string, image:`/assets/product-${String(i+1).padStart(2,'0')}.webp` }));

type CartItem = typeof PRODUCTS[number] & { qty:number };

function money(n:number){ return `${n.toLocaleString('en-US')} EGP`; }

const INSTAGRAM_URL='https://www.instagram.com/riweb_s';

function StoreNav({cartCount,onCart}:{cartCount:number;onCart:()=>void}){
  const [mobile,setMobile]=useState(false);
  const scroll=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  return <>
    <div className="announcement">SAME-DAY DELIVERY IN SELECT AREAS <span>•</span> FRESH FLOWERS, WRAPPED BY HAND</div>
    <header className="nav-shell">
      <button className="mobile-menu" onClick={()=>setMobile(true)} aria-label="Open menu"><Menu size={21}/></button>
      <a className="brand" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Open BLOOM on Instagram"><span className="brand-mark">✽</span><span>BLOOM</span><small>floral atelier</small></a>
      <nav className="desktop-nav">
        <button onClick={()=>scroll('shop')}>Shop</button><button onClick={()=>scroll('occasions')}>Occasions</button><button onClick={()=>scroll('atelier')}>Our Atelier</button><button onClick={()=>scroll('stories')}>Stories</button>
      </nav>
      <div className="nav-actions"><button aria-label="Browse bouquets" onClick={()=>scroll('shop')}><Search size={19}/></button><button onClick={onCart} className="cart-button" aria-label="Cart"><ShoppingBag size={19}/><span>{cartCount}</span></button></div>
    </header>
    <div className={`mobile-panel ${mobile?'open':''}`}><button className="close-mobile" onClick={()=>setMobile(false)}><X/></button>{['shop','occasions','atelier','stories'].map(x=><button key={x} onClick={()=>{scroll(x);setMobile(false)}}>{x}</button>)}</div>
  </>;
}

function FloralFlight(){
  const layerRef=useRef<HTMLDivElement>(null);
  const itemRefs=useRef<(HTMLDivElement|null)[]>([]);
  useLayoutEffect(()=>{
    if(!layerRef.current)return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile=window.matchMedia('(max-width: 700px)').matches;
    const items=itemRefs.current.filter((el):el is HTMLDivElement=>Boolean(el));
    const ctx=gsap.context(()=>{
      gsap.set(items,{autoAlpha:0,scale:.52,force3D:true,transformOrigin:'50% 50%'});
      if(reduce)return;
      const tl=gsap.timeline({scrollTrigger:{trigger:'#home',start:'top top',endTrigger:'#atelier',end:'55% center',scrub: mobile ? 0.42 : 0.2,invalidateOnRefresh:true}});
      tl.to(layerRef.current,{autoAlpha:1,duration:.03},0);
      items.forEach((el,i)=>{
        const f=FLORAL_FLIGHT[i];
        const dir=i%2===0?1:-1;
        tl.to(el,{autoAlpha:.9,scale:.82+(i%3)*.08,x:f.dx*.28,y:f.dy*.22,rotation:f.rot*.2,duration:.18,ease:'power2.out'},i*.012)
          .to(el,{x:f.dx*dir,y:f.dy+120+(i%4)*32,rotation:f.rot,scale:.96+(f.depth*.1),duration:.48,ease:'sine.inOut'},.2+i*.008)
          .to(el,{x:f.dx*-.36,y:f.dy*.18-70,rotation:f.rot*1.45,scale:.72+(f.depth*.08),duration:.3,ease:'sine.inOut'},.68+i*.004)
          .to(el,{autoAlpha:0,scale:.45,duration:.07,ease:'none'},.96);
      });
    },layerRef);
    return()=>ctx.revert();
  },[]);
  return <div ref={layerRef} className="floral-flight" aria-hidden="true">{FLORAL_FLIGHT.map((f,i)=><div key={`${f.src}-${i}`} ref={el=>{itemRefs.current[i]=el}} className="floral-flight-item" style={{left:`${f.left}%`,top:`${f.top}%`,width:f.size,height:f.size}}><Image src={f.src} alt="" fill sizes="120px"/></div>)}</div>;
}

function Hero(){
  const [active,setActive]=useState(0);
  const heroRef=useRef<HTMLElement>(null);
  useEffect(()=>{ const t=setInterval(()=>setActive(v=>(v+1)%HEROES.length),5200); return()=>clearInterval(t);},[]);
  useEffect(()=>{
    const el=heroRef.current;
    if(!el || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const gallery=el.querySelector<HTMLElement>('.hero-gallery');
    const copy=el.querySelector<HTMLElement>('.hero-copy');
    if(!gallery||!copy)return;
    const gx=gsap.quickTo(gallery,'x',{duration:1.1,ease:'power3.out'});
    const gy=gsap.quickTo(gallery,'y',{duration:1.1,ease:'power3.out'});
    const cx=gsap.quickTo(copy,'x',{duration:1.3,ease:'power3.out'});
    const cy=gsap.quickTo(copy,'y',{duration:1.3,ease:'power3.out'});
    const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();const nx=(e.clientX-r.left)/r.width-.5;const ny=(e.clientY-r.top)/r.height-.5;gx(nx*16);gy(ny*12);cx(nx*-7);cy(ny*-5)};
    const leave=()=>{gx(0);gy(0);cx(0);cy(0)};
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
    return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)};
  },[]);
  useLayoutEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.set(['.hero-kicker','.hero-title-line','.hero-lead','.hero-cta-row','.hero-photo-shell','.hero-badge','.hero-thumbs','.hero-service-strip','.hero-side-note'],{autoAlpha:0});
      const tl=gsap.timeline({defaults:{ease:'power3.out'}});
      tl.to('.hero-kicker',{autoAlpha:1,y:0,duration:.45})
        .to('.hero-title-line',{autoAlpha:1,y:0,stagger:.075,duration:.72},'-=.18')
        .to('.hero-lead',{autoAlpha:1,y:0,duration:.5},'-=.3')
        .to('.hero-cta-row',{autoAlpha:1,y:0,duration:.5},'-=.28')
        .to('.hero-photo-shell',{autoAlpha:1,scale:1,duration:.85,ease:'power2.out'},'-=.42')
        .to(['.hero-badge','.hero-thumbs','.hero-side-note'],{autoAlpha:1,x:0,y:0,stagger:.08,duration:.55},'-=.28')
        .to('.hero-service-strip',{autoAlpha:1,y:0,duration:.5},'-=.25');
      gsap.set('.hero-kicker',{y:12});
      gsap.set('.hero-title-line',{y:42});
      gsap.set('.hero-lead',{y:14});
      gsap.set('.hero-cta-row',{y:12});
      gsap.set('.hero-photo-shell',{scale:.975});
      gsap.set('.hero-badge',{y:-10});
      gsap.set('.hero-thumbs',{x:14});
      gsap.set('.hero-side-note',{x:-10});
      gsap.set('.hero-service-strip',{y:10});
      tl.progress(0).play();
      gsap.to('.hero-badge',{rotation:360,duration:30,repeat:-1,ease:'none'});
      gsap.to('.hero-script',{y:-5,duration:3.2,repeat:-1,yoyo:true,ease:'sine.inOut'});
    },heroRef);
    return()=>ctx.revert();
  },[]);
  const prev=()=>setActive(v=>(v-1+HEROES.length)%HEROES.length);
  const next=()=>setActive(v=>(v+1)%HEROES.length);
  return <section id="home" className="hero" ref={heroRef}>
    <div className="hero-main-grid">
      <div className="hero-copy">
        <p className="hero-kicker">ISTANBUL-INSPIRED FLORAL ATELIER</p>
        <h1><span className="hero-title-line">Flowers, with</span><span className="hero-title-line">a little</span><span className="hero-title-line"><em>magic in the</em></span><span className="hero-title-line"><em>making.</em></span></h1>
        <p className="hero-lead">Fresh bouquets, thoughtful wrapping and beautiful little details — made to feel personal before the ribbon is even untied.</p>
        <div className="hero-cta-row"><button className="primary-btn" onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>Shop bouquets <ArrowRight size={17}/></button><button className="outline-btn" onClick={()=>document.getElementById('atelier')?.scrollIntoView({behavior:'smooth'})}>Discover our atelier</button></div>
      </div>
      <div className="hero-gallery">
        <div className="hero-photo-shell">
          <div className="hero-image-stage">
            {HEROES.map((src,i)=><Image key={src} src={src} alt="Luxury bouquet" fill priority={i===0} className={`hero-slide ${active===i?'active':''}`} sizes="(max-width:900px) 92vw, 43vw"/>)}
          </div>
          <button className="hero-nav hero-nav-prev" aria-label="Previous bouquet" onClick={prev}><ChevronLeft/></button>
          <button className="hero-nav hero-nav-next" aria-label="Next bouquet" onClick={next}><ChevronRight/></button>
        </div>
        <div className="hero-badge" aria-hidden="true"><span>MORE<br/>THAN JUST<br/>FLOWERS</span><b>♡</b></div>
        <div className="hero-thumbs" aria-label="Bouquet gallery">
          {HEROES.slice(0,3).map((src,i)=><button key={src} className={active===i?'active':''} onClick={()=>setActive(i)} aria-label={`Show bouquet ${i+1}`}><Image src={src} alt="" fill sizes="90px"/></button>)}
          <p className="hero-script">flowers<br/>make people<br/>happier ♡</p>
        </div>
      </div>
    </div>
    <div className="hero-service-strip">
      <div><Sparkles/><span>Made fresh daily</span></div>
      <i/>
      <div><ShoppingBag/><span>Hand wrapped</span></div>
      <i/>
      <div><Truck/><span>Delivered with care</span></div>
    </div>
    <div className="hero-side-note" aria-hidden="true">MADE<br/>WITH LOVE<br/>IN EVERY<br/>BOUQUET</div>
  </section>;
}
function Marquee(){return <div className="marquee"><div>{Array.from({length:8},(_,i)=><span key={i}>FRESH FLOWERS <b>✦</b> HAND WRAPPED <b>✦</b> MADE TO BE REMEMBERED <b>✦</b></span>)}</div></div>}

function ProductCard({p,onAdd}:{p:typeof PRODUCTS[number];onAdd:(p:typeof PRODUCTS[number])=>void}){
  return <article className="product-card reveal">
    <div className="product-image"><span className="product-tag">{p.category}</span><button className="heart" aria-label="Save"><Heart size={18}/></button><Image src={p.image} alt={p.name} fill className="contain-image" sizes="(max-width:700px) 50vw, 25vw"/></div>
    <div className="product-info"><div><h3>{p.name}</h3><p>Fresh bouquet · signature wrap</p></div><strong>{money(p.price)}</strong></div>
    <button className="quick-add" onClick={()=>onAdd(p)}>Quick add <Plus size={16}/></button>
  </article>;
}

function Shop({onAdd}:{onAdd:(p:typeof PRODUCTS[number])=>void}){
  const [filter,setFilter]=useState('All'); const cats=['All','Romantic','Whites','Bold','Gift'];
  const list=filter==='All'?PRODUCTS:PRODUCTS.filter(p=>p.category===filter);
  return <section id="shop" className="section shop-section">
    <div className="section-head reveal"><div><p className="eyebrow">CURATED BOUQUETS</p><h2>Find the one that<br/><em>says it beautifully.</em></h2></div><p>Every arrangement is composed to order, wrapped with care and delivered ready to make an entrance.</p></div>
    <div className="filters reveal">{cats.map(c=><button key={c} onClick={()=>setFilter(c)} className={filter===c?'active':''}>{c}</button>)}</div>
    <div className="product-grid">{list.map(p=><ProductCard key={p.id} p={p} onAdd={onAdd}/>)}</div>
  </section>;
}

function BouquetMotion(){
  const ref=useRef<HTMLElement>(null);
  const pieceRefs=useRef<(HTMLDivElement|null)[]>([]);
  const bouquetRef=useRef<HTMLDivElement>(null);
  const copyRef=useRef<HTMLDivElement>(null);
  const progressRef=useRef<HTMLDivElement>(null);
  const pieces=[
    {src:'/assets/floating-11.png',fromX:-330,fromY:-40,r:-22,finalX:-120,finalY:-36,s:.9},
    {src:'/assets/floating-12.png',fromX:330,fromY:-55,r:20,finalX:115,finalY:-42,s:.86},
    {src:'/assets/floating-13.png',fromX:-280,fromY:250,r:-16,finalX:-92,finalY:92,s:.8},
    {src:'/assets/floating-07.png',fromX:300,fromY:210,r:24,finalX:102,finalY:96,s:.78},
  ];
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile=window.matchMedia('(max-width: 760px)').matches;
    const items=pieceRefs.current.filter((el):el is HTMLDivElement=>Boolean(el));
    const ctx=gsap.context(()=>{
      gsap.set(items,{autoAlpha:reduce?1:0,force3D:true});
      gsap.set(bouquetRef.current,{autoAlpha:reduce?1:0,scale:reduce?1:.82,y:reduce?0:26,force3D:true});
      if(reduce)return;

      items.forEach((el,i)=>{
        const p=pieces[i];
        gsap.set(el,{x:p.fromX*(mobile?.55:1),y:p.fromY*(mobile?.58:1),rotation:p.r*1.5,scale:.72});
      });
      gsap.set(copyRef.current?.children||[],{autoAlpha:0,y:24});
      gsap.set(progressRef.current,{scaleX:0,transformOrigin:'left center'});

      const tl=gsap.timeline({
        scrollTrigger:{
          trigger:ref.current,
          start:mobile?'top 78%':'top top',
          end:mobile?'bottom 25%':'+=1650',
          scrub:mobile?.5:.28,
          pin:mobile?false:true,
          anticipatePin:1,
          invalidateOnRefresh:true
        }
      });

      tl.to(copyRef.current?.children||[],{autoAlpha:1,y:0,stagger:.06,duration:.36,ease:'power3.out'},0)
        .to(progressRef.current,{scaleX:1,duration:1.8,ease:'none'},0);

      items.forEach((el,i)=>{
        const p=pieces[i];
        tl.to(el,{autoAlpha:1,x:p.finalX*(mobile?.7:1),y:p.finalY*(mobile?.7:1),rotation:p.r*.22,scale:p.s,duration:.5,ease:'power3.out'},.25+i*.09);
      });

      tl.to(items,{x:(i)=>pieces[i].finalX*(mobile?.26:.38),y:(i)=>pieces[i].finalY*(mobile?.24:.34),rotation:0,scale:(i)=>pieces[i].s*.76,duration:.5,ease:'sine.inOut'},.82)
        .to(bouquetRef.current,{autoAlpha:1,scale:1,y:0,duration:.58,ease:'power3.out'},.95)
        .to(items,{autoAlpha:.18,scale:(i)=>pieces[i].s*.64,duration:.34,ease:'sine.out'},1.22)
        .to('.atelier-final-word',{autoAlpha:1,y:0,duration:.32,ease:'power2.out'},1.3);
    },ref);
    return()=>ctx.revert();
  },[]);
  return <section id="atelier" className="floral-alchemy atelier-calm" ref={ref}>
    <div className="alchemy-copy" ref={copyRef}>
      <p className="eyebrow">A BOUQUET, COMPOSED</p>
      <h2>Watch every stem<br/><em>find its place.</em></h2>
      <p>No visual noise. Just four gestures: stems arrive, balance shifts, wrapping settles, and the finished bouquet appears.</p>
      <div className="atelier-progress"><div ref={progressRef}/></div>
      <div className="alchemy-steps"><span><b>01</b> ARRIVE</span><span><b>02</b> BALANCE</span><span><b>03</b> GATHER</span><span><b>04</b> BLOOM</span></div>
      <button className="primary-btn" onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>Shop the collection <ArrowRight size={16}/></button>
    </div>
    <div className="alchemy-stage" aria-label="Bouquet assembly animation">
      <div className="atelier-soft-disc"/>
      {pieces.map((p,i)=><div key={p.src} ref={el=>{pieceRefs.current[i]=el}} className="alchemy-piece atelier-piece"><Image src={p.src} alt="" fill sizes="160px"/></div>)}
      <div className="alchemy-bouquet atelier-bouquet" ref={bouquetRef}><Image src="/assets/floating-04.png" alt="Finished signature bouquet" fill sizes="(max-width:760px) 76vw, 520px"/></div>
      <div className="atelier-final-word">COMPOSED BY HAND</div>
    </div>
  </section>;
}

function Occasions(){
  const cards=[
    ['For Love','A grand gesture, softened.','/assets/product-12.webp'],
    ['Graduation','For the moment they worked so hard for.','/assets/product-14.webp'],
    ['Engagement','A beautiful beginning, wrapped in flowers.','/assets/product-03.webp']
  ];
  return <section id="occasions" className="section occasion-section"><div className="center-head reveal"><p className="eyebrow">SHOP BY MOMENT</p><h2>Flowers for the moments<br/><em>worth remembering.</em></h2></div><div className="occasion-grid">{cards.map((c,i)=><article className="occasion-card reveal" key={c[0]}><div className="occasion-img"><Image src={c[2]} alt={c[0]} fill className="contain-image"/></div><span>0{i+1}</span><h3>{c[0]}</h3><p>{c[1]}</p><button onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>Explore collection <ArrowRight size={15}/></button></article>)}</div></section>
}

function Editorial(){
  const details=[
    ['/assets/editorial-02.png','Layered with intention','Paper, ribbon and proportion are chosen to complement the bouquet — never compete with it.'],
    ['/assets/editorial-03.png','The final ribbon','A clean finishing line that makes the unwrapping feel as considered as the flowers.'],
    ['/assets/editorial-04.png','Prepared at our table','Each order is assembled individually, checked, and finished by hand before it leaves.'],
    ['/assets/editorial-05.png','Your note, included','A personal card turns a beautiful bouquet into something unmistakably yours.'],
    ['/assets/editorial-06.png','Freshness first','Flowers are selected for shape, colour and condition before they enter an arrangement.'],
    ['/assets/editorial-07.png','Signature presentation','The wrapping is part of the composition: structured, soft and designed to arrive beautifully.']
  ];
  return <section id="stories" className="craft-section section">
    <div className="craft-intro reveal"><p className="eyebrow">THE FINISHING RITUAL</p><h2>Every detail is<br/><em>part of the gift.</em></h2><p>We keep the presentation calm and precise: soft textures, clean folds and small personal touches that make the bouquet feel complete.</p></div>
    <div className="craft-feature reveal">
      <div className="craft-feature-image"><Image src="/assets/editorial-01.png" alt="Bouquet being handed over" fill className="contain-image" sizes="(max-width:900px) 100vw, 52vw"/></div>
      <div className="craft-feature-copy"><span>01 / THE HANDOFF</span><h3>Beautiful before it is even opened.</h3><p>From the final check at our table to the moment it reaches their hands, the bouquet stays protected, polished and presentation-ready.</p><div className="craft-rule"/><small>WRAPPED BY HAND · PREPARED TO ORDER · READY TO GIFT</small></div>
    </div>
    <div className="craft-grid">{details.map((d,i)=><article className="craft-card reveal" key={d[0]}><div className="craft-image"><Image src={d[0]} alt={d[1]} fill className="contain-image" sizes="(max-width:720px) 90vw, 31vw"/></div><div className="craft-card-copy"><span>{String(i+2).padStart(2,'0')}</span><div><h3>{d[1]}</h3><p>{d[2]}</p></div></div></article>)}</div>
  </section>;
}

function Services(){return <section className="services"><div><Truck/><h4>Thoughtful delivery</h4><p>Handled with care from our table to their door.</p></div><div><Sparkles/><h4>Made fresh</h4><p>Every bouquet is composed after your order.</p></div><div><ShoppingBag/><h4>Signature wrapping</h4><p>Layered paper, ribbon and a handwritten card.</p></div><div><Star/><h4>Premium stems</h4><p>Chosen for shape, color and lasting beauty.</p></div></section>}

function Footer(){
  const ig=INSTAGRAM_URL;
  return <footer className="footer"><div className="footer-top"><div className="footer-brand"><a className="brand footer-logo" href={ig} target="_blank" rel="noreferrer" aria-label="Open BLOOM on Instagram"><span className="brand-mark">✽</span><span>BLOOM</span><small>floral atelier</small></a><p>Quietly luxurious flowers for celebrations, apologies, surprises and ordinary Tuesdays.</p></div><div><h5>Shop</h5><a href="#shop">Bouquets</a><a href="#occasions">Occasions</a><a href="#atelier">Our atelier</a></div><div><h5>Follow</h5><a href="https://www.instagram.com/riweb_s" target="_blank">Instagram ↗</a><a href="https://tiktok.com/@riwebs?_r=1&_t=ZS-98JlqhtmWA5" target="_blank">TikTok ↗</a><a href="https://facebook.com/share/1FPBCjVdJf?mibextid=wwXIfr" target="_blank">Facebook ↗</a><a href="https://www.linkedin.com/in/riham-gamal-1b4ab5312?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">LinkedIn ↗</a></div><div className="newsletter order-contact"><h5>Ready to order?</h5><p>Send us a message on Instagram and we’ll help you choose the right bouquet.</p><a className="footer-order-btn" href={ig} target="_blank" rel="noreferrer">Order on Instagram <ArrowRight size={16}/></a></div></div>
  <div className="riwebs-row"><a href={ig} target="_blank" rel="noreferrer" className="riwebs-badge"><span className="orbit-text">DESIGNED • DEVELOPED • WITH CARE • </span><Image src="/assets/riwebs-logo.png" alt="RiWebs" width={98} height={98}/></a><div><p>Designed & Developed by <a href={ig} target="_blank" rel="noreferrer">RiWebs ↗</a></p><small>© 2026 BLOOM. All rights reserved.</small></div></div></footer>;
}

function CartDrawer({items,setItems,open,setOpen}:{items:CartItem[];setItems:React.Dispatch<React.SetStateAction<CartItem[]>>;open:boolean;setOpen:(v:boolean)=>void}){
  const total=items.reduce((s,i)=>s+i.price*i.qty,0);
  const [copied,setCopied]=useState(false);
  const change=(id:number,d:number)=>setItems(xs=>xs.map(x=>x.id===id?{...x,qty:Math.max(0,x.qty+d)}:x).filter(x=>x.qty>0));
  const checkout=async()=>{
    const lines=items.map(i=>`${i.qty} × ${i.name} — ${money(i.price*i.qty)}`);
    const summary=`BLOOM order\n${lines.join('\n')}\nSubtotal: ${money(total)}`;
    try{ await navigator.clipboard?.writeText(summary); setCopied(true); setTimeout(()=>setCopied(false),2400); }catch{}
    window.open(INSTAGRAM_URL,'_blank','noopener,noreferrer');
  };
  return <><div className={`cart-backdrop ${open?'open':''}`} onClick={()=>setOpen(false)}/><aside className={`cart-drawer ${open?'open':''}`}><div className="cart-head"><div><p className="eyebrow">YOUR SELECTION</p><h3>Shopping bag</h3></div><button onClick={()=>setOpen(false)} aria-label="Close cart"><X/></button></div><div className="cart-list">{items.length===0?<div className="empty-cart"><ShoppingBag/><h4>Your bag is waiting.</h4><p>Add a bouquet and it will appear here.</p><button className="outline-btn" onClick={()=>{setOpen(false);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}}>Browse bouquets</button></div>:items.map(i=><div className="cart-item" key={i.id}><div className="cart-thumb"><Image src={i.image} alt={i.name} fill className="contain-image"/></div><div><h4>{i.name}</h4><p>{money(i.price)}</p><div className="qty"><button onClick={()=>change(i.id,-1)} aria-label={`Remove one ${i.name}`}><Minus/></button><span>{i.qty}</span><button onClick={()=>change(i.id,1)} aria-label={`Add one ${i.name}`}><Plus/></button></div></div></div>)}</div>{items.length>0&&<div className="cart-footer"><div><span>Subtotal</span><strong>{money(total)}</strong></div><button className="primary-btn checkout-btn" onClick={checkout}>Order via Instagram <ArrowRight/></button><small>{copied?'Order summary copied — paste it into your Instagram message.':'Your order summary will be copied before Instagram opens.'}</small></div>}</aside></>;
}

export default function Home(){
  const [cart,setCart]=useState<CartItem[]>([]); const [cartOpen,setCartOpen]=useState(false);
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const add=(p:typeof PRODUCTS[number])=>{setCart(xs=>{const f=xs.find(x=>x.id===p.id);return f?xs.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...xs,{...p,qty:1}]});setCartOpen(true)};
  useEffect(()=>{
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce)return;
    const ctx=gsap.context(()=>{
      ScrollTrigger.batch('.reveal',{
        start:'top 88%',
        once:true,
        onEnter:(batch)=>gsap.fromTo(batch,{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.72,stagger:.055,ease:'power3.out',overwrite:true})
      });
      gsap.utils.toArray<HTMLElement>('.occasion-card').forEach((el,i)=>{
        gsap.fromTo(el,{y:34,rotate:i===0?-1.2:i===2?1.2:0},{y:0,rotate:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
      });
      const feature=document.querySelector<HTMLElement>('.craft-feature-image');
      if(feature){
        gsap.fromTo(feature,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.2,ease:'power4.out',scrollTrigger:{trigger:feature,start:'top 82%',once:true}});
      }
      gsap.utils.toArray<HTMLElement>('.craft-image').forEach((el,i)=>{
        gsap.fromTo(el,{clipPath:'inset(12% 0 12% 0)'},{clipPath:'inset(0% 0 0% 0)',duration:.8,delay:(i%3)*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
      });
    }); return()=>ctx.revert();
  },[]);
  return <SmoothScroll><div className="top-scene"><StoreNav cartCount={count} onCart={()=>setCartOpen(true)}/><Hero/></div><main><Marquee/><Shop onAdd={add}/><BouquetMotion/><Occasions/><Editorial/><Services/></main><Footer/><CartDrawer items={cart} setItems={setCart} open={cartOpen} setOpen={setCartOpen}/></SmoothScroll>
}
