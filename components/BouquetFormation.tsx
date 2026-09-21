'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlowerSVGs, PetalSVG } from './flowers/FlowerSVGs';
import { generateBouquet, generatePetals, FlowerElement } from './flowers/flowerData';

gsap.registerPlugin(ScrollTrigger);

interface BouquetFormationProps {
  seed?: number;
  petalCount?: number;
}

export default function BouquetFormation({ seed = 42, petalCount = 60 }: BouquetFormationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const flowerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const petalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [exploded, setExploded] = useState(false);

  const flowers = useMemo(() => generateBouquet(seed), [seed]);
  const petals = useMemo(() => generatePetals(petalCount, seed + 1), [petalCount, seed]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set initial positions (scattered off-screen)
    flowers.forEach((flower, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      gsap.set(el, {
        x: flower.initialPosition.x,
        y: flower.initialPosition.y,
        rotation: flower.initialRotation,
        scale: flower.initialScale,
        opacity: 0,
        zIndex: Math.round(flower.depth * 100),
        filter: `blur(${(1 - flower.depth) * 2}px)`,
      });
    });

    // Set initial petal positions
    petals.forEach((petal, i) => {
      const el = petalRefs.current[i];
      if (!el) return;
      gsap.set(el, {
        x: petal.initialX,
        y: petal.initialY,
        rotation: petal.rotation,
        scale: petal.scale,
        opacity: 0,
        zIndex: Math.round(petal.depth * 50),
        filter: `blur(${(1 - petal.depth) * 1.5}px)`,
      });
    });

    if (prefersReduced) {
      flowers.forEach((flower, i) => {
        const el = flowerRefs.current[i];
        if (!el) return;
        gsap.set(el, {
          x: flower.finalPosition.x,
          y: flower.finalPosition.y,
          rotation: flower.finalRotation,
          scale: flower.finalScale,
          opacity: 1,
        });
      });
      petals.forEach((_, i) => {
        const el = petalRefs.current[i];
        if (!el) return;
        gsap.set(el, { x: 0, y: 0, opacity: 0.5 });
      });
      return;
    }

    // Main scroll-driven timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=3000',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animate each flower to its final position
    flowers.forEach((flower, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;

      const startTime = flower.delay;
      const dur = flower.duration;

      if (flower.curvePoint) {
        // Curved path using bezier-like motion (keyframes)
        tl.to(
          el,
          {
            x: flower.curvePoint.x,
            y: flower.curvePoint.y,
            rotation: (flower.initialRotation + flower.finalRotation) / 2,
            scale: (flower.initialScale + flower.finalScale) / 2,
            opacity: 0.6 + flower.depth * 0.3,
            duration: dur * 0.5,
            ease: 'none',
          },
          startTime
        );
        tl.to(
          el,
          {
            x: flower.finalPosition.x,
            y: flower.finalPosition.y,
            rotation: flower.finalRotation,
            scale: flower.finalScale,
            opacity: 1,
            duration: dur * 0.5,
            ease: flower.ease,
          },
          startTime + dur * 0.5
        );
      } else {
        tl.to(
          el,
          {
            x: flower.finalPosition.x,
            y: flower.finalPosition.y,
            rotation: flower.finalRotation,
            scale: flower.finalScale,
            opacity: 1,
            duration: dur,
            ease: flower.ease,
          },
          startTime
        );
      }
    });

    // Petals float in alongside
    petals.forEach((petal, i) => {
      const el = petalRefs.current[i];
      if (!el) return;
      tl.to(
        el,
        {
          x: petal.x,
          y: petal.y,
          opacity: 0.4 + petal.depth * 0.4,
          duration: 0.2,
          ease: 'sine.inOut',
        },
        petal.delay
      );
    });

    // After assembly — gentle continuous movement on flowers
    const settleTl = gsap.timeline({ scrollTrigger: {
      trigger: section,
      start: 'bottom bottom',
      toggleActions: 'play none none reverse',
    }});

    flowers.forEach((flower, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      // Gentle wobble after landing
      settleTl.to(el, {
        rotation: `+=${(Math.random() - 0.5) * 6}`,
        x: `+=${(Math.random() - 0.5) * 4}`,
        y: `+=${(Math.random() - 0.5) * 4}`,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }, i * 0.1);
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

    // Mouse interactivity — parallax depth on assembled bouquet
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    let mouseHandlers: (() => void) | null = null;

    if (!isCoarse) {
      const quickSetters = flowers.map((flower, i) => {
        const el = flowerRefs.current[i];
        if (!el) return null;
        return {
          el,
          depth: flower.depth,
          qx: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }),
          qy: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }),
          baseX: flower.finalPosition.x,
          baseY: flower.finalPosition.y,
        };
      });

      const onMove = (e: MouseEvent) => {
        const rect = stage.getBoundingClientRect();
        const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        quickSetters.forEach((qs) => {
          if (!qs) return;
          qs.qx(qs.baseX + nx * 30 * qs.depth);
          qs.qy(qs.baseY + ny * 20 * qs.depth);
        });
      };

      stage.addEventListener('mousemove', onMove);
      mouseHandlers = () => stage.removeEventListener('mousemove', onMove);
    }

    return () => {
      mouseHandlers?.();
      tl.scrollTrigger?.kill();
      tl.kill();
      settleTl.scrollTrigger?.kill();
      settleTl.kill();
      flowers.forEach((_, i) => {
        const el = flowerRefs.current[i];
        if (el) gsap.killTweensOf(el);
      });
      petals.forEach((_, i) => {
        const el = petalRefs.current[i];
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [flowers, petals, seed]);

  // Explosion effect
  const handleExplode = () => {
    if (exploded) return;
    setExploded(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // Reassemble after explosion
        reassemble();
      },
    });

    flowers.forEach((flower, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      const angle = (i / flowers.length) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 300 + Math.random() * 400;
      tl.to(
        el,
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          rotation: `+=${(Math.random() - 0.5) * 720}`,
          scale: flower.initialScale,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.8,
          ease: 'power2.in',
        },
        0
      );
    });

    // Scatter petals widely
    petals.forEach((_, i) => {
      const el = petalRefs.current[i];
      if (!el) return;
      tl.to(
        el,
        {
          x: (Math.random() - 0.5) * 800,
          y: (Math.random() - 0.5) * 800,
          rotation: `+=${Math.random() * 1080}`,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in',
        },
        0
      );
    });
  };

  const reassemble = () => {
    const tl = gsap.timeline({
      onComplete: () => setExploded(false),
    });

    flowers.forEach((flower, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      tl.fromTo(
        el,
        {
          x: flower.initialPosition.x * 0.5,
          y: flower.initialPosition.y * 0.5,
          rotation: flower.initialRotation,
          scale: flower.initialScale,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          x: flower.finalPosition.x,
          y: flower.finalPosition.y,
          rotation: flower.finalRotation,
          scale: flower.finalScale,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: flower.ease,
        },
        flower.delay * 1.5
      );
    });

    petals.forEach((petal, i) => {
      const el = petalRefs.current[i];
      if (!el) return;
      tl.to(
        el,
        {
          x: petal.x,
          y: petal.y,
          opacity: 0.4 + petal.depth * 0.4,
          duration: 1,
          ease: 'sine.inOut',
        },
        petal.delay * 1.5
      );
    });
  };

  // Hover interaction on individual flowers
  const handleFlowerHover = (i: number, entered: boolean) => {
    const el = flowerRefs.current[i];
    if (!el || exploded) return;
    const flower = flowers[i];

    if (entered) {
      gsap.to(el, {
        scale: flower.finalScale * 1.25,
        z: 50,
        filter: 'blur(0px) brightness(1.1)',
        duration: 0.4,
        ease: 'power3.out',
      });
      // Nearby flowers react
      flowers.forEach((f, j) => {
        if (j === i) return;
        const dx = f.finalPosition.x - flower.finalPosition.x;
        const dy = f.finalPosition.y - flower.finalPosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const nEl = flowerRefs.current[j];
          if (nEl) {
            gsap.to(nEl, {
              x: f.finalPosition.x + dx * 0.08,
              y: f.finalPosition.y + dy * 0.08,
              duration: 0.5,
              ease: 'power3.out',
            });
          }
        }
      });
    } else {
      gsap.to(el, {
        scale: flower.finalScale,
        filter: `blur(${(1 - flower.depth) * 2}px)`,
        duration: 0.5,
        ease: 'power3.out',
      });
      // Reset nearby
      flowers.forEach((f, j) => {
        if (j === i) return;
        const dx = f.finalPosition.x - flower.finalPosition.x;
        const dy = f.finalPosition.y - flower.finalPosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const nEl = flowerRefs.current[j];
          if (nEl) {
            gsap.to(nEl, {
              x: f.finalPosition.x,
              y: f.finalPosition.y,
              duration: 0.6,
              ease: 'power3.out',
            });
          }
        }
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="bouquet-formation"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #F7F1E8 0%, #EFE4D2 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 55%, rgba(201,169,110,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Stage where flowers live */}
      <div
        ref={stageRef}
        className="relative"
        style={{ width: 600, height: 500, maxWidth: '90vw', maxHeight: '70vh' }}
        onClick={handleExplode}
      >
        {/* Petals layer (behind) */}
        <div className="absolute inset-0 pointer-events-none">
          {petals.map((petal, i) => (
            <div
              key={petal.id}
              ref={(el) => { petalRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              <PetalSVG size={16 + petal.depth * 20} color={petal.color} />
            </div>
          ))}
        </div>

        {/* Flowers layer */}
        {flowers.map((flower, i) => {
          const SVGComponent = FlowerSVGs[flower.type];
          const size = 100 + flower.depth * 60;
          return (
            <div
              key={flower.id}
              ref={(el) => { flowerRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2 cursor-pointer"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                willChange: 'transform, opacity, filter',
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={() => handleFlowerHover(i, true)}
              onMouseLeave={() => handleFlowerHover(i, false)}
              data-hover
            >
              <SVGComponent size={size} color={flower.color} />
            </div>
          );
        })}

        {/* Vase at bottom */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ bottom: -40, width: 120, height: 160 }}
        >
          <svg viewBox="0 0 120 160" width="100%" height="100%">
            <defs>
              <linearGradient id="formation-vase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EFE4D2" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path
              d="M25 10 Q25 0 60 0 Q95 0 95 10 L85 60 Q100 75 100 110 Q100 150 60 150 Q20 150 20 110 Q20 75 35 60 Z"
              fill="url(#formation-vase)"
              stroke="#C9A96E"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Section label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="font-mono-elegant text-[0.55rem] tracking-[0.5em] text-burgundy/50">
          THE BOUQUET FORMS
        </p>
        <p className="font-serif text-sm text-burgundy/40 italic mt-2">
          scroll to build it — click to explode
        </p>
      </div>

      {/* Hint text at bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="font-serif-display text-lg text-burgundy/40 italic">
          {exploded ? 'reassembling...' : 'each flower, alive and independent'}
        </p>
      </div>
    </section>
  );
}
