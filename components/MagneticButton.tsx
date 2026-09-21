'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.4,
  onClick,
  as = 'button',
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
    const inner = el.firstElementChild;
    if (inner) {
      gsap.to(inner, {
        x: x * strength * 0.3,
        y: y * strength * 0.3,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const inner = el.firstElementChild;
    if (inner) {
      gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    }
  };

  if (as === 'a') {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`magnetic-btn ${className}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onClick}
        data-hover
      >
        <span className="inline-flex items-center justify-center">{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={`magnetic-btn ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      data-hover
    >
      <span className="inline-flex items-center justify-center">{children}</span>
    </button>
  );
}
