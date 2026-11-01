"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/lib/hooks";

function Shapes() {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const on = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  useFrame((_, d) => {
    if (knot.current) {
      knot.current.rotation.x += d * 0.25;
      knot.current.rotation.y += d * 0.35;
    }
    if (group.current) {
      group.current.rotation.y += (mouse.current.x * 0.6 - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (-mouse.current.y * 0.4 - group.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.25, 0.38, 220, 28, 2, 3]} />
          <meshStandardMaterial color="#7c5cff" emissive="#2a1180" emissiveIntensity={0.8} roughness={0.25} metalness={0.5} />
        </mesh>
        <mesh scale={1.04}>
          <torusKnotGeometry args={[1.25, 0.38, 120, 14, 2, 3]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.22} />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.4} position={[-2.6, 2.1, -1]}>
        <mesh>
          <octahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial color="#22d3ee" wireframe />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.2} position={[2.5, -2, -0.5]}>
        <mesh>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#a3e635" emissive="#4d7c0f" emissiveIntensity={0.7} roughness={0.3} flatShading />
        </mesh>
      </Float>
      <Float speed={2.6} rotationIntensity={1.4} floatIntensity={1} position={[2.4, 2.6, -2]}>
        <mesh rotation={[1.1, 0.3, 0]}>
          <torusGeometry args={[0.55, 0.06, 12, 48]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.1} position={[-2.4, -2.4, -1.5]}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#3b1fa8" emissiveIntensity={0.6} roughness={0.2} metalness={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ShapesScene({ active }: { active: boolean }) {
  const mobile = useMediaQuery("(max-width: 767px)");
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? 1 : [1, 1.75]}
      camera={{ position: [0, 0, 9.5], fov: 48 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: mobile ? "low-power" : "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={80} color="#c4b5fd" />
      <pointLight position={[-5, -3, 4]} intensity={60} color="#22d3ee" />
      <Shapes />
      {!mobile && <Sparkles count={50} scale={[12, 8, 5]} size={2.2} speed={0.3} opacity={0.7} color="#a78bfa" />}
    </Canvas>
  );
}
