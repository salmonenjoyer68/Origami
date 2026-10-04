"use client";

import React, { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  useGLTF,
  ContactShadows,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
  wireframe: boolean;
}

function Model({ url, wireframe }: ModelProps) {
  const { scene } = useGLTF(url);

  // Clone scene to safely apply wireframe without mutating cache
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const applyWireframe = (mat: THREE.Material): THREE.Material => {
      const m = mat.clone();
      if ("wireframe" in m) {
        (m as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
      return m;
    };

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(applyWireframe);
        } else if (mesh.material) {
          mesh.material = applyWireframe(mesh.material);
        }
      }
    });
    return clone;
  }, [scene, wireframe]);

  return <primitive object={clonedScene} />;
}

// Geometric placeholder shown before user generates their first 3D model
function PlaceholderMesh() {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh position={[0, 0.2, 0]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Visual 3D spinning loader during model generation
function LoaderIndicator() {
  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={0.5}>
      <mesh position={[0, 0.2, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export interface ModelViewerProps {
  modelUrl: string | null;
  isLoading: boolean;
  wireframe: boolean;
  autoRotate: boolean;
}

export default function ModelViewer({
  modelUrl,
  isLoading,
  wireframe,
  autoRotate,
}: ModelViewerProps) {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [3, 2, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.8} />
        <directionalLight position={[0, -10, 0]} intensity={0.4} />

        <Suspense fallback={<LoaderIndicator />}>
          {isLoading ? (
            <LoaderIndicator />
          ) : modelUrl ? (
            <Center top position={[0, -0.2, 0]}>
              <Model url={modelUrl} wireframe={wireframe} />
            </Center>
          ) : (
            <PlaceholderMesh />
          )}
        </Suspense>

        <gridHelper
          args={[10, 20, "#3f3f46", "#27272a"]}
          position={[0, -0.9, 0]}
        />
        <ContactShadows
          position={[0, -0.89, 0]}
          opacity={0.5}
          scale={8}
          blur={2}
          far={3}
        />

        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          minDistance={0.5}
          maxDistance={20}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
