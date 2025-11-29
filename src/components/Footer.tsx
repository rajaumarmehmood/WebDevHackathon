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
        <footer ref={footerRef} className="bg-white dark:bg-black text-black dark:text-white pt-24 pb-12 px-6 lg:px-8 overflow-hidden relative border-t border-neutral-200 dark:border-neutral-800">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                    {/* Links Column */}
                    <div className="md:col-span-3 space-y-6">
                        {['About', 'Services', 'Pricing', 'Blog', 'Careers'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="footer-link block text-lg font-medium hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Newsletter Column */}
                    <div className="md:col-span-6">
                        <h3 className="text-2xl font-light mb-6">
                            Subscribe to our newsletter to get career tips, interview guides & more.
                        </h3>
                        <div className="relative max-w-md">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                className="w-full bg-transparent border-b border-black dark:border-white py-4 text-sm focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-400"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:translate-x-2 transition-transform">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-3 md:text-right">
                        <p className="text-sm text-neutral-500 mb-4">Follow us</p>
                        <div className="flex md:justify-end gap-4 mb-8">
                            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <a href="mailto:hello@careerai.com" className="block hover:underline">
                                hello@careerai.com
                            </a>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500">
                    <p>Made by CareerAI Team</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms & Conditions</a>
                    </div>
                </div>
            </div>

            {/* Large Background Text */}
            <h1
                ref={textRef}
                className="text-[15vw] leading-none font-bold text-center opacity-5 pointer-events-none absolute bottom-0 left-0 right-0 select-none bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800 bg-clip-text text-transparent"
            >
                CareerAI
            </h1>
        </footer>
    );
}
