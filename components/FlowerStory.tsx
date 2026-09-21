'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlowerSVGs, FlowerType } from './flowers/FlowerSVGs';

gsap.registerPlugin(ScrollTrigger);

interface StoryFlower {
  name: string;
  feeling: string;
  type: FlowerType;
  color: string;
  size: number;
  description: string;
  bgColor: string;
}

const STORY_FLOWERS: StoryFlower[] = [
  {
    name: 'ROSE',
    feeling: 'Love',
    type: 'rose',
    color: '#C98291',
    size: 400,
    description: 'A love that burns slowly, petal by petal, until the whole heart opens.',
    bgColor: '#5A2633',
  },
  {
    name: 'PEONY',
    feeling: 'Joy',
    type: 'peony',
    color: '#E8B8C0',
    size: 420,
    description: 'Joy is generous. It fills every room with the softness of silk.',
    bgColor: '#8C5A6B',
  },
  {
    name: 'LILY',
    feeling: 'Grace',
    type: 'lily',
    color: '#EFE4D2',
    size: 380,
    description: 'Grace rises tall and unhurried, bending toward light without breaking.',
    bgColor: '#33483D',
  },
  {
    name: 'ORCHID',
    feeling: 'Mystery',
    type: 'orchid',
    color: '#C9A96E',
    size: 380,
    description: 'Mystery lives in stillness, in the spaces between what is said.',
    bgColor: '#3D2B14',
  },
];

export default function FlowerStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current;
    if (!section || !panels) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const flowers = panels.querySelectorAll('.story-flower');
    const texts = panels.querySelectorAll('.story-text');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${STORY_FLOWERS.length * 100}vh`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    STORY_FLOWERS.forEach((_, i) => {
      if (i === 0) {
        tl.fromTo(
          flowers[i],
          { y: 100, opacity: 0, scale: 0.5, filter: 'blur(20px)' },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1 / STORY_FLOWERS.length, ease: 'power3.out' },
          0
        );
        tl.fromTo(
          texts[i],
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 / STORY_FLOWERS.length, ease: 'power3.out' },
          0.1
        );
        return;
      }

      const segStart = i / STORY_FLOWERS.length;
      const segDur = 1 / STORY_FLOWERS.length;

      const exitX = i % 2 === 0 ? -200 : 200;
      const exitRot = i % 2 === 0 ? -20 : 20;

      tl.to(flowers[i - 1], {
        x: exitX, y: -100, rotation: exitRot, opacity: 0, scale: 0.4,
        filter: 'blur(15px)', duration: segDur * 0.5, ease: 'power2.in',
      }, segStart);

      tl.to(texts[i - 1], {
        opacity: 0, y: -40, filter: 'blur(8px)', duration: segDur * 0.3,
      }, segStart);

      tl.to(section, {
        backgroundColor: STORY_FLOWERS[i].bgColor,
        duration: segDur * 0.5, ease: 'power2.inOut',
      }, segStart);

      const enterX = i % 2 === 0 ? 200 : -200;
      const enterY = i % 3 === 0 ? -80 : 80;

      tl.fromTo(
        flowers[i],
        { x: enterX, y: enterY, opacity: 0, scale: 0.6, rotation: -exitRot, filter: 'blur(15px)' },
        { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: segDur * 0.6, ease: 'power3.out' },
        segStart + segDur * 0.3
      );

      tl.fromTo(
        texts[i],
        { x: -enterX * 0.3, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: segDur * 0.5, ease: 'power3.out' },
        segStart + segDur * 0.4
      );
    });

    const lastIdx = STORY_FLOWERS.length - 1;
    tl.to(flowers[lastIdx], {
      scale: 1.8, opacity: 0, filter: 'blur(20px)', duration: 0.1,
    }, 0.95);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: STORY_FLOWERS[0].bgColor, transition: 'background-color 0.3s' }}
    >
      <div ref={panelsRef} className="relative h-full w-full">
        {STORY_FLOWERS.map((f, i) => {
          const SVGComponent = FlowerSVGs[f.type];
          return (
            <div key={i} className="story-panel absolute inset-0 flex items-center justify-center">
              <div
                className="story-flower absolute flex items-center justify-center"
                style={{
                  width: f.size,
                  height: f.size,
                  opacity: i === 0 ? 1 : 0,
                  zIndex: 5,
                  willChange: 'transform, opacity, filter',
                }}
              >
                <SVGComponent size={f.size} color={f.color} />
              </div>

              <div
                className="story-text absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6 text-center"
                style={{ opacity: i === 0 ? 1 : 0, willChange: 'transform, opacity, filter' }}
              >
                <p className="font-mono-elegant text-[0.55rem] tracking-[0.5em] text-[#F7F1E8]/60 mb-4">
                  {String(i + 1).padStart(2, '0')} / {String(STORY_FLOWERS.length).padStart(2, '0')}
                </p>
                <h2 className="font-serif-display text-5xl sm:text-7xl md:text-9xl text-[#F7F1E8] leading-none mb-4">
                  {f.name}
                </h2>
                <p className="font-serif-display text-2xl sm:text-3xl md:text-4xl italic mb-6" style={{ color: f.color }}>
                  {f.feeling}
                </p>
                <p className="font-serif text-base sm:text-lg text-[#EFE4D2]/70 italic max-w-md leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <p className="font-mono-elegant text-[0.55rem] tracking-[0.5em] text-[#F7F1E8]/50">
          FLOWER STORIES
        </p>
      </div>
    </section>
  );
}
