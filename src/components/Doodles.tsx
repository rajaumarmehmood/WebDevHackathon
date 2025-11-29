'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.float-shape', {
        y: -20,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.3, from: 'random' },
      });
      gsap.to('.rotate-shape', {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
      gsap.to('.pulse-shape', {
        scale: 1.1,
        duration: 1.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Doodle circles */}
      <svg className="float-shape absolute top-[10%] left-[5%] w-16 h-16" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-700" strokeDasharray="8 4" />
      </svg>
      
      {/* Squiggle line */}
      <svg className="float-shape absolute top-[20%] right-[10%] w-24 h-12" viewBox="0 0 100 50">
        <path d="M0 25 Q25 0 50 25 T100 25" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-700" />
      </svg>

      {/* Star doodle */}
      <svg className="rotate-shape absolute top-[60%] left-[8%] w-12 h-12" viewBox="0 0 100 100">
        <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-700" />
      </svg>

      {/* Cross/Plus */}
      <svg className="pulse-shape absolute top-[15%] left-[40%] w-8 h-8" viewBox="0 0 100 100">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="3" className="text-neutral-300 dark:text-neutral-700" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3" className="text-neutral-300 dark:text-neutral-700" />
      </svg>

      {/* Dotted circle */}
      <svg className="float-shape absolute bottom-[20%] right-[15%] w-20 h-20" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="2 8" strokeLinecap="round" />
      </svg>

      {/* Arrow doodle */}
      <svg className="float-shape absolute top-[45%] right-[5%] w-16 h-16" viewBox="0 0 100 100">
        <path d="M20 80 L80 20 M60 20 L80 20 L80 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-700" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Spiral */}
      <svg className="rotate-shape absolute bottom-[30%] left-[20%] w-14 h-14" viewBox="0 0 100 100">
        <path d="M50 50 Q50 30 70 30 Q90 30 90 50 Q90 70 70 70 Q50 70 50 50 Q50 40 60 40 Q70 40 70 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-700" />
      </svg>

      {/* Triangle */}
      <svg className="pulse-shape absolute top-[70%] right-[30%] w-10 h-10" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-700" />
      </svg>

      {/* Wavy line */}
      <svg className="float-shape absolute bottom-[10%] left-[40%] w-32 h-8" viewBox="0 0 150 30">
        <path d="M0 15 Q20 0 40 15 T80 15 T120 15 T150 15" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-200 dark:text-neutral-800" />
      </svg>
    </div>
  );
}


export function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <svg className="w-full h-full">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="currentColor" className="text-neutral-400 dark:text-neutral-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export function AnimatedBlob({ className = '' }: { className?: string }) {
  const blobRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, {
        scale: 1.05,
        duration: 4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={blobRef} className={className} viewBox="0 0 200 200">
      <path
        fill="currentColor"
        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.8,66.6,40.5,74.3C27.2,82,11.6,86,-3.8,91.6C-19.2,97.2,-38.4,104.4,-52.8,97.8C-67.2,91.2,-76.8,70.8,-82.8,51.1C-88.8,31.4,-91.2,12.4,-89.1,-5.8C-87,-24,-80.4,-41.4,-69.5,-55.1C-58.6,-68.8,-43.4,-78.8,-27.8,-85C-12.2,-91.2,3.8,-93.6,19.4,-90.4C35,-87.2,50.2,-78.4,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function Cursor3D() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1 });
      gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed w-2 h-2 bg-black dark:bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block" />
      <div ref={followerRef} className="fixed w-10 h-10 border border-black dark:border-white rounded-full pointer-events-none z-[9998] mix-blend-difference hidden lg:block" />
    </>
  );
}

export function MarqueeText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="animate-marquee inline-flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-8">{text}</span>
        ))}
      </div>
    </div>
  );
}
