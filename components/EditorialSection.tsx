'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rose, Orchid, PetalSVG } from './flowers/FlowerSVGs';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['LET', 'FLOWERS', 'SPEAK.'];

export default function EditorialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const flower1Ref = useRef<HTMLDivElement>(null);
  const flower2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=2500',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    WORDS.forEach((_, wi) => {
      const word = wordRefs.current[wi];
      if (!word) return;
      const chars = word.querySelectorAll('.edit-char');

      // Different animation per word
      if (wi === 0) {
        // LET — clip reveal from left + slight rotation
        chars.forEach((c, i) => {
          tl.fromTo(
            c,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -40, filter: 'blur(15px)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: 0.1,
              ease: 'power3.out',
            },
            i * 0.05
          );
        });
      } else if (wi === 1) {
        // FLOWERS — scale from huge + char rotation + vertical movement
        tl.fromTo(
          chars,
          { scale: 3, opacity: 0, rotation: -45, filter: 'blur(20px)' },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            filter: 'blur(0px)',
            stagger: 0.08,
            ease: 'power4.out',
            duration: 0.2,
          },
          0.15
        );
        // Subtle drift
        tl.to(chars, { y: -10, stagger: 0.02, duration: 0.1, ease: 'sine.inOut' }, 0.5);
      } else {
        // SPEAK. — horizontal slide + blur, with the period as emphasis
        tl.fromTo(
          chars,
          { x: 100, opacity: 0, filter: 'blur(12px)' },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.06,
            ease: 'power3.out',
            duration: 0.12,
          },
          0.4
        );
        // Period scales dramatically
        const period = chars[chars.length - 1];
        if (period) {
          tl.to(period, { scale: 1.4, color: '#c98b86', duration: 0.1 }, 0.7);
        }
      }
    });

    // Flowers move in
    tl.fromTo(
      flower1Ref.current,
      { x: -200, opacity: 0, rotation: -15, scale: 0.5 },
      { x: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.3, ease: 'power3.out' },
      0.2
    );
    tl.fromTo(
      flower2Ref.current,
      { x: 200, opacity: 0, rotation: 15, scale: 0.5 },
      { x: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.3, ease: 'power3.out' },
      0.4
    );

    // Exit — everything disperses
    tl.to([flower1Ref.current, flower2Ref.current], {
      y: -80,
      opacity: 0,
      rotation: '+=20',
      duration: 0.15,
    }, 0.85);
    tl.to(wordRefs.current, {
      opacity: 0,
      y: -60,
      filter: 'blur(15px)',
      stagger: 0.05,
      duration: 0.1,
    }, 0.9);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: 'linear-gradient(170deg, hsl(348 40% 22%) 0%, hsl(348 52% 14%) 100%)' }}
    >
      {/* Flower images interacting with text */}
      <div
        ref={flower1Ref}
        className="absolute z-[2] hidden md:block"
        style={{
          top: '12%',
          left: '6%',
          width: 'min(22vh, 18vw)',
          height: 'min(22vh, 18vw)',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Rose size={220} color="#C98291" />
      </div>
      <div
        ref={flower2Ref}
        className="absolute z-[2] hidden md:block"
        style={{
          bottom: '10%',
          right: '7%',
          width: 'min(20vh, 16vw)',
          height: 'min(20vh, 16vw)',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Orchid size={200} color="#C9A96E" />
      </div>

      {/* Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[3] px-6">
        {WORDS.map((word, wi) => (
          <h2
            key={wi}
            ref={(el) => { wordRefs.current[wi] = el; }}
            className="font-serif-display text-cream leading-[0.85] text-center"
            style={{
              fontSize: wi === 1 ? 'clamp(4rem, 16vw, 16rem)' : 'clamp(3rem, 10vw, 10rem)',
              fontWeight: 300,
            }}
          >
            <span className="inline-block overflow-hidden">
              {word.split('').map((c, i) => (
                <span key={i} className="edit-char inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h2>
        ))}
      </div>

      {/* Subtitle */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[4] text-center px-6">
        <p className="font-serif text-cream/50 italic text-sm sm:text-base max-w-md">
          Words are roots. Petals are syllables. Listen.
        </p>
      </div>
    </section>
  );
}
