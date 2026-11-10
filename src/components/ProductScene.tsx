"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Product } from "@/data/products";
import { Bottle3D } from "./Bottle3D";
import { AuthenticBottle3D } from "./AuthenticBottle3D";
import { createLabelTexture } from "./LabelTexture";

interface ProductSceneProps {
  product: Product;
  scrollProgress: number; // 0..1 inside the active section/product
  reducedMotion?: boolean;
}

const SceneContent: React.FC<{
  product: Product;
  scrollProgress: number;
  reducedMotion: boolean;
}> = ({ product, scrollProgress, reducedMotion }) => {
  const currentRotY = useRef(0);
  const currentRotX = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  // Procedural Label Texture memoized for fallback procedural bottles
  const labelTexture = useMemo(() => {
    if (typeof window === "undefined" || product.showcaseImage) return null;
    return createLabelTexture(product);
  }, [product]);

  useEffect(() => {
    return () => {
      labelTexture?.dispose();
    };
  }, [labelTexture]);

  // Target Colors for dynamic lighting
  const targetKeyColor = useMemo(
    () => new THREE.Color("#ffffff").lerp(new THREE.Color(product.accentColor), 0.22),
    [product.accentColor]
  );
  const targetRimColor = useMemo(() => new THREE.Color(product.accentColor), [product.accentColor]);

  // Smooth dynamic light color lerping
  useFrame((_, delta) => {
    if (!product.showcaseImage) {
      if (reducedMotion) {
        if (groupRef.current) {
          groupRef.current.rotation.y = 0.35;
          groupRef.current.rotation.x = 0.05;
        }
      } else {
        const targetY = (scrollProgress - 0.5) * 0.45;
        const targetX = Math.sin(scrollProgress * Math.PI) * 0.08 - 0.03;
        const lerpSpeed = Math.min(delta * 5.5, 1);
        currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetY, lerpSpeed);
        currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, targetX, lerpSpeed);

        if (groupRef.current) {
          groupRef.current.rotation.y = currentRotY.current;
          groupRef.current.rotation.x = currentRotX.current;
        }
      }
    }

    if (keyLightRef.current) {
      keyLightRef.current.color.lerp(targetKeyColor, 0.08);
      const angle = (scrollProgress * Math.PI - Math.PI / 2) * 0.5 + Math.PI / 4;
      keyLightRef.current.position.x = Math.sin(angle) * 5;
      keyLightRef.current.position.z = Math.cos(angle) * 5;
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.lerp(targetRimColor, 0.08);
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />

      {/* Primary Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[3.5, 4.5, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Rim / Bottle Accent Light */}
      <directionalLight ref={rimLightRef} position={[-3.5, 2.5, -2.5]} intensity={2.0} />

      {/* Soft Fill Light */}
      <directionalLight position={[0, -2.5, 3]} intensity={0.3} color="#d4e4ff" />

      {/* Render Authentic Bottle when showcase cutout is available, else Procedural 3D */}
      {product.showcaseImage ? (
        <AuthenticBottle3D
          product={product}
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
        />
      ) : (
        <>
          <group ref={groupRef} position={[0, 0, 0]}>
            <Bottle3D
              shape={product.shape}
              glassColor={product.glassColor}
              labelTexture={labelTexture}
              accentColor={product.accentColor}
            />
          </group>

          {/* Floor Contact Shadow */}
          <ContactShadows
            position={[0, -2.55, 0]}
            opacity={0.7}
            scale={6}
            blur={2}
            far={3.5}
            color="#000000"
          />
        </>
      )}

      {/* Realistic Environment Reflections */}
      <Environment preset="city" />
    </>
  );
};

export const ProductScene: React.FC<ProductSceneProps> = ({
  product,
  scrollProgress,
  reducedMotion = false,
}) => {
  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0.15, 7.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        <SceneContent
          product={product}
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
};

export default ProductScene;
