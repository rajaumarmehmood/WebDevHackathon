'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsComplete(true);
                    // Unlock scroll
                    document.body.style.overflow = '';
                    if (onComplete) onComplete();
                },
            });

            // Counter Animation
            const counter = { value: 0 };

            tl.to(counter, {
                value: 100,
                duration: 2,
                ease: 'power2.inOut',
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = Math.round(counter.value).toString();
                    }
                },
            });

            // Fade out counter
            tl.to(counterRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
            });

            // Split screen or slide up animation
            tl.to(containerRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power3.inOut',
            });

        }, containerRef);

        return () => {
            ctx.revert();
            document.body.style.overflow = '';
        };
    }, []);

    if (isComplete) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900 text-white"
        >
            <div className="relative flex items-end overflow-hidden leading-none">
                <span
                    ref={counterRef}
                    className="text-[15vw] md:text-[12vw] font-bold tracking-tighter"
                >
                    0
                </span>
                <span className="text-2xl md:text-4xl font-light mb-4 md:mb-8 ml-2">%</span>
            </div>
        </div>
    );
}
