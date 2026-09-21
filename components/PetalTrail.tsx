'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Petal {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  life: number;
}

const PETAL_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C7 6 4 11 4 15c0 4 3 7 8 7s8-3 8-7c0-4-3-9-8-13z' fill='%23d4a5a0' opacity='0.7'/%3E%3C/svg%3E`;

export default function PetalTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    const petals: Petal[] = [];
    let lastX = 0;
    let lastY = 0;
    let lastSpawn = 0;
    const MAX_PETALS = 28;

    const spawn = (x: number, y: number) => {
      if (petals.length >= MAX_PETALS) {
        const old = petals.shift();
        if (old) old.el.remove();
      }
      const el = document.createElement('div');
      el.className = 'petal-trail';
      el.style.width = `${10 + Math.random() * 14}px`;
      el.style.height = `${10 + Math.random() * 14}px`;
      el.style.backgroundImage = `url("${PETAL_SVG}")`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.opacity = '0';
      container.appendChild(el);

      gsap.set(el, { x, y, rotation: Math.random() * 360, opacity: 0 });

      const petal: Petal = {
        el,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.3 + Math.random() * 0.8,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 4,
        life: 0,
      };
      petals.push(petal);

      gsap.to(el, { opacity: 0.6, duration: 0.3 });
    };

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const now = performance.now();
      if (dist > 25 && now - lastSpawn > 40) {
        spawn(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        lastSpawn = now;
      }
    };

    let raf = 0;
    const tick = () => {
      petals.forEach((p, i) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.rot += p.vr;
        const fade = Math.max(0, 1 - p.life / 120);
        gsap.set(p.el, {
          x: p.x,
          y: p.y,
          rotation: p.rot,
          opacity: fade * 0.5,
        });
        if (p.life > 120) {
          p.el.remove();
          petals.splice(i, 1);
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      petals.forEach((p) => p.el.remove());
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none" />;
}
