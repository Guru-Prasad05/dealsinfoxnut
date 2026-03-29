"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingMakhana({ x, delay }: { x: number; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 3);
    const pos = geo.attributes.position;
    const vec = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      vec.fromBufferAttribute(pos, i);
      const noise =
        1 +
        Math.sin(vec.x * 4 + delay) * 0.05 +
        Math.cos(vec.y * 6) * 0.04 +
        Math.sin(vec.z * 5 + vec.x * 2) * 0.06;
      vec.multiplyScalar(noise);
      pos.setXYZ(i, vec.x, vec.y, vec.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [delay]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + delay;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={[x, 0, 0]} scale={0.35}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#F5ECD7"
        roughness={0.8}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function FloatingDivider() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
    );
  }

  return (
    <div className="w-full h-24 relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={0.7} color="#FFF8E7" />
        <directionalLight position={[-2, -1, 2]} intensity={0.2} color="#D4AF37" />

        <FloatingMakhana x={-2} delay={0} />
        <FloatingMakhana x={-0.8} delay={1.5} />
        <FloatingMakhana x={0.5} delay={3} />
        <FloatingMakhana x={1.8} delay={4.5} />
        <FloatingMakhana x={3} delay={6} />
      </Canvas>

      {/* Gold gradient line underneath */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </div>
  );
}
