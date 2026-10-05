"use client";

import React, { useMemo, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  useGLTF,
  ContactShadows,
  Float,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

export type LightingMode = "studio" | "contrast" | "rim" | "clay";

export interface ModelViewerProps {
  modelUrl: string | null;
  isLoading: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  lightingMode: LightingMode;
  cameraPreset?: "iso" | "front" | "top" | null;
  /** Increment to re-apply the same camera preset (e.g. after the user orbits away). */
  cameraNonce?: number;
  onCaptureRef?: React.MutableRefObject<(() => string | null) | null>;
}

interface ModelProps {
  url: string;
  wireframe: boolean;
  lightingMode: LightingMode;
}

function Model({ url, wireframe, lightingMode }: ModelProps) {
  const { scene } = useGLTF(url);

  // Apply wireframe and clay shaders without mutating cache
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    const transformMaterial = (mat: THREE.Material): THREE.Material => {
      const m = mat.clone();
      if ("wireframe" in m) {
        (m as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
      if (lightingMode === "clay") {
        return new THREE.MeshStandardMaterial({
          color: "#a1a1aa",
          roughness: 0.6,
          metalness: 0.1,
          wireframe,
        });
      }
      return m;
    };

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(transformMaterial);
        } else if (mesh.material) {
          mesh.material = transformMaterial(mesh.material);
        }
      }
    });
    return clone;
  }, [scene, wireframe, lightingMode]);

  return <primitive object={clonedScene} />;
}

// Lighting Rig Component based on selected mode (monochrome: all-white key/fill/rim)
function StudioLighting({ mode }: { mode: LightingMode }) {
  if (mode === "contrast") {
    return (
      <>
        <ambientLight intensity={0.15} color="#ffffff" />
        <directionalLight position={[6, 8, 4]} intensity={3.0} color="#ffffff" />
        <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, -2, 0]} intensity={0.6} color="#ffffff" />
      </>
    );
  }

  if (mode === "rim") {
    return (
      <>
        <ambientLight intensity={0.35} color="#ffffff" />
        <directionalLight position={[8, 12, -6]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-6, 6, 6]} intensity={0.5} color="#ffffff" />
      </>
    );
  }

  // Default "studio" & "clay" modes
  return (
    <>
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight position={[10, 15, 10]} intensity={2.0} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.9} />
      <directionalLight position={[0, -10, 0]} intensity={0.3} />
    </>
  );
}

// Interactive Camera Controller for snap views
function CameraHandler({
  cameraPreset,
  cameraNonce,
  controlsRef,
}: {
  cameraPreset?: "iso" | "front" | "top" | null;
  cameraNonce?: number;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!cameraPreset || !controlsRef.current) return;
    const ctrl = controlsRef.current;

    if (cameraPreset === "iso") {
      camera.position.set(3, 2, 4);
    } else if (cameraPreset === "front") {
      camera.position.set(0, 0, 5);
    } else if (cameraPreset === "top") {
      camera.position.set(0, 5.5, 0.001);
    }
    camera.lookAt(0, 0, 0);
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  }, [cameraPreset, cameraNonce, camera, controlsRef]);

  return null;
}

// Helper to expose WebGL canvas snapshot capture
function SnapshotBridge({
  onCaptureRef,
}: {
  onCaptureRef?: React.MutableRefObject<(() => string | null) | null>;
}) {
  const { gl } = useThree();

  useEffect(() => {
    if (onCaptureRef) {
      onCaptureRef.current = () => {
        try {
          return gl.domElement.toDataURL("image/png");
        } catch {
          return null;
        }
      };
    }
  }, [gl, onCaptureRef]);

  return null;
}

// 3D Placeholder Mesh with origami aesthetic
function PlaceholderMesh() {
  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh position={[0, 0.1, 0]}>
        <octahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#71717a"
          wireframe
          transparent
          opacity={0.65}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

// 3D Visual Loader
function LoaderIndicator() {
  return (
    <Float speed={5} rotationIntensity={2.5} floatIntensity={0.6}>
      <mesh position={[0, 0.1, 0]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#71717a"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export default function ModelViewer({
  modelUrl,
  isLoading,
  wireframe,
  autoRotate,
  lightingMode,
  cameraPreset,
  cameraNonce,
  onCaptureRef,
}: ModelViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [3, 2, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <StudioLighting mode={lightingMode} />

        <CameraHandler cameraPreset={cameraPreset} cameraNonce={cameraNonce} controlsRef={controlsRef} />
        <SnapshotBridge onCaptureRef={onCaptureRef} />

        <Suspense fallback={<LoaderIndicator />}>
          {isLoading ? (
            <LoaderIndicator />
          ) : modelUrl ? (
            <Center top position={[0, -0.2, 0]}>
              <Model
                url={modelUrl}
                wireframe={wireframe}
                lightingMode={lightingMode}
              />
            </Center>
          ) : (
            <PlaceholderMesh />
          )}
        </Suspense>

        <gridHelper
          args={[10, 20, "#a1a1aa", "#71717a"]}
          position={[0, -0.9, 0]}
        />
        <ContactShadows
          position={[0, -0.89, 0]}
          opacity={0.6}
          scale={8}
          blur={2.5}
          far={3}
          color="#000000"
        />

        <OrbitControls
          ref={controlsRef}
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
