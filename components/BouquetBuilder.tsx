'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlowerSVGs, FlowerType, PetalSVG } from './flowers/FlowerSVGs';

gsap.registerPlugin(ScrollTrigger);

interface FlowerOption {
  type: FlowerType;
  name: string;
  color: string;
  defaultSize: number;
}

const FLOWER_OPTIONS: FlowerOption[] = [
  { type: 'rose', name: 'Rose', color: '#C98291', defaultSize: 100 },
  { type: 'peony', name: 'Peony', color: '#E8B8C0', defaultSize: 110 },
  { type: 'tulip', name: 'Tulip', color: '#D4A574', defaultSize: 90 },
  { type: 'lily', name: 'Lily', color: '#EFE4D2', defaultSize: 95 },
  { type: 'orchid', name: 'Orchid', color: '#C9A96E', defaultSize: 90 },
  { type: 'ranunculus', name: 'Ranunculus', color: '#E8B8C0', defaultSize: 85 },
  { type: 'babysbreath', name: "Baby's Breath", color: '#F7F1E8', defaultSize: 75 },
  { type: 'wildflower', name: 'Wildflower', color: '#C9A96E', defaultSize: 70 },
];

const FEELINGS = [
  { name: 'Love', color: '#C98291', bg: 'radial-gradient(ellipse at 50% 60%, rgba(201,130,145,0.12), transparent 70%)' },
  { name: 'Thank You', color: '#87977D', bg: 'radial-gradient(ellipse at 50% 60%, rgba(135,151,125,0.12), transparent 70%)' },
  { name: 'Miss You', color: '#C9A96E', bg: 'radial-gradient(ellipse at 50% 60%, rgba(201,169,110,0.12), transparent 70%)' },
  { name: 'Just Because', color: '#E8B8C0', bg: 'radial-gradient(ellipse at 50% 60%, rgba(232,184,192,0.12), transparent 70%)' },
];

interface PlacedFlower {
  id: string;
  type: FlowerType;
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  depth: number;
}

