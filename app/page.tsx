'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Star, Truck, X } from 'lucide-react';
import SmoothScroll from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

type Lang = 'en' | 'ar';

const HEROES = [1,2,3,4,5].map(i => `/assets/hero-${i}.png`);
const EDITORIALS = Array.from({length:7},(_,i)=>`/assets/editorial-${String(i+1).padStart(2,'0')}.png`);

const PRODUCTS = [
  ['Ivory Whisper', 1450, 'Whites'], ['Velvet Promise', 1790, 'Bold'], ['Soft Morning', 1350, 'Romantic'],
  ['Golden Hour', 1890, 'Gift'], ['Sage & Silk', 1690, 'Whites'], ['Pearl Garden', 1550, 'Romantic'],
  ['Midnight Gold', 2100, 'Bold'], ['Blush Letter', 1490, 'Romantic'], ['Tulip Poetry', 1850, 'Romantic'],
  ['Apricot Muse', 1720, 'Gift'], ['Lavender Note', 1650, 'Romantic'], ['Red Signature', 2250, 'Bold'],
  ['Chocolate Bloom', 1950, 'Gift'], ['Birthday Cloud', 1780, 'Gift'], ['Navy Pearl', 2050, 'Whites'],
].map((p,i)=>({ id:i+1, name:p[0] as string, price:p[1] as number, category:p[2] as string, image:`/assets/product-${String(i+1).padStart(2,'0')}.webp` }));

type CartItem = typeof PRODUCTS[number] & { qty:number };

const INSTAGRAM_URL='https://www.instagram.com/riweb_s';
const money=(n:number,lang:Lang)=>lang==='ar'?`${n.toLocaleString('ar-EG')} ج.م`:`${n.toLocaleString('en-US')} EGP`;

const categoryLabel=(category:string,lang:Lang)=>{
  const ar:Record<string,string>={All:'الكل',Romantic:'رومانسي',Whites:'أبيض ناعم',Bold:'جريء',Gift:'هدايا'};
  return lang==='ar'?(ar[category]||category):category;
};

function StoreNav({cartCount,savedCount,onCart,onSaved,lang,setLang}:{cartCount:number;savedCount:number;onCart:()=>void;onSaved:()=>void;lang:Lang;setLang:(l:Lang)=>void}){
  const [mobile,setMobile]=useState(false);
  const scroll=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const labels=lang==='ar'?{announcement:'توصيل في اليوم نفسه في مناطق مختارة • زهور طازجة، تُلفّ يدويًا',shop:'الباقات',occ:'المناسبات',atelier:'مشغلنا',stories:'حكاية التفاصيل'}:{announcement:'SAME-DAY DELIVERY IN SELECT AREAS • FRESH FLOWERS, WRAPPED BY HAND',shop:'Shop',occ:'Occasions',atelier:'Our Atelier',stories:'Stories'};
  return <>
    <div className="announcement">{labels.announcement}</div>
    <header className="nav-shell">
      <button className="mobile-menu" onClick={()=>setMobile(true)} aria-label="Open menu"><Menu size={21}/></button>
      <a className="brand" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Open BLOOM on Instagram"><span className="brand-mark">✽</span><span>BLOOM</span><small>{lang==='ar'?'مشغل زهور':'floral atelier'}</small></a>
      <nav className="desktop-nav">
        <button onClick={()=>scroll('shop')}>{labels.shop}</button><button onClick={()=>scroll('occasions')}>{labels.occ}</button><button onClick={()=>scroll('atelier')}>{labels.atelier}</button><button onClick={()=>scroll('stories')}>{labels.stories}</button>
      </nav>
      <div className="nav-actions">
        <button className="lang-switch" onClick={()=>setLang(lang==='en'?'ar':'en')} aria-label="Switch language">{lang==='en'?'AR':'EN'}</button>
        <button aria-label="Browse bouquets" onClick={()=>scroll('shop')}><Search size={19}/></button>
        <button onClick={onSaved} className="saved-button" aria-label={`Saved bouquets: ${savedCount}`}><Heart size={19}/><span>{savedCount}</span></button>
        <button onClick={onCart} className="cart-button" aria-label="Cart"><ShoppingBag size={19}/><span>{cartCount}</span></button>
      </div>
    </header>
    <div className={`mobile-panel ${mobile?'open':''}`}><button className="close-mobile" onClick={()=>setMobile(false)}><X/></button>{[['shop',labels.shop],['occasions',labels.occ],['atelier',labels.atelier],['stories',labels.stories]].map(([id,label])=><button key={id} onClick={()=>{scroll(id);setMobile(false)}}>{label}</button>)}<button className="mobile-lang" onClick={()=>{setLang(lang==='en'?'ar':'en');setMobile(false)}}>{lang==='en'?'العربية':'English'}</button></div>
  </>;
}

