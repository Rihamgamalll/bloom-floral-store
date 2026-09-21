'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
    const xGlow = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3' });
    const yGlow = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3' });

    const move = (e: MouseEvent) => {
      xDot(e.clientX - 12);
      yDot(e.clientY - 12);
      xGlow(e.clientX - 150);
      yGlow(e.clientY - 150);
    };

    const enterHover = () =>
      gsap.to(dot, { scale: 2.2, duration: 0.3, ease: 'power2.out' });
    const leaveHover = () =>
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });

    window.addEventListener('mousemove', move);
    const hoverables = document.querySelectorAll(
      'a, button, [data-hover], .magnetic-btn'
    );
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', enterHover);
      el.addEventListener('mouseleave', leaveHover);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', enterHover);
        el.removeEventListener('mouseleave', leaveHover);
      });
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="flower-cursor-glow hidden md:block" />
      <div ref={dotRef} className="flower-cursor hidden md:block" />
    </>
  );
}