export default function BouquetBuilder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vaseRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<PlacedFlower[]>([]);
  const [feeling, setFeeling] = useState(0);
  const placedRef = useRef<PlacedFlower[]>([]);
  placedRef.current = placed;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const title = section.querySelector('.builder-title');
    if (!title) return;

    gsap.fromTo(
      title,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 40%', scrub: 1 },
      }
    );
  }, []);

  useEffect(() => {
    if (atmosphereRef.current) {
      gsap.to(atmosphereRef.current, {
        background: FEELINGS[feeling].bg,
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }
  }, [feeling]);

  const addFlower = useCallback((option: FlowerOption, e: React.MouseEvent) => {
    const vase = vaseRef.current;
    if (!vase) return;

    const vaseRect = vase.getBoundingClientRect();
    const targetCx = vaseRect.left + vaseRect.width / 2;
    const targetCy = vaseRect.top + vaseRect.height * 0.35;

    const srcEl = e.currentTarget as HTMLElement;
    const srcRect = srcEl.getBoundingClientRect();
    const srcX = srcRect.left + srcRect.width / 2;
    const srcY = srcRect.top + srcRect.height / 2;

    const id = `${option.type}-${Date.now()}-${Math.random()}`;
    const count = placedRef.current.length;
    const angle = (count * 47) % 360;
    const radius = 20 + Math.min(count, 10) * 8;
    const offsetX = Math.cos((angle * Math.PI) / 180) * radius;
    const offsetY = Math.sin((angle * Math.PI) / 180) * radius * 0.5 - count * 5;
    const rotation = (Math.random() - 0.5) * 35;
    const depth = 0.4 + Math.random() * 0.5;

    // Create flying flower element (actual SVG, not image)
    const flyEl = document.createElement('div');
    flyEl.style.position = 'fixed';
    flyEl.style.left = `${srcX - option.defaultSize / 2}px`;
    flyEl.style.top = `${srcY - option.defaultSize / 2}px`;
    flyEl.style.width = `${option.defaultSize}px`;
    flyEl.style.height = `${option.defaultSize}px`;
    flyEl.style.zIndex = '200';
    flyEl.style.pointerEvents = 'none';
    flyEl.style.willChange = 'transform, opacity';

    const SVGComponent = FlowerSVGs[option.type];
    // Render SVG via innerHTML of a temporary mount
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '100%';
    tempDiv.style.height = '100%';
    flyEl.appendChild(tempDiv);
    document.body.appendChild(flyEl);

    // Use SVG markup directly
    tempDiv.innerHTML = renderSVGString(option.type, option.defaultSize, option.color);

    const newFlower: PlacedFlower = {
      id,
      type: option.type,
      color: option.color,
      size: option.defaultSize * (0.5 + depth * 0.3),
      x: offsetX,
      y: offsetY,
      rotation,
      depth,
    };

    // Animate flight with curved path + overshoot
    const tl = gsap.timeline();
    tl.to(flyEl, {
      x: (targetCx - srcX) * 0.7 + offsetX * 0.5,
      y: (targetCy - srcY) * 0.5 + offsetY * 0.5,
      rotation: rotation * 1.5,
      scale: 0.7,
      duration: 0.5,
      ease: 'power2.in',
    });
    tl.to(flyEl, {
      x: targetCx - srcX + offsetX,
      y: targetCy - srcY + offsetY,
      rotation: rotation,
      scale: newFlower.size / option.defaultSize,
      duration: 0.5,
      ease: 'back.out(1.4)',
    });
    tl.to(flyEl, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => flyEl.remove(),
    });
    tl.add(() => {
      setPlaced((prev) => [...prev, newFlower]);
    }, '-=0.2');
  }, []);

  const removeFlower = (id: string) => {
    const el = vaseRef.current?.querySelector(`[data-placed-id="${id}"]`) as HTMLElement;
    if (el) {
      gsap.to(el, {
        y: '+=120',
        opacity: 0,
        scale: 0,
        rotation: '+=180',
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => setPlaced((prev) => prev.filter((f) => f.id !== id)),
      });
    } else {
      setPlaced((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const clearAll = () => {
    const els = vaseRef.current?.querySelectorAll('[data-placed-id]');
    if (els) {
      els.forEach((el, i) => {
        gsap.to(el, {
          y: '+=150',
          opacity: 0,
          scale: 0,
          rotation: '+=360',
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.in',
        });
      });
    }
    setTimeout(() => setPlaced([]), 600 + (els?.length || 0) * 50);
  };

  // Mouse parallax on placed flowers
  useEffect(() => {
    const vase = vaseRef.current;
    if (!vase) return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    const onMove = (e: MouseEvent) => {
      const rect = vase.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      placed.forEach((f) => {
        const el = vase.querySelector(`[data-placed-id="${f.id}"]`) as HTMLElement;
        if (!el) return;
        gsap.to(el, {
          x: f.x + nx * 15 * f.depth,
          y: f.y + ny * 10 * f.depth,
          duration: 0.6,
          ease: 'power3.out',
        });
      });
    };

    vase.addEventListener('mousemove', onMove);
    return () => vase.removeEventListener('mousemove', onMove);
  }, [placed]);

  return (
    <section
      id="bouquet-builder"
      ref={sectionRef}
      className="relative min-h-screen w-full py-20 md:py-32 overflow-hidden"
      style={{ background: '#F7F1E8' }}
    >
      <div ref={atmosphereRef} className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16 builder-title">
          <p className="font-mono-elegant text-[0.55rem] tracking-[0.5em] text-burgundy/50 mb-4">
            BOUQUET BUILDER
          </p>
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-7xl text-burgundy leading-tight">
            Build from <span className="italic" style={{ color: '#5A2633' }}>individual</span> flowers
          </h2>
        </div>

        {/* Feeling selector */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 md:mb-16">
          <p className="w-full text-center font-mono-elegant text-[0.55rem] tracking-[0.4em] text-burgundy/50 mb-2">
            CHOOSE YOUR FEELING
          </p>
          {FEELINGS.map((f, i) => (
            <button
              key={i}
              onClick={() => setFeeling(i)}
              className={`px-5 py-2.5 rounded-full font-mono-elegant text-[0.6rem] tracking-[0.25em] transition-all duration-400 border ${
                feeling === i ? 'border-transparent text-cream scale-105' : 'border-[#5A2633]/20 text-[#5A2633]/60 hover:border-[#5A2633]/50'
              }`}
              style={feeling === i ? { background: f.color } : {}}
              data-hover
            >
              {f.name.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Vase area */}
          <div className="relative flex flex-col items-center order-1 md:order-2">
            <div ref={vaseRef} className="relative" style={{ width: 'min(360px, 82vw)', height: 'min(440px, 60vw)' }}>
              {/* Placed flowers — individual SVG elements */}
              {placed.map((f) => {
                const SVGComponent = FlowerSVGs[f.type];
                return (
                  <div
                    key={f.id}
                    data-placed-id={f.id}
                    className="absolute left-1/2 top-1/2 cursor-pointer"
                    style={{
                      width: f.size,
                      height: f.size,
                      marginLeft: -f.size / 2,
                      marginTop: -f.size / 2,
                      transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotation}deg)`,
                      zIndex: Math.round(f.depth * 100),
                      willChange: 'transform',
                    }}
                    onClick={(e) => { e.stopPropagation(); removeFlower(f.id); }}
                    data-hover
                  >
                    <SVGComponent size={f.size} color={f.color} />
                  </div>
                );
              })}

              {/* Vase */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none" style={{ width: 'min(130px, 32vw)', height: 'min(180px, 25vw)' }}>
                <svg viewBox="0 0 130 180" width="100%" height="100%">
                  <defs>
                    <linearGradient id="builder-vase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EFE4D2" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>
                  <path d="M28 15 Q28 5 65 5 Q102 5 102 15 L92 65 Q112 80 112 125 Q112 170 65 170 Q18 170 18 125 Q18 80 38 65 Z"
                    fill="url(#builder-vase)" stroke="#C9A96E" strokeWidth="0.5" opacity="0.7" />
                </svg>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={clearAll} disabled={placed.length === 0}
                className="font-mono-elegant text-[0.55rem] tracking-[0.3em] text-[#5A2633]/50 hover:text-[#5A2633] transition-colors disabled:opacity-30" data-hover>
                CLEAR
              </button>
              <span className="font-mono-elegant text-[0.55rem] tracking-[0.3em] text-[#5A2633]/40">
                {placed.length} FLOWER{placed.length !== 1 ? 'S' : ''}
              </span>
            </div>
          </div>

          {/* Flower selection */}
          <div className="order-2 md:order-1">
            <p className="font-mono-elegant text-[0.55rem] tracking-[0.4em] text-[#5A2633]/50 mb-6 text-center md:text-left">
              TAP A FLOWER TO SEND IT FLYING
            </p>
            <div className="grid grid-cols-4 gap-4 sm:gap-5">
              {FLOWER_OPTIONS.map((f, i) => {
                const SVGComponent = FlowerSVGs[f.type];
                return (
                  <button
                    key={i}
                    onClick={(e) => addFlower(f, e)}
                    className="group relative flex items-center justify-center aspect-square rounded-full transition-all duration-500 hover:scale-105"
                    style={{
                      background: 'rgba(239,228,210,0.4)',
                      border: '1px solid rgba(201,169,110,0.2)',
                    }}
                    data-hover
                  >
                    <div className="transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                      <SVGComponent size={65} color={f.color} />
                    </div>
                    <p className="absolute -bottom-7 left-0 right-0 text-center font-serif text-xs text-[#5A2633]/70 italic">
                      {f.name}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="mt-12 font-serif text-sm text-[#5A2633]/50 italic leading-relaxed max-w-xs">
              Each flower flies independently into your bouquet. Tap a placed flower to remove it. Move your mouse to see them react.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper to render SVG as string for the flying element
function renderSVGString(type: FlowerType, size: number, color: string): string {
  // Simple inline SVGs matching the component versions
  const svgs: Record<FlowerType, string> = {
    rose: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 56)"><circle r="8" fill="#8C5A6B" opacity="0.7"/>${[0,60,120,180,240,300].map(a=>`<path d="M0 -45 C-22 -42 -28 -20 -14 -8 C-8 -14 -4 -14 0 -14 C4 -14 8 -14 14 -8 C28 -20 22 -42 0 -45 Z" fill="${color}" opacity="0.85" transform="rotate(${a})"/>`).join('')}${[30,90,150,210,270,330].map(a=>`<path d="M0 -28 C-14 -26 -18 -12 -9 -4 C-5 -8 -2 -8 0 -8 C2 -8 5 -8 9 -4 C18 -12 14 -26 0 -28 Z" fill="${color}" opacity="0.9" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="${color}"/></g></svg>`,
    peony: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 60)">${Array.from({length:8}).map((_,i)=>{const a=(i/8)*360;return `<path d="M0 -48 C-18 -48 -30 -35 -28 -18 C-24 -28 -12 -32 0 -32 C12 -32 24 -28 28 -18 C30 -35 18 -48 0 -48 Z" fill="${color}" opacity="0.8" transform="rotate(${a})"/>`}).join('')}${Array.from({length:7}).map((_,i)=>{const a=(i/7)*360+22;return `<path d="M0 -35 C-14 -35 -22 -25 -20 -12 C-16 -20 -8 -22 0 -22 C8 -22 16 -20 20 -12 C22 -25 14 -35 0 -35 Z" fill="${color}" opacity="0.88" transform="rotate(${a})"/>`}).join('')}<circle r="7" fill="#C98291" opacity="0.4"/></g></svg>`,
    tulip: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 55)"><path d="M0 15 Q-2 35 0 58" stroke="#33483D" strokeWidth="2.5" fill="none" opacity="0.7"/><path d="M0 -38 C-15 -35 -18 -15 -12 10 C-6 6 -3 -10 0 -16 C3 -10 6 6 12 10 C18 -15 15 -35 0 -38 Z" fill="${color}"/><path d="M-16 -28 C-24 -14 -20 10 -10 14 C-6 8 -4 -8 -4 -22 C-8 -28 -12 -30 -16 -28 Z" fill="${color}" opacity="0.92"/><path d="M16 -28 C24 -14 20 10 10 14 C6 8 4 -8 4 -22 C8 -28 12 -30 16 -28 Z" fill="${color}" opacity="0.92"/></g></svg>`,
    lily: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 60)">${[0,60,120,180,240,300].map(a=>`<g transform="rotate(${a})"><path d="M0 -8 C-10 -28 -10 -48 0 -52 C10 -48 10 -28 0 -8 Z" fill="${color}" opacity="0.88" stroke="#C9A96E" strokeWidth="0.5"/></g>`).join('')}<circle r="5" fill="#C9A96E" opacity="0.6"/></g></svg>`,
    orchid: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 58)"><path d="M0 -40 C-14 -38 -20 -25 -16 -12 C-8 -18 -4 -18 0 -18 C4 -18 8 -18 16 -12 C20 -25 14 -38 0 -40 Z" fill="${color}"/><path d="M-30 -10 C-44 -8 -48 12 -34 22 C-28 12 -22 0 -18 -6 C-22 -12 -26 -12 -30 -10 Z" fill="${color}" opacity="0.9"/><path d="M30 -10 C44 -8 48 12 34 22 C28 12 22 0 18 -6 C22 -12 26 -12 30 -10 Z" fill="${color}" opacity="0.9"/><path d="M0 -10 C-10 -8 -12 6 -8 18 C-4 14 -2 8 0 4 C2 8 4 14 8 18 C12 6 10 -8 0 -10 Z" fill="#E0CB9E"/></g></svg>`,
    ranunculus: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 58)">${Array.from({length:5}).map((_,ring)=>{const count=5+ring*2;const radius=10+ring*8;return Array.from({length:count}).map((_,i)=>{const a=(i/count)*360+ring*15;const x=Math.cos(a*Math.PI/180)*radius;const y=Math.sin(a*Math.PI/180)*radius;return `<ellipse cx="${x}" cy="${y}" rx="${6-ring*0.6}" ry="${8-ring*0.8}" fill="${color}" opacity="${0.9-ring*0.05}" transform="rotate(${a} ${x} ${y})"/>`}).join('')}).join('')}<circle r="6" fill="#F0D0D8" opacity="0.9"/></g></svg>`,
    babysbreath: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 60)">${[{x:0,y:15,r:3},{x:-15,y:8,r:2.5},{x:15,y:10,r:2.8},{x:-8,y:3,r:2.2},{x:10,y:-2,r:2.5},{x:-20,y:-2,r:2.8},{x:20,y:-7,r:2.2},{x:-12,y:-12,r:2.5},{x:8,y:-15,r:2.8},{x:-5,y:-22,r:2.2},{x:15,y:-20,r:2.5},{x:0,y:-28,r:2.8}].map((f,i)=>`<circle cx="${f.x}" cy="${f.y}" r="${f.r}" fill="${color}" opacity="0.9"/>`).join('')}</g></svg>`,
    wildflower: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 58)">${[0,72,144,216,288].map(a=>`<g transform="rotate(${a})"><ellipse cx="0" cy="-22" rx="8" ry="14" fill="${color}" opacity="0.85"/></g>`).join('')}<circle r="7" fill="#E8D8B0" opacity="0.9"/></g></svg>`,
    leaf: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 60)"><path d="M0 -50 C-20 -40 -32 -15 -28 10 C-22 30 -8 45 0 48 C8 45 22 30 28 10 C32 -15 20 -40 0 -50 Z" fill="${color}" opacity="0.85"/></g></svg>`,
    stem: `<svg width="${size}" height="${size}" viewBox="0 0 120 120" style="overflow:visible"><g transform="translate(60 60)"><path d="M0 55 Q-3 30 0 5 Q3 -20 0 -45" stroke="${color}" strokeWidth="2.5" fill="none" opacity="0.7"/></g></svg>`,
  };
  return svgs[type] || svgs.rose;
}
