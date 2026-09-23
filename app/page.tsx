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

function StoreNav({cartCount,savedCount,onCart,onSaved}:{cartCount:number;savedCount:number;onCart:()=>void;onSaved:()=>void}){
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
      <div className="nav-actions"><button aria-label="Browse bouquets" onClick={()=>scroll('shop')}><Search size={19}/></button><button onClick={onSaved} className="saved-button" aria-label={`Saved bouquets: ${savedCount}`}><Heart size={19}/><span>{savedCount}</span></button><button onClick={onCart} className="cart-button" aria-label="Cart"><ShoppingBag size={19}/><span>{cartCount}</span></button></div>
    </header>
    <div className={`mobile-panel ${mobile?'open':''}`}><button className="close-mobile" onClick={()=>setMobile(false)}><X/></button>{['shop','occasions','atelier','stories'].map(x=><button key={x} onClick={()=>{scroll(x);setMobile(false)}}>{x}</button>)}</div>
  </>;
}

function Hero(){
  const [active,setActive]=useState(0);
  const heroRef=useRef<HTMLElement>(null);
  useEffect(()=>{ const t=setInterval(()=>setActive(v=>(v+1)%HEROES.length),5200); return()=>clearInterval(t);},[]);
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

function ProductCard({p,onAdd,saved,onToggleSaved}:{p:typeof PRODUCTS[number];onAdd:(p:typeof PRODUCTS[number])=>void;saved:boolean;onToggleSaved:(id:number)=>void}){
  return <article className="product-card reveal">
    <div className="product-image"><span className="product-tag">{p.category}</span><button className={`heart ${saved?'saved':''}`} aria-label={saved?`Remove ${p.name} from saved bouquets`:`Save ${p.name}`} aria-pressed={saved} onClick={()=>onToggleSaved(p.id)}><Heart size={18} fill={saved?'currentColor':'none'}/></button><Image src={p.image} alt={p.name} fill className="contain-image" sizes="(max-width:700px) 50vw, 25vw"/></div>
    <div className="product-info"><div><h3>{p.name}</h3><p>Fresh bouquet · signature wrap</p></div><strong>{money(p.price)}</strong></div>
    <button className="quick-add" onClick={()=>onAdd(p)}>Quick add <Plus size={16}/></button>
  </article>;
}

function Shop({onAdd,savedIds,onToggleSaved,showSavedOnly,onShowAll,onShowSaved}:{onAdd:(p:typeof PRODUCTS[number])=>void;savedIds:number[];onToggleSaved:(id:number)=>void;showSavedOnly:boolean;onShowAll:()=>void;onShowSaved:()=>void}){
  const [filter,setFilter]=useState('All'); const cats=['All','Romantic','Whites','Bold','Gift'];
  const list=showSavedOnly?PRODUCTS.filter(p=>savedIds.includes(p.id)):(filter==='All'?PRODUCTS:PRODUCTS.filter(p=>p.category===filter));
  return <section id="shop" className="section shop-section">
    <div className="section-head reveal"><div><p className="eyebrow">CURATED BOUQUETS</p><h2>Find the one that<br/><em>says it beautifully.</em></h2></div><p>Every arrangement is composed to order, wrapped with care and delivered ready to make an entrance.</p></div>
    <div className="filters reveal">{cats.map(c=><button key={c} onClick={()=>{onShowAll();setFilter(c)}} className={!showSavedOnly&&filter===c?'active':''}>{c}</button>)}<button onClick={()=>{setFilter('All');onShowSaved()}} className={showSavedOnly?'active saved-filter':''} aria-pressed={showSavedOnly}>Saved ({savedIds.length})</button></div>
    {showSavedOnly&&list.length===0?<div className="saved-empty reveal"><Heart size={26}/><h3>No saved bouquets yet</h3><p>Tap the heart on any bouquet and it will stay saved when you come back.</p><button className="outline-btn" onClick={onShowAll}>Browse all bouquets</button></div>:<div className="product-grid">{list.map(p=><ProductCard key={p.id} p={p} onAdd={onAdd} saved={savedIds.includes(p.id)} onToggleSaved={onToggleSaved}/>)}</div>}
  </section>;
}

function BouquetMotion(){
  const ref=useRef<HTMLElement>(null);
  const [bloomed,setBloomed]=useState(false);
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.fromTo('.signature-main',{y:55,scale:.94,opacity:0},{y:0,scale:1,opacity:1,duration:1.25,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 68%'}});
      gsap.fromTo('.signature-copy > *',{y:28,opacity:0},{y:0,opacity:1,duration:.8,stagger:.09,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 72%'}});
      gsap.to('.botanical-a',{y:-22,rotation:7,duration:4.5,yoyo:true,repeat:-1,ease:'sine.inOut'});
      gsap.to('.botanical-b',{y:18,rotation:-8,duration:5.2,yoyo:true,repeat:-1,ease:'sine.inOut'});
      gsap.to('.botanical-c',{x:14,y:-10,rotation:5,duration:4.8,yoyo:true,repeat:-1,ease:'sine.inOut'});
      gsap.to('.signature-main',{y:-18,scrollTrigger:{trigger:ref.current,start:'top bottom',end:'bottom top',scrub:1.3}});
    },ref);
    return()=>ctx.revert();
  },[]);
  useEffect(()=>{
    if(!ref.current)return;
    const petals=ref.current.querySelectorAll('.bloom-petal');
    gsap.to(petals,{x:(i)=>bloomed?[[-120,-50],[135,-45],[-90,105],[118,95]][i%4][0]:0,y:(i)=>bloomed?[[-120,-50],[135,-45],[-90,105],[118,95]][i%4][1]:0,rotation:(i)=>bloomed?(i%2?34:-28):0,scale:bloomed?1.04:.7,opacity:bloomed?.9:.42,duration:1.15,stagger:.06,ease:'power3.inOut'});
  },[bloomed]);
  return <section id="atelier" className="signature-section section" ref={ref}>
    <div className="signature-visual">
      <div className="signature-frame">
        <span className="frame-label">BLOOM / SIGNATURE No. 04</span>
        <div className="signature-orbit"/>
        <Image className="signature-main" src="/assets/floating-04.png" alt="Signature pink bouquet" width={620} height={620}/>
        <Image className="bloom-petal petal-one" src="/assets/floating-01.png" alt="Rose petal" width={95} height={95}/>
        <Image className="bloom-petal petal-two" src="/assets/floating-02.png" alt="Rose petal" width={110} height={110}/>
        <Image className="bloom-petal petal-three" src="/assets/floating-01.png" alt="Rose petal" width={75} height={75}/>
        <Image className="bloom-petal petal-four" src="/assets/floating-02.png" alt="Rose petal" width={84} height={84}/>
      </div>
      <Image className="botanical botanical-a" src="/assets/floating-07.png" alt="Botanical branch" width={190} height={240}/>
      <Image className="botanical botanical-b" src="/assets/floating-12.png" alt="White rose" width={150} height={210}/>
      <Image className="botanical botanical-c" src="/assets/floating-10.png" alt="Leaf" width={150} height={110}/>
    </div>
    <div className="signature-copy">
      <p className="eyebrow">THE BLOOM SIGNATURE</p>
      <h2>Composed with restraint.<br/><em>Finished with feeling.</em></h2>
      <p>One focal bouquet, a few deliberate details, and room for every flower to breathe. This is our approach to modern gifting — elegant, balanced and never overdone.</p>
      <div className="signature-points"><span><b>01</b> Premium stems</span><span><b>02</b> Hand-tied balance</span><span><b>03</b> Signature wrapping</span></div>
      <div className="signature-actions"><button className="primary-btn" onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>Shop signature bouquets <ArrowRight size={16}/></button><button className="text-btn" onClick={()=>setBloomed(v=>!v)}>{bloomed?'Settle the petals':'Watch it bloom'} <Sparkles size={14}/></button></div>
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
  const [savedIds,setSavedIds]=useState<number[]>([]);
  const [savedReady,setSavedReady]=useState(false);
  const [showSavedOnly,setShowSavedOnly]=useState(false);
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const add=(p:typeof PRODUCTS[number])=>{setCart(xs=>{const f=xs.find(x=>x.id===p.id);return f?xs.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...xs,{...p,qty:1}]});setCartOpen(true)};
  const toggleSaved=(id:number)=>setSavedIds(xs=>xs.includes(id)?xs.filter(x=>x!==id):[...xs,id]);
  const openSaved=()=>{setShowSavedOnly(true);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});};
  useEffect(()=>{
    try{const raw=window.localStorage.getItem('bloom-saved-bouquets');const parsed=raw?JSON.parse(raw):[];if(Array.isArray(parsed))setSavedIds(parsed.filter((x):x is number=>typeof x==='number'));}catch{}
    setSavedReady(true);
  },[]);
  useEffect(()=>{if(!savedReady)return;try{window.localStorage.setItem('bloom-saved-bouquets',JSON.stringify(savedIds));}catch{}},[savedIds,savedReady]);
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.fromTo(el,{opacity:0,y:38},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}));
    }); return()=>ctx.revert();
  },[]);
  return <SmoothScroll><div className="top-scene"><StoreNav cartCount={count} savedCount={savedIds.length} onCart={()=>setCartOpen(true)} onSaved={openSaved}/><Hero/></div><main><Marquee/><Shop onAdd={add} savedIds={savedIds} onToggleSaved={toggleSaved} showSavedOnly={showSavedOnly} onShowAll={()=>setShowSavedOnly(false)} onShowSaved={()=>setShowSavedOnly(true)}/><BouquetMotion/><Occasions/><Editorial/><Services/></main><Footer/><CartDrawer items={cart} setItems={setCart} open={cartOpen} setOpen={setCartOpen}/></SmoothScroll>
}
