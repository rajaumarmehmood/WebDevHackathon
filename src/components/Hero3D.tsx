'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Group } from 'three';

gsap.registerPlugin(ScrollTrigger);

function Model() {
    // Load the GLTF model
    const { scene } = useGLTF('/cute_robot/scene.gltf');
    const modelRef = useRef<Group>(null);

    useEffect(() => {
        if (!modelRef.current) return;

        // Initial 360 spin on load
        gsap.fromTo(modelRef.current.rotation,
            { y: 0 },
            {
                y: Math.PI * 2,
                duration: 2.5,
                ease: "power3.out"
            }
        );

        // Scroll animation - fast spin
        // We create a timeline to control the rotation based on scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body", // Use body to track overall page scroll
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth scrubbing
            }
        });

        tl.to(modelRef.current.rotation, {
            y: Math.PI * 12, // 6 full rotations over the course of the page scroll
            ease: "none",
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={2.5}
            position={[0, -1, 0]}
        />
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                shadows
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                    <Float
                        speed={2}
                        rotationIntensity={0.5}
                        floatIntensity={0.5}
                    >
                        <Model />
                    </Float>

                    <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                    />

                    <OrbitControls
                        enablePan={true}
                        enableZoom={false}
                        enableRotate={true}
                        autoRotate={false}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Preload the model to avoid pop-in
useGLTF.preload('/cute_robot/scene.gltf');