function Hero({lang}:{lang:Lang}){
  const [active,setActive]=useState(0);
  const heroRef=useRef<HTMLElement>(null);
  useEffect(()=>{ const t=setInterval(()=>setActive(v=>(v+1)%HEROES.length),5200); return()=>clearInterval(t);},[]);
  useLayoutEffect(()=>{
    const root=heroRef.current;if(!root)return;
    const ctx=gsap.context(()=>{
      const set=['.hero-kicker','.hero-title-line','.hero-lead','.hero-cta-row','.hero-photo-shell','.hero-badge','.hero-thumbs','.hero-service-strip','.hero-side-note'];
      gsap.set(set,{autoAlpha:0});
      gsap.set('.hero-kicker',{y:12});gsap.set('.hero-title-line',{y:46});gsap.set('.hero-lead',{y:18});gsap.set('.hero-cta-row',{y:14});gsap.set('.hero-photo-shell',{scale:.96,clipPath:'inset(10% 8% 8% 8% round 45% 45% 2% 2%)'});gsap.set('.hero-badge',{y:-12});gsap.set('.hero-thumbs',{x:18});gsap.set('.hero-side-note',{x:-10});gsap.set('.hero-service-strip',{y:10});
      const tl=gsap.timeline({defaults:{ease:'power3.out'}});
      tl.to('.hero-kicker',{autoAlpha:1,y:0,duration:.45})
        .to('.hero-title-line',{autoAlpha:1,y:0,stagger:.11,duration:.78},'-=.12')
        .to('.hero-lead',{autoAlpha:1,y:0,duration:.55},'-=.28')
        .to('.hero-photo-shell',{autoAlpha:1,scale:1,clipPath:'inset(0% 0% 0% 0% round 45% 45% 1% 1%)',duration:1.05,ease:'power2.out'},'-=.42')
        .to(['.hero-badge','.hero-thumbs','.hero-side-note'],{autoAlpha:1,x:0,y:0,stagger:.09,duration:.55},'-=.4')
        .to('.hero-cta-row',{autoAlpha:1,y:0,duration:.5},'-=.25')
        .to('.hero-service-strip',{autoAlpha:1,y:0,duration:.5},'-=.25');
      gsap.to('.hero-badge',{rotation:360,duration:34,repeat:-1,ease:'none'});
      gsap.to('.hero-script',{y:-6,duration:3.4,repeat:-1,yoyo:true,ease:'sine.inOut'});
      gsap.to('.hero-gallery',{y:-22,scale:1.018,scrollTrigger:{trigger:root,start:'top top',end:'bottom top',scrub:1.1}});
      gsap.to('.hero-copy',{y:28,opacity:.82,scrollTrigger:{trigger:root,start:'top top',end:'70% top',scrub:1.1}});
      if(!window.matchMedia('(pointer: coarse)').matches){
        const move=(e:MouseEvent)=>{const x=(e.clientX/window.innerWidth-.5);const y=(e.clientY/window.innerHeight-.5);gsap.to('.hero-gallery',{x:x*12,y:y*8,duration:1.2,ease:'power3.out',overwrite:'auto'});gsap.to('.hero-badge',{x:x*22,y:y*18,duration:1.4,ease:'power3.out',overwrite:'auto'});};
        window.addEventListener('mousemove',move);return()=>window.removeEventListener('mousemove',move);
      }
    },root);return()=>ctx.revert();
  },[]);
  const copy=lang==='ar'?{
    kicker:'مشغل زهور بروح إسطنبولية',l1:'زهورٌ لها',l2:'حضورٌ',l3:'وتفاصيل',l4:'تُصنع بمحبة.',lead:'باقات طازجة، وتغليف مدروس، ولمسات صغيرة تجعل الهدية شخصية قبل أن يُفكّ الشريط.',shop:'تسوّق الباقات',atelier:'اكتشف مشغلنا',badge:<>أكثر من<br/>مجرد<br/>زهور</>,script:<>الزهور<br/>تجعل اللحظات<br/>أجمل ♡</>,fresh:'تُجهّز طازجة',wrap:'تغليف يدوي',delivery:'توصيل بعناية',side:<>صُنعت<br/>بمحبة<br/>في كل<br/>باقة</>
  }:{kicker:'ISTANBUL-INSPIRED FLORAL ATELIER',l1:'Flowers, with',l2:'a little',l3:'magic in the',l4:'making.',lead:'Fresh bouquets, thoughtful wrapping and beautiful little details — made to feel personal before the ribbon is even untied.',shop:'Shop bouquets',atelier:'Discover our atelier',badge:<>MORE<br/>THAN JUST<br/>FLOWERS</>,script:<>flowers<br/>make people<br/>happier ♡</>,fresh:'Made fresh daily',wrap:'Hand wrapped',delivery:'Delivered with care',side:<>MADE<br/>WITH LOVE<br/>IN EVERY<br/>BOUQUET</>};
  return <section id="home" className="hero" ref={heroRef}>
    <div className="hero-main-grid">
      <div className="hero-copy"><p className="hero-kicker">{copy.kicker}</p><h1><span className="hero-title-line">{copy.l1}</span><span className="hero-title-line">{copy.l2}</span><span className="hero-title-line"><em>{copy.l3}</em></span><span className="hero-title-line"><em>{copy.l4}</em></span></h1><p className="hero-lead">{copy.lead}</p><div className="hero-cta-row"><button className="primary-btn" onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>{copy.shop} <ArrowRight size={17}/></button><button className="outline-btn" onClick={()=>document.getElementById('atelier')?.scrollIntoView({behavior:'smooth'})}>{copy.atelier}</button></div></div>
      <div className="hero-gallery"><div className="hero-photo-shell"><div className="hero-image-stage">{HEROES.map((src,i)=><Image key={src} src={src} alt="Luxury bouquet" fill priority={i===0} className={`hero-slide ${active===i?'active':''}`} sizes="(max-width:900px) 92vw, 43vw"/>)}</div><button className="hero-nav hero-nav-prev" aria-label="Previous bouquet" onClick={()=>setActive(v=>(v-1+HEROES.length)%HEROES.length)}><ChevronLeft/></button><button className="hero-nav hero-nav-next" aria-label="Next bouquet" onClick={()=>setActive(v=>(v+1)%HEROES.length)}><ChevronRight/></button></div><div className="hero-badge" aria-hidden="true"><span>{copy.badge}</span><b>♡</b></div><div className="hero-thumbs" aria-label="Bouquet gallery">{HEROES.slice(0,3).map((src,i)=><button key={src} className={active===i?'active':''} onClick={()=>setActive(i)} aria-label={`Show bouquet ${i+1}`}><Image src={src} alt="" fill sizes="90px"/></button>)}<p className="hero-script">{copy.script}</p></div></div>
    </div>
    <div className="hero-service-strip"><div><Sparkles/><span>{copy.fresh}</span></div><i/><div><ShoppingBag/><span>{copy.wrap}</span></div><i/><div><Truck/><span>{copy.delivery}</span></div></div><div className="hero-side-note" aria-hidden="true">{copy.side}</div>
  </section>;
}

