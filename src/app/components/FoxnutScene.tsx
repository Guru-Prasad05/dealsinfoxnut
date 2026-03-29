"use client";

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const HERO_MODEL = "/models/fox_nut.glb";
useGLTF.preload(HERO_MODEL);

// GLB foxnut instance — raw client GLB, no texture override
function GLBFoxnut() {
  const { scene } = useGLTF(HERO_MODEL);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

// Animated foxnut model using GLB
function FoxnutModel({ position, scale, speed, rotationOffset }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationOffset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed + rotationOffset;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.15;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <GLBFoxnut />
    </group>
  );
}

// Scroll-driven camera movement
function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    const scroll = scrollRef.current;
    // Subtle camera movement on scroll
    camera.position.y = 0.5 - scroll * 2;
    camera.position.z = 5 - scroll * 1.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Floating golden particles
function GoldParticles({ count = 40 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.3,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.4,
        p.position[2]
      );
      dummy.scale.setScalar(0.015 + Math.sin(t * 2 + p.offset) * 0.008);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#D4AF37"
        emissive="#D4AF37"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}

// Main 3D Scene — placed in hero or as floating element
export default function FoxnutScene({ className = "" }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (reducedMotion) return null;

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 45 }}
        dpr={[1, 1]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFF8E7" />
        <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#D4AF37" />

        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.3} />

          {/* Main hero foxnut — large, center */}
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <FoxnutModel position={[0, 0, 0]} scale={1.2} speed={0.4} rotationOffset={0} />
          </Float>

          {/* Smaller orbiting foxnuts */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
            <FoxnutModel position={[-2.5, 1, -1.5]} scale={0.5} speed={0.6} rotationOffset={1.5} />
          </Float>

          <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
            <FoxnutModel position={[2.8, -0.5, -1]} scale={0.45} speed={0.5} rotationOffset={3} />
          </Float>

          <Float speed={2.2} rotationIntensity={0.15} floatIntensity={0.7}>
            <FoxnutModel position={[1.5, 1.5, -2]} scale={0.35} speed={0.7} rotationOffset={4.5} />
          </Float>

          <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.4}>
            <FoxnutModel position={[-1.8, -1.2, -0.5]} scale={0.4} speed={0.55} rotationOffset={2.2} />
          </Float>

          {/* Gold particles */}
          <GoldParticles count={30} />

          <ScrollCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
