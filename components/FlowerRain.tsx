'use client';

import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlowerSVGs, FlowerType } from './flowers/FlowerSVGs';

gsap.registerPlugin(ScrollTrigger);

interface FallingFlower {
  id: number;
  type: FlowerType;
  startX: number; // percent
  endX: number; // percent
  startY: number;
  endY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  drift: number;
  depth: number;
  duration: number;
  delay: number;
  color?: string;
}

const FLOWER_TYPES: FlowerType[] = ['rose', 'peony', 'tulip', 'orchid', 'lily', 'ranunculus', 'wildflower', 'babysbreath'];
const COLORS = ['#C98291', '#E8B8C0', '#D4A574', '#C9A96E', '#87977D', '#EFE4D2'];

function generateFallingFlowers(count: number, seed: number): FallingFlower[] {
  let s = seed;
  const sr = (min: number, max: number) => {
    s = (s * 9301 + 49297) % 233280;
    return min + (s / 233280) * (max - min);
  };

  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    type: FLOWER_TYPES[Math.floor(sr(0, FLOWER_TYPES.length))],
    startX: sr(-10, 110),
    endX: sr(35, 65),
    startY: -15 - sr(0, 30),
    endY: sr(60, 85),
    size: sr(40, 100),
    rotation: sr(0, 360),
    rotationSpeed: sr(-540, 540),
    drift: sr(-60, 60),
    depth: sr(0.2, 1),
    duration: sr(4, 9),
    delay: sr(0, 3),
    color: COLORS[Math.floor(sr(0, COLORS.length))],
  }));
}

export default function FlowerRain() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const flowers = useMemo(() => generateFallingFlowers(28, 77), []);
  const flowerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      flowerRefs.current.forEach((el, i) => {
        if (!el) return;
        const f = flowers[i];
        gsap.set(el, {
          left: `${f.endX}%`,
          top: `${f.endY}%`,
          rotation: 0,
          opacity: 0.7,
        });
      });
      return;
    }

    // Set initial positions (above screen)
    flowers.forEach((f, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      gsap.set(el, {
        left: `${f.startX}%`,
        top: `${f.startY}%`,
        x: 0,
        y: 0,
        rotation: f.rotation,
        scale: 0.4 + f.depth * 0.6,
        opacity: 0,
        zIndex: f.depth > 0.6 ? 15 : 5, // front flowers in front of text, back behind
        filter: `blur(${(1 - f.depth) * 1.5}px)`,
      });
    });

    // Scroll-triggered fall
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    flowers.forEach((f, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;

      // Drift sideways phase
      tl.to(
        el,
        {
          left: `${f.startX + f.drift * 0.3}%`,
          top: `${f.startY + 30}%`,
          rotation: f.rotation + f.rotationSpeed * 0.3,
          opacity: 0.5 + f.depth * 0.4,
          scale: 0.4 + f.depth * 0.6,
          duration: 0.3,
          ease: 'sine.inOut',
        },
        f.delay * 0.1
      );

      // Land near vase
      tl.to(
        el,
        {
          left: `${f.endX}%`,
          top: `${f.endY}%`,
          rotation: f.rotation + f.rotationSpeed,
          scale: 0.5 + f.depth * 0.5,
          opacity: 0.7 + f.depth * 0.3,
          duration: 0.5,
          ease: 'power1.in',
        },
        f.delay * 0.1 + 0.3
      );
    });

    // Text reveals
    const chars = textRef.current?.querySelectorAll('.rain-char');
    if (chars) {
      tl.fromTo(
        chars,
        { yPercent: 100, opacity: 0, filter: 'blur(10px)' },
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        },
        0
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [flowers]);

  const titleText = 'LET THEM FALL.';

  return (
    <section
      ref={sectionRef}
      id="flower-rain"
      className="relative h-[120vh] w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #EFE4D2 0%, #F7F1E8 40%, #EFE4D2 100%)' }}
    >
      {/* Falling flowers container */}
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        {flowers.map((f, i) => {
          const SVGComponent = FlowerSVGs[f.type];
          return (
            <div
              key={f.id}
              ref={(el) => { flowerRefs.current[i] = el; }}
              className="absolute"
              style={{
                width: f.size,
                height: f.size,
                marginLeft: -f.size / 2,
                marginTop: -f.size / 2,
                willChange: 'transform, opacity, left, top',
              }}
            >
              <SVGComponent size={f.size} color={f.color} />
            </div>
          );
        })}
      </div>

      {/* Central vase */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
        style={{ bottom: '5%', width: 140, height: 180 }}
      >
        <svg viewBox="0 0 140 180" width="100%" height="100%">
          <defs>
            <linearGradient id="rain-vase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EFE4D2" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            d="M30 15 Q30 5 70 5 Q110 5 110 15 L100 70 Q120 85 120 125 Q120 170 70 170 Q20 170 20 125 Q20 85 40 70 Z"
            fill="url(#rain-vase)"
            stroke="#C9A96E"
            strokeWidth="0.5"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Text overlay — flowers pass through it */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-20 pointer-events-none">
        <div ref={textRef} className="text-center px-6">
          <p className="font-mono-elegant text-[0.55rem] tracking-[0.5em] text-burgundy/50 mb-6">
            FLOWER RAIN
          </p>
          <h2 className="font-serif-display text-cream text-5xl sm:text-7xl md:text-9xl leading-[0.9]">
            <span className="inline-block overflow-hidden">
              {titleText.split('').map((c, i) => (
                <span key={i} className="rain-char inline-block">
                  {c === ' ' ? '\u00A0' : c}
                </span>
              ))}
            </span>
          </h2>
          <p className="font-serif text-lg text-burgundy/50 italic mt-8 max-w-md mx-auto">
            Flowers descend from above — tumbling, drifting, settling into place.
          </p>
        </div>
      </div>
    </section>
  );
}
