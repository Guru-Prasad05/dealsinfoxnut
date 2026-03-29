"use client";

import {
  useRef,
  useMemo,
  useState,
  useEffect,
  Suspense,
  useCallback,
  Component,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";

// ─── Config ───────────────────────────────────────────────────────────────────
const MODEL_PATH = "/models/fox_nut.glb";
const COUNT = 10;
const FLOOR_Y = -0.5;
const START_Y_BASE = 5.8;

// Preload model so it's ready before foxnuts start dropping
useGLTF.preload(MODEL_PATH);

// ─── Error Boundary ───────────────────────────────────────────────────────────
class PhysicsErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

// ─── GLB Foxnut Mesh (raw client GLB, no texture override) ────────────────────
function GLBFoxnutMesh({
  hovered,
  scale = 0.85,
}: {
  hovered: boolean;
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if ("emissive" in mat) {
          mat.emissive.setHex(hovered ? 0xd4af37 : 0x000000);
          mat.emissiveIntensity = hovered ? 0.4 : 0;
          mat.needsUpdate = true;
        }
      }
    });
  }, [hovered, cloned]);

  return <primitive object={cloned} scale={scale} />;
}

// ─── Single Interactive Physics Foxnut ───────────────────────────────────────
function PhysicsFoxnut({
  position,
  rotation,
  onFall,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  onFall: (x: number, y: number, baseScale?: number) => void;
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [hovered, setHovered] = useState(false);
  const clickedRef = useRef(false);
  const { camera, gl } = useThree();

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (clickedRef.current || !rigidBodyRef.current) return;
      clickedRef.current = true;

      // Project 3D world position → viewport coords
      const t = rigidBodyRef.current.translation();
      const worldPos = new THREE.Vector3(t.x, t.y, t.z);
      const ndcPos = worldPos.clone().project(camera);
      const rect = gl.domElement.getBoundingClientRect();
      const vx = rect.left + ((ndcPos.x + 1) / 2) * rect.width;
      const vy = rect.top + ((-ndcPos.y + 1) / 2) * rect.height;

      document.body.style.cursor = "auto";

      // Spawn a cluster of foxnuts that covers almost the full width,
      // so the fall visually spreads over the whole page.
      // Delegate cluster timing/staggering to the parent
      onFall(vx, vy);
    },
    [camera, gl, onFall]
  );

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={rotation}
      colliders="ball"
      restitution={0.7}
      friction={0.5}
      linearDamping={0.08}
      angularDamping={0.15}
    >
      <group
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <GLBFoxnutMesh hovered={hovered} />
      </group>
    </RigidBody>
  );
}

// ─── Stable foxnut layout data (computed once at module level) ────────────────
const FOXNUT_DATA = Array.from({ length: COUNT }, (_, i) => ({
  position: [
    (i - (COUNT - 1) / 2) * 1.4 + Math.sin(i * 1.7) * 0.4,
    START_Y_BASE + i * 0.4 + Math.sin(i * 2.3) * 0.25,
    Math.sin(i * 1.1) * 0.8,
  ] as [number, number, number],
  rotation: [
    Math.sin(i * 0.9) * Math.PI,
    i * 0.7,
    Math.cos(i * 1.3) * Math.PI,
  ] as [number, number, number],
}));

