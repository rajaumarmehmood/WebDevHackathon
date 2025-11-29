'use client';

import { useRef, useEffect } from 'react';
import { ArrowRight, Twitter, Github, Linkedin, Instagram } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hover animations for links
            const links = document.querySelectorAll('.footer-link');
            links.forEach((link) => {
                link.addEventListener('mouseenter', () => {
                    gsap.to(link, { x: 10, duration: 0.3, ease: 'power2.out' });
                });
                link.addEventListener('mouseleave', () => {
                    gsap.to(link, { x: 0, duration: 0.3, ease: 'power2.out' });
                });
            });


        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="bg-black text-white pt-24 pb-32 px-6 lg:px-8 overflow-hidden relative border-t border-neutral-800">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                    {/* Links Column */}
                    <div className="md:col-span-2 space-y-4">
                        {['About', 'Services', 'Pricing', 'Blog'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="footer-link block text-base text-neutral-400 hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Newsletter Column */}
                    <div className="md:col-span-6 md:px-8">
                        <h3 className="text-xl font-light mb-8 max-w-md">
                            Subscribe to our newsletter to get seasonal career tips, exclusive offers & more
                        </h3>
                        <div className="relative max-w-md">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                className="w-full bg-transparent border-b border-neutral-700 py-4 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-500 text-white"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-4 md:text-right flex flex-col items-start md:items-end">
                        <p className="text-sm text-neutral-500 mb-6">Follow us</p>

                        <div className="space-y-1 mb-8 text-sm text-neutral-400">
                            <a href="mailto:hello@careerai.com" className="block hover:text-white transition-colors">
                                hello@careerai.com
                            </a>
                            <p>+1 (555) 123-4567</p>
                        </div>

                        <div className="flex gap-3">
                            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Meta Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <p className="mb-4 md:mb-0">Made by <span className="text-white">Navigation Team</span></p>
                    <a href="#" className="mb-4 md:mb-0 hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                </div>
            </div>

            {/* Large Background Text */}
            <h1
                ref={textRef}
                className="text-[15vw] leading-[0.8] font-bold text-center pointer-events-none absolute bottom-[-2vw] left-0 right-0 select-none text-white opacity-30 tracking-tighter z-0"
            >
                Navigation
            </h1>
        </footer>
    );
}