function Marquee({lang}:{lang:Lang}){const text=lang==='ar'?'زهور طازجة ✦ تغليف يدوي ✦ هدايا تُحفظ في الذاكرة ✦':'FRESH FLOWERS ✦ HAND WRAPPED ✦ MADE TO BE REMEMBERED ✦';return <div className="marquee"><div>{Array.from({length:8},(_,i)=><span key={i}>{text}</span>)}</div></div>}

function ProductCard({p,onAdd,saved,onToggleSaved,lang}:{p:typeof PRODUCTS[number];onAdd:(p:typeof PRODUCTS[number])=>void;saved:boolean;onToggleSaved:(id:number)=>void;lang:Lang}){
  return <article className="product-card reveal"><div className="product-image"><span className="product-tag">{categoryLabel(p.category,lang)}</span><button className={`heart ${saved?'saved':''}`} aria-label={saved?`Remove ${p.name} from saved bouquets`:`Save ${p.name}`} aria-pressed={saved} onClick={()=>onToggleSaved(p.id)}><Heart size={18} fill={saved?'currentColor':'none'}/></button><Image src={p.image} alt={p.name} fill className="contain-image" sizes="(max-width:700px) 50vw, 25vw"/></div><div className="product-info"><div><h3>{p.name}</h3><p>{lang==='ar'?'باقة طازجة · تغليفنا المميز':'Fresh bouquet · signature wrap'}</p></div><strong>{money(p.price,lang)}</strong></div><button className="quick-add" onClick={()=>onAdd(p)}>{lang==='ar'?'أضف سريعًا':'Quick add'} <Plus size={16}/></button></article>;
}

function Shop({onAdd,savedIds,onToggleSaved,showSavedOnly,onShowAll,onShowSaved,lang}:{onAdd:(p:typeof PRODUCTS[number])=>void;savedIds:number[];onToggleSaved:(id:number)=>void;showSavedOnly:boolean;onShowAll:()=>void;onShowSaved:()=>void;lang:Lang}){
  const [filter,setFilter]=useState('All');const cats=['All','Romantic','Whites','Bold','Gift'];const list=showSavedOnly?PRODUCTS.filter(p=>savedIds.includes(p.id)):(filter==='All'?PRODUCTS:PRODUCTS.filter(p=>p.category===filter));
  return <section id="shop" className="section shop-section"><div className="section-head reveal"><div><p className="eyebrow">{lang==='ar'?'باقات مختارة بعناية':'CURATED BOUQUETS'}</p><h2>{lang==='ar'?<>اختر الباقة التي<br/><em>تقول ما تعجز عنه الكلمات.</em></>:<>Find the one that<br/><em>says it beautifully.</em></>}</h2></div><p>{lang==='ar'?'كل باقة تُنسّق حسب الطلب، وتُلف بعناية، وتصل جاهزة لتصنع حضورها الخاص.':'Every arrangement is composed to order, wrapped with care and delivered ready to make an entrance.'}</p></div><div className="filters reveal">{cats.map(c=><button key={c} onClick={()=>{onShowAll();setFilter(c)}} className={!showSavedOnly&&filter===c?'active':''}>{categoryLabel(c,lang)}</button>)}<button onClick={()=>{setFilter('All');onShowSaved()}} className={showSavedOnly?'active saved-filter':''} aria-pressed={showSavedOnly}>{lang==='ar'?'المحفوظة':'Saved'} ({savedIds.length})</button></div>{showSavedOnly&&list.length===0?<div className="saved-empty reveal"><Heart size={26}/><h3>{lang==='ar'?'لا توجد باقات محفوظة بعد':'No saved bouquets yet'}</h3><p>{lang==='ar'?'اضغط على القلب بجانب أي باقة، وستظل محفوظة لك عند عودتك.':'Tap the heart on any bouquet and it will stay saved when you come back.'}</p><button className="outline-btn" onClick={onShowAll}>{lang==='ar'?'تصفّح كل الباقات':'Browse all bouquets'}</button></div>:<div className="product-grid">{list.map(p=><ProductCard key={p.id} p={p} onAdd={onAdd} saved={savedIds.includes(p.id)} onToggleSaved={onToggleSaved} lang={lang}/>)}</div>}</section>;
}