// ─── Physics World ────────────────────────────────────────────────────────────
function PhysicsWorld({
  active,
  onFall,
}: {
  active: boolean;
  onFall: (x: number, y: number, baseScale?: number) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = Array.from({ length: COUNT }, (_, i) =>
      setTimeout(() => setVisibleCount(i + 1), i * 120 + 80)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <Physics gravity={[0, -9.8, 0]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#FFF8E7" />
      <directionalLight position={[-4, 2, 4]} intensity={0.45} color="#D4AF37" />

      {FOXNUT_DATA.slice(0, visibleCount).map((f, i) => (
        <PhysicsFoxnut key={i} {...f} onFall={onFall} />
      ))}

      {/* Floor — foxnuts land here */}
      <CuboidCollider position={[0, FLOOR_Y, 0]} args={[30, 0.25, 6]} />
      {/* Walls keep foxnuts from flying sideways */}
      <CuboidCollider position={[10, 0, 0]} args={[0.25, 20, 6]} />
      <CuboidCollider position={[-10, 0, 0]} args={[0.25, 20, 6]} />
    </Physics>
  );
}

// ─── Falling GLB Foxnut (position:fixed mini-Canvas with actual GLB) ─────────
function FallingGLBFoxnut({
  startX,
  startY,
  targetX,
  targetY,
  baseScale = 1,
  onDone,
}: {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  baseScale?: number;
  onDone: () => void;
}) {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [scale, setScale] = useState(1);
  const doneTimerRef = useRef<number | null>(null);

  function Spinner() {
    const spinRef = useRef<THREE.Group>(null);
    useFrame((state) => {
      if (!spinRef.current) return;
      const t = state.clock.elapsedTime;
      spinRef.current.rotation.y = t * 2.2;
      spinRef.current.rotation.x = Math.sin(t * 1.6) * 0.35;
      spinRef.current.rotation.z = Math.cos(t * 1.1) * 0.2;
    });

    return (
      <group ref={spinRef}>
        <Suspense fallback={null}>
          <GLBFoxnutMesh hovered={false} scale={1.25} />
        </Suspense>
      </group>
    );
  }

  useEffect(() => {
    const duration = 4200;
    const startTime = performance.now();

    const FALL_SIZE = 420;

    // Fall from slightly above the viewport to the bottom edge,
    // where the *bottom of the element* meets the viewport bottom.
    const startYViewport = -window.innerHeight * 0.08;
    const bottomTouchY = window.innerHeight - (FALL_SIZE * baseScale) / 2;
    const offscreenY = window.innerHeight + (FALL_SIZE * baseScale) / 2 + 48;

     // Simple ease-out-bounce for vertical motion
    const easeOutBounce = (t: number) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        t -= 1.5 / d1;
        return n1 * t * t + 0.75;
      } else if (t < 2.5 / d1) {
        t -= 2.25 / d1;
        return n1 * t * t + 0.9375;
      } else {
        t -= 2.625 / d1;
        return n1 * t * t + 0.984375;
      }
    };

    let frame: number;
    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // Horizontal: smooth but simple ease-in-out
      const easeX = t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t; // easeInOutQuad (smooth horizontal drift)
      // Vertical: bounce near the bottom
      const easeY = easeOutBounce(t);

      // After it bounces at the bottom, let it continue falling *below* the screen
      // and scale down slightly before vanishing.
      const exitStart = 0.9;
      const exitT = t < exitStart ? 0 : Math.min(1, (t - exitStart) / (1 - exitStart));
      const exitEase = exitT * exitT; // ease-in for the final drop
      const s = 1 - 0.55 * exitT;

      // Interpolate horizontally from startX → targetX so the cluster
      // can spread across the page while still falling top-to-bottom.
      const x = startX + (targetX - startX) * easeX;
      const yPre = startYViewport + (bottomTouchY - startYViewport) * easeY;
      const y = yPre + (offscreenY - bottomTouchY) * exitEase;

      setPos({
        x,
        y,
      });
      setScale(s);
      if (t < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        onDone();
      }
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
    };
  }, [startX, startY, targetX, targetY, onDone]);

  return (
    <div
      className="foxnut-fall-glb"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 420,
        height: 420,
        zIndex: 9999,
        pointerEvents: "none",
        transform: `translate(-50%, -50%) scale(${baseScale * scale})`,
        transformOrigin: "center",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 1]}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 8, 4]} intensity={1.4} />
        <Spinner />
      </Canvas>
    </div>
  );
}

