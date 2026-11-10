"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { BottleShape } from "@/data/products";

interface Bottle3DProps {
  shape: BottleShape;
  glassColor: string;
  labelTexture: THREE.CanvasTexture | null;
  rotation?: [number, number, number];
  accentColor?: string;
  scale?: number;
}

export const Bottle3D: React.FC<Bottle3DProps> = ({
  shape,
  glassColor,
  labelTexture,
  rotation = [0, 0, 0],
  accentColor = "#d4af37",
  scale = 1,
}) => {
  // Generate profiles for lathe geometries
  const { latheGeometry, labelGeometry, capGeometry, liquidGeometry, dims } = useMemo(() => {
    const V2 = THREE.Vector2;

    if (shape === "can") {
      // Dimensions for aluminum can
      const radius = 1.05;
      const height = 3.6;

      const canBodyGeo = new THREE.CylinderGeometry(radius, radius, height, 48, 1, false);
      const canLabelGeo = new THREE.CylinderGeometry(radius + 0.008, radius + 0.008, height * 0.72, 48, 1, true);
      const canRimGeo = new THREE.TorusGeometry(radius * 0.95, 0.06, 16, 48);

      return {
        latheGeometry: canBodyGeo,
        labelGeometry: canLabelGeo,
        capGeometry: canRimGeo,
        liquidGeometry: null,
        dims: { height, radius, bodyY: 0, labelY: 0, capY: height / 2 - 0.05 },
      };
    }

    // Wine Bottle profile
    if (shape === "wine") {
      const pts = [
        new V2(0.001, -2.4),
        new V2(0.85, -2.4),
        new V2(1.0, -2.25),
        new V2(1.02, -1.8),
        new V2(1.02, 0.5), // straight body
        new V2(0.98, 0.9), // shoulder begins
        new V2(0.75, 1.45),
        new V2(0.42, 1.95), // neck begins
        new V2(0.35, 2.5),
        new V2(0.38, 2.62), // lip ring
        new V2(0.35, 2.7),
        new V2(0.24, 2.7), // inside lip
        new V2(0.22, 2.5),
      ];

      const lathe = new THREE.LatheGeometry(pts, 48);
      const label = new THREE.CylinderGeometry(1.03, 1.03, 1.8, 48, 1, true);
      const cap = new THREE.CylinderGeometry(0.36, 0.38, 0.8, 32);
      const liquid = new THREE.CylinderGeometry(0.96, 0.96, 2.2, 32);

      return {
        latheGeometry: lathe,
        labelGeometry: label,
        capGeometry: cap,
        liquidGeometry: liquid,
        dims: { height: 5.1, radius: 1.02, bodyY: 0, labelY: -0.65, capY: 2.35, liquidY: -1.2 },
      };
    }

    // Spirit Bottle profile
    if (shape === "spirit") {
      const pts = [
        new V2(0.001, -2.2),
        new V2(0.95, -2.2),
        new V2(1.08, -2.1),
        new V2(1.1, -1.6),
        new V2(1.08, 0.3),
        new V2(1.02, 0.7),
        new V2(0.85, 1.15),
        new V2(0.48, 1.55),
        new V2(0.42, 2.2),
        new V2(0.46, 2.35),
        new V2(0.43, 2.45),
        new V2(0.28, 2.45),
      ];

      const lathe = new THREE.LatheGeometry(pts, 48);
      const label = new THREE.CylinderGeometry(1.11, 1.09, 1.6, 48, 1, true);
      const cap = new THREE.CylinderGeometry(0.46, 0.44, 0.65, 32);
      const liquid = new THREE.CylinderGeometry(1.02, 1.02, 2.0, 32);

      return {
        latheGeometry: lathe,
        labelGeometry: label,
        capGeometry: cap,
        liquidGeometry: liquid,
        dims: { height: 4.7, radius: 1.1, bodyY: 0, labelY: -0.6, capY: 2.15, liquidY: -1.1 },
      };
    }

    // Beer Bottle profile
    const pts = [
      new V2(0.001, -2.1),
      new V2(0.82, -2.1),
      new V2(0.94, -1.95),
      new V2(0.96, -0.4),
      new V2(0.88, 0.3),
      new V2(0.55, 1.1),
      new V2(0.36, 1.6),
      new V2(0.35, 2.1),
      new V2(0.39, 2.2),
      new V2(0.36, 2.28),
      new V2(0.24, 2.28),
    ];

    const lathe = new THREE.LatheGeometry(pts, 48);
    const label = new THREE.CylinderGeometry(0.97, 0.97, 1.3, 48, 1, true);
    const cap = new THREE.CylinderGeometry(0.4, 0.42, 0.18, 24);
    const liquid = new THREE.CylinderGeometry(0.9, 0.9, 1.7, 32);

    return {
      latheGeometry: lathe,
      labelGeometry: label,
      capGeometry: cap,
      liquidGeometry: liquid,
      dims: { height: 4.4, radius: 0.96, bodyY: 0, labelY: -0.85, capY: 2.22, liquidY: -1.2 },
    };
  }, [shape]);

  // Clean up geometries on unmount
  useEffect(() => {
    return () => {
      latheGeometry.dispose();
      labelGeometry.dispose();
      if (capGeometry) capGeometry.dispose();
      if (liquidGeometry) liquidGeometry.dispose();
    };
  }, [latheGeometry, labelGeometry, capGeometry, liquidGeometry]);

  const glassColorObj = useMemo(() => new THREE.Color(glassColor), [glassColor]);
  const accentColorObj = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  return (
    <group rotation={rotation} scale={scale} position={[0, 0, 0]}>
      {shape === "can" ? (
        // Metallic can body
        <>
          <mesh geometry={latheGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={glassColorObj}
              metalness={0.88}
              roughness={0.22}
              envMapIntensity={1.4}
            />
          </mesh>

          {/* Can top and bottom rims */}
          <mesh geometry={capGeometry} position={[0, dims.capY, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh
            geometry={capGeometry}
            position={[0, -dims.capY, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#b0b0b0" metalness={0.95} roughness={0.15} />
          </mesh>
        </>
      ) : (
        // Procedural Glass Bottle
        <>
          {/* Glass Outer Body */}
          <mesh geometry={latheGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={glassColorObj}
              transmission={0.92}
              opacity={1}
              transparent
              roughness={0.05}
              ior={1.52}
              thickness={1.4}
              clearcoat={1.0}
              clearcoatRoughness={0.03}
              reflectivity={0.9}
              envMapIntensity={1.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Inner Liquid Core */}
          {liquidGeometry && (
            <mesh geometry={liquidGeometry} position={[0, dims.liquidY || 0, 0]}>
              <meshStandardMaterial
                color={glassColorObj}
                roughness={0.3}
                metalness={0.05}
                transparent
                opacity={0.75}
              />
            </mesh>
          )}

          {/* Cap / Cork / Foil */}
          {capGeometry && (
            <mesh geometry={capGeometry} position={[0, dims.capY, 0]} castShadow>
              <meshStandardMaterial
                color={accentColorObj}
                metalness={0.7}
                roughness={0.25}
                envMapIntensity={1.2}
              />
            </mesh>
          )}
        </>
      )}

      {/* High-Resolution Printed Label */}
      {labelTexture && (
        <mesh
          geometry={labelGeometry}
          position={[0, dims.labelY, 0]}
          rotation={[0, Math.PI, 0]}
        >
          <meshStandardMaterial
            map={labelTexture}
            transparent
            roughness={0.4}
            metalness={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