const FILLER_PIECES=[10,13,14,15,16,17].map((n,i)=>({src:`/assets/floating-${String(n).padStart(2,'0')}.png`,x:[34,44,54,64,40,61][i],y:[30,25,33,38,55,57][i],rot:[-24,18,-15,28,14,-22][i],kind:'filler' as const}));
const ROSE_PIECES=[9,12,18,19,20,21].map((n,i)=>({src:`/assets/floating-${String(n).padStart(2,'0')}.png`,x:[42,53,62,47,58,68][i],y:[35,42,46,52,29,57][i],rot:[-18,16,-12,15,-20,18][i],kind:'rose' as const}));
const ASSEMBLY_PIECES=[...FILLER_PIECES,...ROSE_PIECES];

function BouquetMotion({lang}:{lang:Lang}){
  const ref=useRef<HTMLElement>(null);
  const replayTl=useRef<gsap.core.Timeline|null>(null);

  const copy=lang==='ar'?{
    eyebrow:'تكوين حيّ، لا صورة ثابتة',
    kicker:'كل زهرة تعرف طريقها.',
    title:<>تفصيلةٌ تقترب…<br/><em>فتكتمل الحكاية.</em></>,
    body:'تصل الأغصان والورود من أطراف المشهد في إيقاعٍ هادئ، تلتفّ حول الباقة للحظة، ثم تنساب إلى داخلها حتى لا يبقى سوى التكوين النهائي — طبيعيًا، رقيقًا، وكأنه كان هكذا منذ البداية.',
    cue:'مرّر ببطء وشاهد الباقة تكتمل',
    shop:'اكتشف الباقات',
    replay:'أعد المشهد',
    chips:['تفاصيل تصل','أماكن تُكتشف','باقة تكتمل']
  }:{
    eyebrow:'NOT A STILL LIFE',
    kicker:'Every flower knows where to go.',
    title:<>A little detail arrives…<br/><em>and the whole bouquet exhales.</em></>,
    body:'Stems and blooms drift in from the edges, hover for a breath, then melt into the bouquet until the final composition is all that remains — soft, natural and quietly alive.',
    cue:'Scroll slowly and watch the bouquet come together',
    shop:'Discover the bouquets',
    replay:'Replay the scene',
    chips:['Details arrive','Places are found','The bouquet settles']
  };

  const createScene=(root:HTMLElement,scrollDriven:boolean)=>{
    const q=gsap.utils.selector(root);
    const pieces=q<HTMLElement>('.assembly-piece');
    const bouquet=q<HTMLElement>('.signature-main');
    const copyItems=q<HTMLElement>('.signature-copy > *');
    const reveal=q<HTMLElement>('.signature-reveal');
    const whisper=q<HTMLElement>('.signature-whisper');
    const orbit=q<HTMLElement>('.signature-orbit-line');

    const w=Math.max(window.innerWidth,760);
    const h=Math.max(window.innerHeight,640);
    const starts=[
      {x:-w*.58,y:-h*.20},{x:w*.55,y:-h*.30},{x:-w*.62,y:h*.18},{x:w*.60,y:h*.22},
      {x:-w*.30,y:-h*.66},{x:w*.26,y:h*.68},{x:-w*.52,y:-h*.48},{x:w*.50,y:-h*.42},
      {x:-w*.64,y:h*.42},{x:w*.63,y:h*.48},{x:-w*.18,y:h*.72},{x:w*.15,y:-h*.70}
    ];

    pieces.forEach((el,i)=>{
      const st=starts[i%starts.length];
      gsap.set(el,{x:st.x,y:st.y,rotation:ASSEMBLY_PIECES[i].rot+(i%2?95:-95),scale:.62+(i%4)*.07,opacity:0,transformOrigin:'50% 65%'});
    });
    gsap.set(bouquet,{scale:.82,opacity:0,y:42,rotation:-2});
    gsap.set(copyItems,{y:30,opacity:0});
    gsap.set(reveal,{scale:.88,opacity:0});
    gsap.set(whisper,{opacity:0,y:12});
    gsap.set(orbit,{scale:.82,opacity:0,rotation:-10});

    const tl=gsap.timeline(scrollDriven?{}:{paused:true,defaults:{ease:'power3.out'}});
    replayTl.current=tl;

    tl.to(bouquet,{scale:.94,opacity:1,y:6,rotation:0,duration:.9,ease:'power3.out'},0)
      .to(orbit,{scale:1,opacity:.38,rotation:0,duration:1.05,ease:'power2.out'},.06)
      .to(copyItems,{y:0,opacity:1,duration:.68,stagger:.07,ease:'power3.out'},.16)
      .to(whisper,{opacity:.7,y:0,duration:.4},.42);

    pieces.forEach((el,i)=>{
      const p=ASSEMBLY_PIECES[i];
      const t=.72+i*.105;
      const nearX=(i%3-1)*44;
      const nearY=(i%2?1:-1)*(18+(i%3)*7);
      tl.to(el,{opacity:1,duration:.16,ease:'power1.out'},t)
        .to(el,{x:nearX,y:nearY,rotation:p.rot*.24,scale:p.kind==='rose'?.72:.80,duration:.92,ease:'power3.out'},t)
        .to(el,{x:0,y:0,rotation:0,scale:.10,opacity:0,duration:.48,ease:'power2.in'},t+.78)
        .to(bouquet,{scale:1.012,duration:.12,ease:'power2.out'},t+1.08)
        .to(bouquet,{scale:1,duration:.22,ease:'sine.out'},t+1.20);
    });

    tl.to(bouquet,{scale:1,y:0,rotation:0,duration:.5,ease:'power2.out'},'>-.12')
      .to(reveal,{scale:1,opacity:1,duration:.6,ease:'back.out(1.5)'},'<+.02')
      .to(orbit,{opacity:.18,duration:.45},'<');

    return tl;
  };

  const replay=()=>{
    const root=ref.current;if(!root)return;
    replayTl.current?.kill();
    createScene(root,false).play(0);
  };

  useLayoutEffect(()=>{
    const root=ref.current;if(!root)return;
    const mm=gsap.matchMedia();
    const ctx=gsap.context(()=>{
      mm.add('(min-width: 901px)',()=>{
        const tl=createScene(root,true);
        const st=ScrollTrigger.create({trigger:root,start:'top top',end:'+=135%',scrub:.75,pin:true,anticipatePin:1,animation:tl});
        let move:((e:MouseEvent)=>void)|undefined;
        if(window.matchMedia('(pointer:fine)').matches){
          const q=gsap.utils.selector(root);
          move=(e:MouseEvent)=>{
            const r=root.getBoundingClientRect();
            const nx=(e.clientX-r.left)/r.width-.5;
            const ny=(e.clientY-r.top)/r.height-.5;
            gsap.to(q('.signature-main'),{x:nx*10,y:ny*7,duration:1.15,ease:'power3.out',overwrite:'auto'});
            gsap.to(q('.signature-orbit-line'),{x:nx*16,y:ny*11,duration:1.45,ease:'power3.out',overwrite:'auto'});
          };
          root.addEventListener('mousemove',move);
        }
        return()=>{st.kill();if(move)root.removeEventListener('mousemove',move)};
      });

      mm.add('(max-width: 900px)',()=>{
        const tl=createScene(root,false);
        const st=ScrollTrigger.create({trigger:root,start:'top 76%',once:true,onEnter:()=>tl.play(0)});
        return()=>st.kill();
      });
    },root);
    return()=>{replayTl.current?.kill();mm.revert();ctx.revert()};
  },[]);

  return <section id="atelier" className="signature-section signature-theatre section" ref={ref}>
    <div className="signature-bg-word" aria-hidden="true">BLOOM</div>
    <div className="signature-stage">
      <div className="signature-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <p className="signature-kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <p className="signature-lead">{copy.body}</p>
        <div className="signature-chips">{copy.chips.map((x,i)=><span key={x}><b>0{i+1}</b>{x}</span>)}</div>
        <div className="signature-actions signature-reveal">
          <button className="primary-btn" onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>{copy.shop} <ArrowRight size={16}/></button>
          <button className="text-btn" onClick={replay}>{copy.replay} <Sparkles size={14}/></button>
        </div>
      </div>

      <div className="signature-visual">
        <div className="signature-orbit-line" aria-hidden="true"/>
        <span className="signature-index">BLOOM / SIGNATURE No. 04</span>
        <Image className="signature-main" src="/assets/floating-04.png" alt="BLOOM signature bouquet" width={820} height={820}/>
        {ASSEMBLY_PIECES.map((p,i)=><Image key={p.src} className={`assembly-piece ${p.kind==='rose'?'assembly-rose':'assembly-filler'}`} src={p.src} alt="" aria-hidden="true" width={p.kind==='rose'?128:170} height={p.kind==='rose'?178:212} style={{left:`${p.x}%`,top:`${p.y}%`}}/>)}
        <p className="signature-whisper">{copy.cue}</p>
      </div>
    </div>
  </section>;
}

