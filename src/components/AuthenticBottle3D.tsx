"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Product } from "@/data/products";

interface AuthenticBottle3DProps {
  product: Product;
  scrollProgress: number;
  reducedMotion?: boolean;
}

export const AuthenticBottle3D: React.FC<AuthenticBottle3DProps> = ({
  product,
  scrollProgress,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const currentRotY = useRef(0);
  const currentRotX = useRef(0);
  const currentRotZ = useRef(0);
  const currentScale = useRef(1);
  const currentPosY = useRef(0);
  const currentOpacity = useRef(1);
  const timeRef = useRef(0);

  // Load and cache texture
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!product.showcaseImage) return;
    let isCancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(product.showcaseImage, (tex) => {
      if (!isCancelled) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        setTexture(tex);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [product.showcaseImage]);

  // Curved plane geometry gives physical depth to the iconic square bottle
  const curvedGeometry = useMemo(() => {
    // Standard canvas is 800x1200 (aspect 0.667)
    // Three.js dimensions: width 2.9, height 4.35
    const geom = new THREE.PlaneGeometry(2.9, 4.35, 32, 32);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const normalizedX = x / 1.45; // -1 to +1
      // Gentle cylindrical curvature
      const zOffset = (1 - Math.cos(normalizedX * (Math.PI / 2))) * 0.16;
      pos.setZ(i, -zOffset);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 35 delicate floating golden/whiskey embers drifting in 3D space
  const { particleGeo, particleInitPos } = useMemo(() => {
    const count = 35;
    const posArr = new Float32Array(count * 3);
    const initPos: { x: number; y: number; z: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 5.5;
      const y = (Math.random() - 0.5) * 4.8;
      const z = (Math.random() - 0.5) * 2.5 - 0.2;
      posArr[i * 3 + 0] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;
      initPos.push({ x, y, z, speed: 0.2 + Math.random() * 0.35 });
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    return { particleGeo: geom, particleInitPos: initPos };
  }, []);

  // Frame update loop
  useFrame(({ pointer }, delta) => {
    if (!groupRef.current) return;

    if (reducedMotion) {
      groupRef.current.rotation.set(0, 0, 0);
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.scale.set(1, 1, 1);
      return;
    }

    timeRef.current += delta;
    const t = timeRef.current;
    // Gentle continuous levitation
    const levitate = Math.sin(t * 1.6) * 0.07;

    // Elegant 3D perspective tilt (keeps bottle facing forward, never spinning sideways)
    // Subtle luxury scroll tilt between -8° and +8°
    const scrollAngleY = (scrollProgress - 0.5) * 0.28;
    const scrollAngleX = Math.sin(scrollProgress * Math.PI) * 0.08 - 0.03;
    const scrollAngleZ = (scrollProgress - 0.5) * -0.03;

    // Interactive cursor parallax tilt in 3D perspective
    const mouseTiltY = pointer.x * 0.18;
    const mouseTiltX = -pointer.y * 0.12;

    const targetRotY = scrollAngleY + mouseTiltY;
    const targetRotX = scrollAngleX + mouseTiltX;
    const targetRotZ = scrollAngleZ;

    // Smooth entry and exit easing
    let targetScale = 1.0;
    let targetY = levitate;
    let targetOpacity = 1.0;

    if (scrollProgress < 0.12) {
      const enter = Math.max(0, scrollProgress / 0.12);
      targetScale = 0.92 + 0.08 * enter;
      targetY += (enter - 1) * 0.35;
      targetOpacity = enter;
    } else if (scrollProgress > 0.88) {
      const exit = Math.max(0, (scrollProgress - 0.88) / 0.12);
      targetScale = 1.0 + 0.06 * exit;
      targetY += exit * 0.35;
      targetOpacity = 1 - exit;
    }

    const lerpSpeed = Math.min(delta * 6.0, 1.0);
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, lerpSpeed);
    currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, targetRotX, lerpSpeed);
    currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, targetRotZ, lerpSpeed);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, lerpSpeed);
    currentPosY.current = THREE.MathUtils.lerp(currentPosY.current, targetY, lerpSpeed);
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, lerpSpeed);

    groupRef.current.rotation.set(currentRotX.current, currentRotY.current, currentRotZ.current);
    groupRef.current.position.set(0, currentPosY.current, 0);
    groupRef.current.scale.setScalar(currentScale.current);

    // Update material opacity
    if (meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = currentOpacity.current;
    }

    // Dynamic ground shadow response
    if (shadowRef.current) {
      const shadowScale = Math.max(0.2, (1 - currentPosY.current * 0.35) * currentOpacity.current);
      shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale);
      const shadowMat = shadowRef.current.material as THREE.MeshBasicMaterial;
      if (shadowMat) {
        shadowMat.opacity = 0.6 * currentOpacity.current;
      }
    }

    // Drift particles gently upward
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < particleInitPos.length; i++) {
        let curY = posAttr.getY(i);
        curY += delta * particleInitPos[i].speed * 0.3;
        if (curY > 2.8) curY = -2.5;
        posAttr.setY(i, curY);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* 3D Bottle Group */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {texture && (
          <mesh ref={meshRef} geometry={curvedGeometry} castShadow>
            <meshPhysicalMaterial
              map={texture}
              transparent={true}
              alphaTest={0.01}
              roughness={product.shape === "can" ? 0.25 : 0.12}
              metalness={product.shape === "can" ? 0.48 : 0.08}
              clearcoat={product.shape === "can" ? 0.6 : 0.95}
              clearcoatRoughness={0.05}
              reflectivity={product.shape === "can" ? 0.7 : 0.9}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* Floating Whiskey Embers drifting in 3D Space */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.055}
          color={product.accentColor}
          transparent={true}
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Realistic Floor Contact Shadow */}
      <mesh
        ref={shadowRef}
        position={[0, -2.4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.8, 1.1]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};
