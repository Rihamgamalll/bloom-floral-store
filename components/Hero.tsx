'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './SmoothScroll';
import { FlowerSVGs, FlowerType, PetalSVG } from './flowers/FlowerSVGs';
import { generatePetals } from './flowers/flowerData';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export interface HeroHandle {
  scrollToNext: () => void;
}

interface HeroFlowerConfig {
  type: FlowerType;
  x: number; // percent position
  y: number;
  size: number;
  rotation: number;
  depth: number;
  color: string;
  floatAmp: number;
  floatDur: number;
  enterDelay: number;
}

const HERO_FLOWERS: HeroFlowerConfig[] = [
  { type: 'rose', x: 50, y: 52, size: 280, rotation: 0, depth: 0.9, color: '#C98291', floatAmp: 12, floatDur: 7, enterDelay: 0.2 },
  { type: 'peony', x: 22, y: 35, size: 160, rotation: -10, depth: 0.65, color: '#E8B8C0', floatAmp: 18, floatDur: 6, enterDelay: 0.4 },
  { type: 'orchid', x: 78, y: 30, size: 140, rotation: 15, depth: 0.55, color: '#C9A96E', floatAmp: 20, floatDur: 8, enterDelay: 0.5 },
  { type: 'ranunculus', x: 18, y: 68, size: 110, rotation: 8, depth: 0.45, color: '#E8B8C0', floatAmp: 15, floatDur: 5.5, enterDelay: 0.6 },
  { type: 'wildflower', x: 82, y: 65, size: 90, rotation: -12, depth: 0.5, color: '#C9A96E', floatAmp: 22, floatDur: 6.5, enterDelay: 0.7 },
  { type: 'babysbreath', x: 35, y: 22, size: 100, rotation: 5, depth: 0.4, color: '#F7F1E8', floatAmp: 25, floatDur: 7.5, enterDelay: 0.8 },
  { type: 'leaf', x: 65, y: 72, size: 100, rotation: -25, depth: 0.35, color: '#87977D', floatAmp: 14, floatDur: 6, enterDelay: 0.9 },
  { type: 'tulip', x: 68, y: 18, size: 95, rotation: 20, depth: 0.5, color: '#D4A574', floatAmp: 18, floatDur: 7, enterDelay: 1.0 },
];

