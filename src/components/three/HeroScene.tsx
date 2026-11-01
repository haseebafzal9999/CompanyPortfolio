"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/lib/hooks";

type Vec3 = [number, number, number];

function useMouse() {
  const m = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      m.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      m.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return m;
}

/** The glowing "Prime Core": distorted energy sphere + wire shell + inner crystal. */
function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((_, d) => {
    if (shell.current) {
      shell.current.rotation.y += d * 0.15;
      shell.current.rotation.x += d * 0.08;
    }
    if (inner.current) {
      inner.current.rotation.y -= d * 0.45;
      inner.current.rotation.z += d * 0.25;
    }
  });

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.35, 8]} />
        <MeshDistortMaterial
          color="#7c5cff"
          emissive="#4c1d95"
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.2}
          distort={0.34}
          speed={1.8}
          transparent
          opacity={0.94}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.95, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshBasicMaterial color="#a3e635" wireframe transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

interface RingNode {
  label: string;
  angle: number;
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  nodes,
  showLabels,
}: {
  radius: number;
  tilt: Vec3;
  speed: number;
  color: string;
  nodes: RingNode[];
  showLabels: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (spin.current) spin.current.rotation.z += d * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[radius, 0.012, 8, 160]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} />
        </mesh>
        {nodes.map((n) => (
          <group key={n.label} position={[Math.cos(n.angle) * radius, Math.sin(n.angle) * radius, 0]}>
            <mesh>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.16} />
            </mesh>
            {showLabels && (
              <Html center distanceFactor={9} position={[0, 0.55, 0]} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
                <div className="whitespace-nowrap rounded-md border border-white/15 bg-black/60 px-2 py-1 font-mono text-[9px] font-semibold tracking-[0.16em] text-white backdrop-blur-md">
                  {n.label}
                </div>
              </Html>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 7 + Math.random() * 18;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      a[i * 3 + 2] = r * Math.cos(ph);
    }
    return a;
  }, [count]);

  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.015;
      ref.current.rotation.x += d * 0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#b9c2ff" transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** Positions the core on the right (desktop) or top (mobile) and adds mouse parallax. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useMouse();
  const { viewport, size } = useThree();
  const wide = size.width >= 1024;
  const targetX = wide ? viewport.width * 0.21 : 0;
  const targetY = wide ? 0 : viewport.height * 0.24;
  const scale = wide ? 0.88 : Math.min(0.95, Math.max(0.4, viewport.width / 9.4));

  useFrame(({ camera }) => {
    camera.position.x += (mouse.current.x * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.9 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    if (group.current) {
      group.current.position.x += (targetX - group.current.position.x) * 0.1;
      group.current.position.y += (targetY - group.current.position.y) * 0.1;
      group.current.rotation.y += (mouse.current.x * 0.25 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-mouse.current.y * 0.18 - group.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  );
}

export default function HeroScene({ active }: { active: boolean }) {
  const mobile = useMediaQuery("(max-width: 767px)");

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? 1 : [1, 2]}
      camera={{ position: [0, 0, 11], fov: 50 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: mobile ? "low-power" : "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[6, 5, 7]} intensity={260} color="#c4b5fd" />
      <pointLight position={[-6, -4, 6]} intensity={200} color="#22d3ee" />
      <pointLight position={[0, 0, 4]} intensity={60} color="#8b5cf6" />

      <Rig>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <Core />
        </Float>
        <OrbitRing
          radius={2.7}
          tilt={[1.2, 0.2, 0]}
          speed={0.35}
          color="#22d3ee"
          showLabels={!mobile}
          nodes={[
            { label: "VOICE", angle: 0.3 },
            { label: "SMS", angle: Math.PI + 0.3 },
          ]}
        />
        <OrbitRing
          radius={3.3}
          tilt={[0.5, -0.7, 0.3]}
          speed={-0.25}
          color="#8b5cf6"
          showLabels={!mobile}
          nodes={[
            { label: "AI AGENTS", angle: 1.0 },
            { label: "CRM", angle: 4.1 },
          ]}
        />
        <OrbitRing
          radius={3.9}
          tilt={[1.6, 0.6, 0.1]}
          speed={0.18}
          color="#a3e635"
          showLabels={!mobile}
          nodes={[
            { label: "WORKFLOWS", angle: 2.2 },
            { label: "PAYMENTS", angle: 5.3 },
          ]}
        />
      </Rig>

      <Stars count={mobile ? 500 : 1400} />
      {!mobile && <Sparkles count={70} scale={[14, 9, 6]} size={2.5} speed={0.35} opacity={0.8} color="#67e8f9" />}
    </Canvas>
  );
}