function Occasions({lang}:{lang:Lang}){const cards=lang==='ar'?[['للحب','لفتة كبيرة… بصياغة ناعمة.','/assets/product-12.webp'],['للتخرّج','للحظةٍ استحقّوها بعد كل هذا السعي.','/assets/product-14.webp'],['للخطوبة','بداية جميلة، تُقدَّم بين الزهور.','/assets/product-03.webp']]:[['For Love','A grand gesture, softened.','/assets/product-12.webp'],['Graduation','For the moment they worked so hard for.','/assets/product-14.webp'],['Engagement','A beautiful beginning, wrapped in flowers.','/assets/product-03.webp']];return <section id="occasions" className="section occasion-section"><div className="center-head reveal"><p className="eyebrow">{lang==='ar'?'اختر اللحظة':'SHOP BY MOMENT'}</p><h2>{lang==='ar'?<>زهور للحظات<br/><em>التي تستحق أن تُحفظ.</em></>:<>Flowers for the moments<br/><em>worth remembering.</em></>}</h2></div><div className="occasion-grid">{cards.map((c,i)=><article className="occasion-card reveal" key={c[0]}><div className="occasion-img"><Image src={c[2]} alt={c[0]} fill className="contain-image"/></div><span>0{i+1}</span><h3>{c[0]}</h3><p>{c[1]}</p><button onClick={()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>{lang==='ar'?'استكشف المجموعة':'Explore collection'} <ArrowRight size={15}/></button></article>)}</div></section>}

function Editorial({lang}:{lang:Lang}){const details=lang==='ar'?[[EDITORIALS[1],'طبقات محسوبة','الورق والشريط والنِّسب تُختار لتكمّل الباقة، لا لتنافسها.'],[EDITORIALS[2],'اللمسة الأخيرة','شريط نظيف يجعل لحظة فتح الهدية مدروسة بقدر الزهور نفسها.'],[EDITORIALS[3],'تُجهّز على طاولتنا','كل طلب يُنسّق منفردًا، ويُراجع، ثم يُنهى يدويًا قبل أن يغادر.'],[EDITORIALS[4],'رسالتك معنا','بطاقة شخصية تحوّل الباقة الجميلة إلى شيء يخصّك وحدك.'],[EDITORIALS[5],'الطزاجة أولًا','نختار الزهور بحسب الشكل واللون والحالة قبل أن تدخل أي تنسيق.'],[EDITORIALS[6],'تقديم يحمل بصمتنا','التغليف جزء من التكوين: منظم، ناعم، ومهيّأ للوصول بأجمل صورة.']]:[[EDITORIALS[1],'Layered with intention','Paper, ribbon and proportion are chosen to complement the bouquet — never compete with it.'],[EDITORIALS[2],'The final ribbon','A clean finishing line that makes the unwrapping feel as considered as the flowers.'],[EDITORIALS[3],'Prepared at our table','Each order is assembled individually, checked, and finished by hand before it leaves.'],[EDITORIALS[4],'Your note, included','A personal card turns a beautiful bouquet into something unmistakably yours.'],[EDITORIALS[5],'Freshness first','Flowers are selected for shape, colour and condition before they enter an arrangement.'],[EDITORIALS[6],'Signature presentation','The wrapping is part of the composition: structured, soft and designed to arrive beautifully.']];return <section id="stories" className="craft-section section"><div className="craft-intro reveal"><p className="eyebrow">{lang==='ar'?'طقس اللمسات الأخيرة':'THE FINISHING RITUAL'}</p><h2>{lang==='ar'?<>كل تفصيلة<br/><em>جزء من الهدية.</em></>:<>Every detail is<br/><em>part of the gift.</em></>}</h2><p>{lang==='ar'?'نحب الهدوء والدقة في التقديم: خامات ناعمة، طيّات نظيفة، ولمسات شخصية صغيرة تجعل الباقة مكتملة من أول نظرة.':'We keep the presentation calm and precise: soft textures, clean folds and small personal touches that make the bouquet feel complete.'}</p></div><div className="craft-feature reveal"><div className="craft-feature-image"><Image src={EDITORIALS[0]} alt="Bouquet being handed over" fill className="contain-image" sizes="(max-width:900px) 100vw, 52vw"/></div><div className="craft-feature-copy"><span>01 / {lang==='ar'?'لحظة التسليم':'THE HANDOFF'}</span><h3>{lang==='ar'?'جميلة قبل أن تُفتح حتى.':'Beautiful before it is even opened.'}</h3><p>{lang==='ar'?'من المراجعة الأخيرة على طاولتنا إلى اللحظة التي تصل فيها إلى يد صاحبها، تبقى الباقة محمية، مرتبة، وجاهزة لتقديم نفسها.':'From the final check at our table to the moment it reaches their hands, the bouquet stays protected, polished and presentation-ready.'}</p><div className="craft-rule"/><small>{lang==='ar'?'تغليف يدوي · تجهيز حسب الطلب · جاهزة للإهداء':'WRAPPED BY HAND · PREPARED TO ORDER · READY TO GIFT'}</small></div></div><div className="craft-grid">{details.map((d,i)=><article className="craft-card reveal" key={d[0]}><div className="craft-image"><Image src={d[0]} alt={d[1]} fill className="contain-image" sizes="(max-width:720px) 90vw, 31vw"/></div><div className="craft-card-copy"><span>{String(i+2).padStart(2,'0')}</span><div><h3>{d[1]}</h3><p>{d[2]}</p></div></div></article>)}</div></section>}

function Services({lang}:{lang:Lang}){const s=lang==='ar'?[['توصيل بعناية','من طاولتنا إلى الباب، تُعامل كل باقة كما لو كانت هدية شخصية.'],['تُجهّز طازجة','كل باقة تُنسّق بعد استلام الطلب.'],['تغليف يحمل بصمتنا','طبقات ورق، شريط، وبطاقة مكتوبة بعناية.'],['سيقان مختارة','نختارها للشكل واللون والجمال الذي يدوم.']]:[['Thoughtful delivery','Handled with care from our table to their door.'],['Made fresh','Every bouquet is composed after your order.'],['Signature wrapping','Layered paper, ribbon and a handwritten card.'],['Premium stems','Chosen for shape, color and lasting beauty.']];const icons=[Truck,Sparkles,ShoppingBag,Star];return <section className="services">{s.map((x,i)=>{const I=icons[i];return <div key={x[0]}><I/><h4>{x[0]}</h4><p>{x[1]}</p></div>})}</section>}

function Footer({lang}:{lang:Lang}){const ig=INSTAGRAM_URL;return <footer className="footer"><div className="footer-top"><div className="footer-brand"><a className="brand footer-logo" href={ig} target="_blank" rel="noreferrer"><span className="brand-mark">✽</span><span>BLOOM</span><small>{lang==='ar'?'مشغل زهور':'floral atelier'}</small></a><p>{lang==='ar'?'زهور هادئة وفاخرة للاحتفالات، والمفاجآت، والاعتذارات، وحتى لأيام الثلاثاء العادية.':'Quietly luxurious flowers for celebrations, apologies, surprises and ordinary Tuesdays.'}</p></div><div><h5>{lang==='ar'?'تسوّق':'Shop'}</h5><a href="#shop">{lang==='ar'?'الباقات':'Bouquets'}</a><a href="#occasions">{lang==='ar'?'المناسبات':'Occasions'}</a><a href="#atelier">{lang==='ar'?'مشغلنا':'Our atelier'}</a></div><div><h5>{lang==='ar'?'تابعنا':'Follow'}</h5><a href={ig} target="_blank">Instagram ↗</a><a href="https://tiktok.com/@riwebs?_r=1&_t=ZS-98JlqhtmWA5" target="_blank">TikTok ↗</a><a href="https://facebook.com/share/1FPBCjVdJf?mibextid=wwXIfr" target="_blank">Facebook ↗</a><a href="https://www.linkedin.com/in/riham-gamal-1b4ab5312?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">LinkedIn ↗</a></div><div className="newsletter order-contact"><h5>{lang==='ar'?'جاهز لاختيار باقتك؟':'Ready to order?'}</h5><p>{lang==='ar'?'راسلنا على إنستجرام، وسنساعدك في اختيار الباقة المناسبة للحظة.':'Send us a message on Instagram and we’ll help you choose the right bouquet.'}</p><a className="footer-order-btn" href={ig} target="_blank" rel="noreferrer">{lang==='ar'?'اطلب عبر إنستجرام':'Order on Instagram'} <ArrowRight size={16}/></a></div></div><div className="riwebs-row"><a href={ig} target="_blank" rel="noreferrer" className="riwebs-badge"><span className="orbit-text">DESIGNED • DEVELOPED • WITH CARE • </span><Image src="/assets/riwebs-logo.png" alt="RiWebs" width={98} height={98}/></a><div><p>{lang==='ar'?'تصميم وتطوير':'Designed & Developed by'} <a href={ig} target="_blank" rel="noreferrer">RiWebs ↗</a></p><small>© 2026 BLOOM. {lang==='ar'?'جميع الحقوق محفوظة.':'All rights reserved.'}</small></div></div></footer>}

function CartDrawer({items,setItems,open,setOpen,lang}:{items:CartItem[];setItems:React.Dispatch<React.SetStateAction<CartItem[]>>;open:boolean;setOpen:(v:boolean)=>void;lang:Lang}){const total=items.reduce((s,i)=>s+i.price*i.qty,0);const [copied,setCopied]=useState(false);const change=(id:number,d:number)=>setItems(xs=>xs.map(x=>x.id===id?{...x,qty:Math.max(0,x.qty+d)}:x).filter(x=>x.qty>0));const checkout=async()=>{const lines=items.map(i=>`${i.qty} × ${i.name} — ${money(i.price*i.qty,lang)}`);const summary=`BLOOM order\n${lines.join('\n')}\nSubtotal: ${money(total,lang)}`;try{await navigator.clipboard?.writeText(summary);setCopied(true);setTimeout(()=>setCopied(false),2400)}catch{}window.open(INSTAGRAM_URL,'_blank','noopener,noreferrer')};return <><div className={`cart-backdrop ${open?'open':''}`} onClick={()=>setOpen(false)}/><aside className={`cart-drawer ${open?'open':''}`}><div className="cart-head"><div><p className="eyebrow">{lang==='ar'?'اختياراتك':'YOUR SELECTION'}</p><h3>{lang==='ar'?'سلة التسوّق':'Shopping bag'}</h3></div><button onClick={()=>setOpen(false)}><X/></button></div><div className="cart-list">{items.length===0?<div className="empty-cart"><ShoppingBag/><h4>{lang==='ar'?'سلتك بانتظار باقة جميلة.':'Your bag is waiting.'}</h4><p>{lang==='ar'?'أضف أي باقة وستظهر هنا.':'Add a bouquet and it will appear here.'}</p><button className="outline-btn" onClick={()=>{setOpen(false);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}}>{lang==='ar'?'تصفّح الباقات':'Browse bouquets'}</button></div>:items.map(i=><div className="cart-item" key={i.id}><div className="cart-thumb"><Image src={i.image} alt={i.name} fill className="contain-image"/></div><div><h4>{i.name}</h4><p>{money(i.price,lang)}</p><div className="qty"><button onClick={()=>change(i.id,-1)}><Minus/></button><span>{i.qty}</span><button onClick={()=>change(i.id,1)}><Plus/></button></div></div></div>)}</div>{items.length>0&&<div className="cart-footer"><div><span>{lang==='ar'?'الإجمالي':'Subtotal'}</span><strong>{money(total,lang)}</strong></div><button className="primary-btn checkout-btn" onClick={checkout}>{lang==='ar'?'اطلب عبر إنستجرام':'Order via Instagram'} <ArrowRight/></button><small>{copied?(lang==='ar'?'تم نسخ ملخص الطلب — الصقه في رسالة إنستجرام.':'Order summary copied — paste it into your Instagram message.'):(lang==='ar'?'سننسخ ملخص طلبك قبل فتح إنستجرام.':'Your order summary will be copied before Instagram opens.')}</small></div>}</aside></>}

export default function Home(){
  const [lang,setLangState]=useState<Lang>('en');const [cart,setCart]=useState<CartItem[]>([]);const [cartOpen,setCartOpen]=useState(false);const [savedIds,setSavedIds]=useState<number[]>([]);const [savedReady,setSavedReady]=useState(false);const [showSavedOnly,setShowSavedOnly]=useState(false);const count=cart.reduce((s,x)=>s+x.qty,0);
  const setLang=(l:Lang)=>{setLangState(l);try{localStorage.setItem('bloom-lang',l)}catch{}};
  const add=(p:typeof PRODUCTS[number])=>{setCart(xs=>{const f=xs.find(x=>x.id===p.id);return f?xs.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...xs,{...p,qty:1}]});setCartOpen(true)};const toggleSaved=(id:number)=>setSavedIds(xs=>xs.includes(id)?xs.filter(x=>x!==id):[...xs,id]);const openSaved=()=>{setShowSavedOnly(true);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})};
  useEffect(()=>{try{const savedLang=window.localStorage.getItem('bloom-lang') as Lang|null;if(savedLang==='ar'||savedLang==='en')setLangState(savedLang);const raw=window.localStorage.getItem('bloom-saved-bouquets');const parsed=raw?JSON.parse(raw):[];if(Array.isArray(parsed))setSavedIds(parsed.filter((x):x is number=>typeof x==='number'))}catch{}setSavedReady(true)},[]);
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr'},[lang]);
  useEffect(()=>{if(!savedReady)return;try{window.localStorage.setItem('bloom-saved-bouquets',JSON.stringify(savedIds))}catch{}},[savedIds,savedReady]);
  useEffect(()=>{const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.fromTo(el,{opacity:0,y:38},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}))});return()=>ctx.revert()},[]);
  return <SmoothScroll><div className="site-shell" dir={lang==='ar'?'rtl':'ltr'}><div className="top-scene"><StoreNav cartCount={count} savedCount={savedIds.length} onCart={()=>setCartOpen(true)} onSaved={openSaved} lang={lang} setLang={setLang}/><Hero lang={lang}/></div><main><Marquee lang={lang}/><Shop onAdd={add} savedIds={savedIds} onToggleSaved={toggleSaved} showSavedOnly={showSavedOnly} onShowAll={()=>setShowSavedOnly(false)} onShowSaved={()=>setShowSavedOnly(true)} lang={lang}/><BouquetMotion lang={lang}/><Occasions lang={lang}/><Editorial lang={lang}/><Services lang={lang}/></main><Footer lang={lang}/><CartDrawer items={cart} setItems={setCart} open={cartOpen} setOpen={setCartOpen} lang={lang}/></div></SmoothScroll>;
}