const Hero = forwardRef<HeroHandle>((_, ref) => {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const flowerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const petalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const petals = useMemo(() => generatePetals(30, 200), []);

  useImperativeHandle(ref, () => ({
    scrollToNext: () => {
      const lenis = getLenis();
      const next = document.getElementById('bouquet-formation');
      if (lenis && next) lenis.scrollTo(next, { duration: 2.2, offset: 0 });
      else next?.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  useEffect(() => {
    const root_ = root.current;
    if (!root_) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    // Set initial positions (scattered off-screen)
    HERO_FLOWERS.forEach((config, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      const startAngle = (i / HERO_FLOWERS.length) * Math.PI * 2;
      const startDist = 600 + Math.random() * 300;
      gsap.set(el, {
        x: Math.cos(startAngle) * startDist,
        y: Math.sin(startAngle) * startDist,
        rotation: config.rotation + (Math.random() - 0.5) * 180,
        scale: 0.2,
        opacity: 0,
        zIndex: Math.round(config.depth * 100),
        filter: `blur(${(1 - config.depth) * 3}px)`,
      });
    });

    // Set petal initial positions
    petals.forEach((petal, i) => {
      const el = petalRefs.current[i];
      if (!el) return;
      gsap.set(el, {
        x: petal.initialX,
        y: petal.initialY,
        rotation: petal.rotation,
        scale: petal.scale * 0.5,
        opacity: 0,
        zIndex: Math.round(petal.depth * 40),
        filter: `blur(${(1 - petal.depth) * 1.5}px)`,
      });
    });

    let entranceTl: gsap.core.Timeline | null = null;
    let scrollFade: gsap.core.Tween | null = null;
    let onMove: ((e: MouseEvent) => void) | null = null;

    // Entrance animation
    if (!prefersReduced) {
      const timeline = gsap.timeline({ delay: 0.3 });
      entranceTl = timeline;

      // Title chars
      const chars = titleRef.current?.querySelectorAll('.hero-char');
      if (chars) {
        gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90 });
        timeline.to(chars, {
          yPercent: 0, opacity: 1, rotateX: 0,
          duration: 1.4, stagger: 0.12, ease: 'power4.out',
        });
      }

      gsap.set(subRef.current, { opacity: 0, y: 30 });
      timeline.to(subRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6');
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      timeline.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

      // Flowers fly in to their positions
      HERO_FLOWERS.forEach((config, i) => {
        const el = flowerRefs.current[i];
        if (!el) return;
        timeline.to(el, {
          x: 0, y: 0,
          rotation: config.rotation,
          scale: 1,
          opacity: 0.7 + config.depth * 0.3,
          filter: `blur(${(1 - config.depth) * 1}px)`,
          duration: 1.5,
          ease: 'back.out(1.3)',
        }, config.enterDelay);
      });

      // Petals drift in
      petals.forEach((petal, i) => {
        const el = petalRefs.current[i];
        if (!el) return;
        timeline.to(el, {
          x: petal.x,
          y: petal.y,
          scale: petal.scale,
          opacity: 0.3 + petal.depth * 0.4,
          duration: 2,
          ease: 'sine.inOut',
        }, petal.delay);
      });

      // Continuous floating
      HERO_FLOWERS.forEach((config, i) => {
        const el = flowerRefs.current[i];
        if (!el) return;
        gsap.to(el, {
          y: `+=${config.floatAmp}`,
          x: `+=${config.floatAmp * 0.5}`,
          rotation: `+=${(Math.random() - 0.5) * 8}`,
          duration: config.floatDur,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: config.enterDelay + 1.5,
        });
      });

      // Petal floating loops
      petals.forEach((petal, i) => {
        const el = petalRefs.current[i];
        if (!el) return;
        gsap.to(el, {
          x: `+=${(Math.random() - 0.5) * petal.floatAmp}`,
          y: `+=${(Math.random() - 0.5) * petal.floatAmp}`,
          rotation: `+=${petal.rotationSpeed * 180}`,
          duration: petal.floatDuration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        });
      });

      // Mouse parallax
      if (!isCoarse) {
        const quickSetters = HERO_FLOWERS.map((config, i) => {
          const el = flowerRefs.current[i];
          if (!el) return null;
          return {
            qx: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
            qy: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
            depth: config.depth,
          };
        });
        const petalSetters = petals.map((p, i) => {
          const el = petalRefs.current[i];
          if (!el) return null;
          return {
            qx: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }),
            qy: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }),
            depth: p.depth,
            baseX: p.x,
            baseY: p.y,
          };
        });

        onMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          quickSetters.forEach((qs) => {
            if (!qs) return;
            qs.qx(nx * 40 * qs.depth);
            qs.qy(ny * 30 * qs.depth);
          });
          petalSetters.forEach((ps) => {
            if (!ps) return;
            ps.qx(ps.baseX + nx * 80 * ps.depth);
            ps.qy(ps.baseY + ny * 60 * ps.depth);
          });
        };
        window.addEventListener('mousemove', onMove);
      }
    }

    // Scroll fade out
    scrollFade = gsap.to(root_, {
      opacity: 0, scale: 1.06, filter: 'blur(6px)',
      ease: 'none',
      scrollTrigger: { trigger: root_, start: 'top top', end: 'bottom top', scrub: 1 },
    });

    return () => {
      if (onMove) window.removeEventListener('mousemove', onMove);
      entranceTl?.kill();
      scrollFade?.scrollTrigger?.kill();
      scrollFade?.kill();
      [...flowerRefs.current, ...petalRefs.current].forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [petals]);

  const handleExplore = () => {
    const lenis = getLenis();
    const next = document.getElementById('bouquet-formation');
    if (lenis && next) lenis.scrollTo(next, { duration: 2.4, offset: 0 });
    else next?.scrollIntoView({ behavior: 'smooth' });

    if (overlayRef.current) {
      gsap.timeline()
        .set(overlayRef.current, { opacity: 0, pointerEvents: 'none' })
        .to(overlayRef.current, { opacity: 1, duration: 0.5, ease: 'power2.in' })
        .to(overlayRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
  };

  const bloomChars = 'BLOOM'.split('');

  return (
    <section ref={root} id="hero" className="relative h-screen w-full overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 50%, #5A2633 0%, #3D1A22 60%, #2A1118 100%)' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(201,169,110,0.08) 0%, transparent 65%)' }} />

      {/* Flower stage */}
      <div ref={stageRef} className="absolute inset-0">
        {/* Petals (behind) */}
        <div className="absolute inset-0 pointer-events-none">
          {petals.map((petal, i) => (
            <div key={petal.id} ref={(el) => { petalRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2" style={{ willChange: 'transform, opacity, filter' }}>
              <PetalSVG size={12 + petal.depth * 16} color={petal.color} />
            </div>
          ))}
        </div>

        {/* Flowers */}
        {HERO_FLOWERS.map((config, i) => {
          const SVGComponent = FlowerSVGs[config.type];
          return (
            <div key={i} ref={(el) => { flowerRefs.current[i] = el; }}
              className="absolute"
              style={{
                left: `${config.x}%`,
                top: `${config.y}%`,
                width: config.size,
                height: config.size,
                marginLeft: -config.size / 2,
                marginTop: -config.size / 2,
                willChange: 'transform, opacity, filter',
                transformStyle: 'preserve-3d',
              }}>
              <SVGComponent size={config.size} color={config.color} />
            </div>
          );
        })}
      </div>

      {/* Text */}
      <div className="relative z-[10] flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-mono-elegant text-[0.65rem] sm:text-xs tracking-[0.5em] text-[#EFE4D2]/70 mb-6 sm:mb-8">
          AN INTERACTIVE FLORAL EXPERIENCE
        </p>
        <h1 ref={titleRef} className="font-serif-display text-[5.5rem] sm:text-[9rem] md:text-[12rem] lg:text-[15rem] leading-[0.85] text-[#F7F1E8]" style={{ perspective: '800px' }}>
          <span className="inline-block overflow-hidden">
            {bloomChars.map((c, i) => (
              <span key={i} className="hero-char inline-block" style={{ transformStyle: 'preserve-3d' }}>{c}</span>
            ))}
          </span>
        </h1>
        <p ref={subRef} className="font-serif text-xl sm:text-2xl md:text-3xl text-[#EFE4D2]/80 mt-4 sm:mt-6 italic max-w-md text-balance">
          Flowers, but make them unforgettable.
        </p>
        <div ref={ctaRef} className="mt-10 sm:mt-14">
          <MagneticButton onClick={handleExplore} className="group relative overflow-hidden border border-[#EFE4D2]/30 px-8 py-4 rounded-full" strength={0.5}>
            <span className="font-mono-elegant text-xs tracking-[0.3em] text-[#F7F1E8] relative z-10">EXPLORE THE BLOOM</span>
            <span className="absolute inset-0 bg-[#C98291]/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2">
        <span className="font-mono-elegant text-[0.55rem] tracking-[0.4em] text-[#EFE4D2]/50">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#EFE4D2]/50 to-transparent" />
      </div>

      {/* Cinematic transition overlay */}
      <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-[50] bg-[#F7F1E8]" style={{ opacity: 0 }} />
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