// ─── Hint Label ───────────────────────────────────────────────────────────────
function HintLabel({
  visible,
  textColor,
}: {
  visible: boolean;
  textColor: string;
}) {
  if (!visible) return null;
  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ opacity: 0.4 }}
    >
      <p
        className="text-[10px] font-body uppercase tracking-[0.25em]"
        style={{ color: textColor }}
      >
        click foxnuts to play
      </p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ScrollPhysicsFoxnuts({
  fromColor,
  toColor,
  targetSelector,
}: {
  fromColor: string;
  toColor: string;
  targetSelector?: string;
}) {
  const [active, setActive] = useState(false);
  const [settled, setSettled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const scrollScheduledRef = useRef(false);
  const activeSpawnXRef = useRef<number[]>([]);
  const [fallenItems, setFallenItems] = useState<
    {
      id: number;
      startX: number;
      startY: number;
      targetX: number;
      targetY: number;
      baseScale: number;
    }[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addFallingFoxnut = useCallback(
    (x: number, y: number, baseScale = 1) => {
      const id = Date.now() + Math.random();

      // Lightweight "collision" at spawn time: nudge away from nearby spawns
      // so they don't overlap and look like they collide/fall apart.
      let spawnX = x;
      const minDist = 46 + 26 * baseScale;
      for (const otherX of activeSpawnXRef.current.slice(-20)) {
        const dx = spawnX - otherX;
        if (Math.abs(dx) < minDist) {
          spawnX += (dx >= 0 ? 1 : -1) * (minDist - Math.abs(dx));
        }
      }
      spawnX = Math.max(24, Math.min(window.innerWidth - 24, spawnX));
      activeSpawnXRef.current.push(spawnX);

      // Keep each foxnut's horizontal motion local (no convergence).
      const drift = (Math.random() - 0.5) * (window.innerWidth * 0.18);
      const targetX = spawnX + drift;
      const targetY = window.innerHeight * 0.9;

      // Schedule scroll once per cluster.
      if (targetSelector && !scrollScheduledRef.current) {
        const el = document.querySelector<HTMLElement>(targetSelector);
        if (el) {
          const targetTop = el.offsetTop;
          const currentTop = window.scrollY;
          if (targetTop > currentTop + 40) {
            scrollScheduledRef.current = true;
            window.setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 500);
          }
        }
      }

      setFallenItems((prev) => {
        const next = [
          ...prev,
          { id, startX: spawnX, startY: y, targetX, targetY, baseScale },
        ];
        // Cap the number of active falling foxnuts to avoid GPU overload
        return next.slice(-10);
      });
    },
    [targetSelector]
  );

  const startCluster = useCallback(
    (y: number) => {
      if (isFalling) return;
      setIsFalling(true);
      scrollScheduledRef.current = false;
      activeSpawnXRef.current = [];

      const bigCount = 3;
      const smallCount = 6;

      // Big foxnuts first (heavier feel)
      for (let i = 0; i < bigCount; i++) {
        const delay = 120 * i;
        window.setTimeout(() => {
          const startX = window.innerWidth * (0.1 + 0.8 * Math.random());
          const jitterY = (Math.random() - 0.5) * 14;
          addFallingFoxnut(startX, y + jitterY, 1.0 + Math.random() * 0.15);
        }, delay);
      }

      // Smaller ones sprinkle in after
      for (let i = 0; i < smallCount; i++) {
        const delay = 260 + 90 * i;
        window.setTimeout(() => {
          const startX = window.innerWidth * (0.05 + 0.9 * Math.random());
          const jitterY = (Math.random() - 0.5) * 26;
          addFallingFoxnut(startX, y + jitterY, 0.45 + Math.random() * 0.35);
        }, delay);
      }
    },
    [addFallingFoxnut, isFalling]
  );

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          setTimeout(() => setSettled(true), COUNT * 120 + 2000);
        }
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isFromDark =
    fromColor === "#1E3A34" ||
    fromColor === "#0F2219" ||
    fromColor === "#0A1A10";
  const hintColor = "#D4AF37";

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{
        height: "420px",
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
        isolation: "isolate",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {!reducedMotion && (
        <PhysicsErrorBoundary
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-full h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #D4AF37, transparent)",
                }}
              />
            </div>
          }
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
            }}
          >
            <Canvas
              camera={{ position: [0, -2.5, 9], fov: 45 }}
              dpr={[1, 1]}
              gl={{ alpha: true, antialias: false }}
              style={{
                background: "transparent",
                width: "100%",
                height: "100%",
              }}
            >
              <Suspense fallback={null}>
                <PhysicsWorld active={active} onFall={startCluster} />
              </Suspense>
            </Canvas>
          </div>
        </PhysicsErrorBoundary>
      )}

      {/* Hint above canvas */}
      <div style={{ position: "relative", zIndex: 30 }}>
        <HintLabel visible={settled} textColor={hintColor} />
      </div>

      {/* Falling GLB foxnuts — animated towards the next section */}
      {fallenItems.map((item) => (
        <FallingGLBFoxnut
          key={item.id}
          startX={item.startX}
          startY={item.startY}
          targetX={item.targetX}
          targetY={item.targetY}
          baseScale={item.baseScale}
          onDone={() =>
            setFallenItems((prev) => {
              const remaining = prev.filter((i) => i.id !== item.id);
              if (remaining.length === 0) {
                setIsFalling(false);
              }
              return remaining;
            })
          }
        />
      ))}
    </div>
  );
}
