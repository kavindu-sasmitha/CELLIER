"use client";

import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Product, HERO_PARADE_PRODUCTS } from "@/data/products";

// Individual Carousel Bottle Component
interface CarouselBottleProps {
  product: Product;
  index: number;
  total: number;
  currentAngleRef: React.MutableRefObject<number>;
  targetIndex: number;
  isPausedAtFront: boolean;
  onSelect: (product: Product) => void;
  onClickBottle: (index: number) => void;
}

const CarouselBottle: React.FC<CarouselBottleProps> = ({
  product,
  index,
  total,
  currentAngleRef,
  targetIndex,
  isPausedAtFront,
  onSelect,
  onClickBottle,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const reflectionRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture
  useEffect(() => {
    const src = product.showcaseImage || product.image;
    if (!src) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(src, (tex) => {
      if (!cancelled) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        setTexture(tex);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product.showcaseImage, product.image]);

  // Geometry dimensions
  const { width, height } = useMemo(() => {
    if (product.shape === "can") return { width: 1.55, height: 2.5 };
    if (product.shape === "beerBottle") return { width: 1.5, height: 2.7 };
    return { width: 1.7, height: 2.85 };
  }, [product.shape]);

  // Physical cylindrical curvature
  const curvedGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(width, height, 24, 24);
    const pos = geom.attributes.position;
    const halfW = width / 2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const normX = x / halfW;
      const zOffset = (1 - Math.cos(normX * (Math.PI / 2))) * 0.12;
      pos.setZ(i, -zOffset);
    }
    geom.computeVertexNormals();
    return geom;
  }, [width, height]);

  // 3D Frame Loop
  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();
    const currentAngle = currentAngleRef.current;

    // Relative distance in product units from front center (0 = front center)
    const diff = index - currentAngle;
    const normDiff = ((((diff % total) + total + total / 2) % total) - total / 2);
    const theta = (normDiff / total) * Math.PI * 2;

    // How close this bottle is to the front center (0 = far away, 1 = exactly in spotlight)
    const distFromFront = Math.abs(normDiff);
    // Smooth proximity curve spanning ~1.3 bottles on either side
    const proximity = Math.max(0, 1 - distFromFront / 1.35);
    // Sine-eased swoop factor for buttery acceleration & deceleration
    const swoopFactor = Math.sin(proximity * (Math.PI / 2));

    // Base carousel ellipse
    const radiusX = 5.2; // Width spread
    const radiusZ = 2.0; // Base ellipse depth

    const posX = Math.sin(theta) * radiusX;

    // DRAMATIC FORWARD SWOOP ANIMATION:
    // As the bottle approaches the front, it surges forward toward the camera by up to +1.8 units!
    const baseZ = Math.cos(theta) * radiusZ;
    const forwardSurge = swoopFactor * 1.85;
    const posZ = baseZ + forwardSurge; // Front bottle reaches Z ~ 3.85!

    const isAtFront = distFromFront < 0.25;

    // Levitation: gentle breathing levitation when at front
    const levitate = isAtFront
      ? Math.sin(t * 2.2) * 0.08
      : Math.sin(t * 1.6 + index * 0.8) * 0.04;

    // Elevation: lifts up onto the spotlight stage as it comes forward
    const targetY = -0.42 + swoopFactor * 0.16 + levitate;

    // ROTATIONAL ANIMATION WHILE COMING FORWARD ("karakena gaman"):
    // 1. Y-axis Rotation: Turns by up to ~55° as it glides in from the side,
    //    straightening smoothly to 0° face-forward as it reaches the center spotlight!
    const rotationWhileEntering = -normDiff * 0.95 * Math.min(1, 1.2 - swoopFactor * 0.4);

    // 2. Interactive mouse parallax when at front center
    const mouseTiltX = isAtFront ? -pointer.y * 0.09 : 0;
    const mouseTiltY = isAtFront ? pointer.x * 0.12 : 0;

    const rotY = rotationWhileEntering + mouseTiltY;

    // 3. Dynamic banking/pitch: slight forward pitch & bank as it swoops in
    const rotX = -0.06 * swoopFactor + mouseTiltX;
    const rotZ = -normDiff * 0.07 * swoopFactor + Math.sin(t * 1.5 + index) * 0.015;

    // SCALE ANIMATION: Expands from 0.68x in the background to 1.26x front & center!
    const scale = THREE.MathUtils.lerp(0.68, 1.26, swoopFactor);

    groupRef.current.position.set(posX, targetY, posZ);
    groupRef.current.rotation.set(rotX, rotY, rotZ);
    groupRef.current.scale.setScalar(scale);

    // Dynamic Floor Mirror Reflection underneath
    if (reflectionRef.current) {
      const floorY = -1.9;
      const distToFloor = targetY - floorY;
      const reflY = floorY - distToFloor * 0.85;

      reflectionRef.current.position.set(posX, reflY, posZ);
      reflectionRef.current.rotation.set(-rotX, rotY, -rotZ);
      reflectionRef.current.scale.set(scale, -scale, scale);

      // Reflection opacity peaks dramatically under the studio spotlight
      const reflMesh = reflectionRef.current.children[0] as THREE.Mesh;
      if (reflMesh && reflMesh.material) {
        const mat = reflMesh.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(0.04, 0.38, swoopFactor);
      }
    }

    // Floor Contact Shadow underneath tracking forward position
    if (shadowRef.current) {
      shadowRef.current.position.set(posX, -1.89, posZ);
      const shadowScale = scale * 1.08;
      shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale);
      const shadowMat = shadowRef.current.material as THREE.MeshBasicMaterial;
      shadowMat.opacity = THREE.MathUtils.lerp(0.12, 0.75, swoopFactor);
    }
  });

  if (!texture) return null;

  return (
    <>
      {/* Main 3D Bottle Mesh */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          if (index === targetIndex) {
            onSelect(product);
          } else {
            onClickBottle(index);
          }
        }}
        cursor="pointer"
      >
        <mesh geometry={curvedGeometry} castShadow>
          <meshPhysicalMaterial
            map={texture}
            transparent={true}
            alphaTest={0.01}
            roughness={product.shape === "can" ? 0.28 : 0.12}
            metalness={product.shape === "can" ? 0.45 : 0.08}
            clearcoat={product.shape === "can" ? 0.6 : 0.95}
            clearcoatRoughness={0.04}
            reflectivity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Realistic Floor Mirror Reflection */}
      <group ref={reflectionRef}>
        <mesh geometry={curvedGeometry}>
          <meshBasicMaterial
            map={texture}
            transparent={true}
            opacity={0.2}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Soft Ground Contact Shadow */}
      <mesh
        ref={shadowRef}
        position={[0, -1.89, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.8, 0.7]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

// Floating Amber Sparks in the Studio Light Beam
const StudioEmbers: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { geo, speeds } = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const spd: number[] = [];
    for (let i = 0; i < count; i++) {
      // Concentrated around front center [0, 0, 2.8] where the studio spotlight is
      pos[i * 3 + 0] = (Math.random() - 0.5) * 4.5;
      pos[i * 3 + 1] = Math.random() * 4.5 - 1.8;
      pos[i * 3 + 2] = 2.8 + (Math.random() - 0.5) * 3.5;
      spd.push(0.12 + Math.random() * 0.28);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo: g, speeds: spd };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < speeds.length; i++) {
      let y = pos.getY(i);
      y += delta * speeds[i];
      if (y > 3.0) y = -1.8;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.065}
        color="#facc15"
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Main 3D Carousel Scene
const CarouselScene: React.FC<{
  currentAngleRef: React.MutableRefObject<number>;
  targetIndex: number;
  isPausedAtFront: boolean;
  onSelect: (product: Product) => void;
  onClickBottle: (index: number) => void;
  frontProduct: Product;
}> = ({
  currentAngleRef,
  targetIndex,
  isPausedAtFront,
  onSelect,
  onClickBottle,
  frontProduct,
}) => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const targetObjectRef = useRef<THREE.Object3D>(null);

  const products = HERO_PARADE_PRODUCTS;

  // Studio light target at front center [0, -0.35, 2.8]
  useEffect(() => {
    if (spotLightRef.current && targetObjectRef.current) {
      spotLightRef.current.target = targetObjectRef.current;
    }
  }, []);

  return (
    <>
      <ambientLight intensity={0.35} />

      {/* Target for the Studio Light directly at front bottle */}
      <object3D ref={targetObjectRef} position={[0, -0.35, 3.85]} />

      {/* PRIMARY STUDIO LIGHT - Shining directly from above onto the front bottle */}
      <spotLight
        ref={spotLightRef}
        position={[0, 6.4, 3.85]}
        intensity={4.2}
        angle={Math.PI / 4.0}
        penumbra={0.65}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Front Soft Fill Light */}
      <directionalLight position={[0, 2.5, 7.5]} intensity={1.1} color="#ffffff" />

      {/* Subtle Rim Lights matching front bottle accent color */}
      <directionalLight
        position={[-4.5, 3, 2]}
        intensity={1.4}
        color={frontProduct.accentColor || "#d4af37"}
      />
      <directionalLight
        position={[4.5, 3, 2]}
        intensity={1.4}
        color={frontProduct.accentColor || "#d4af37"}
      />

      {/* Revolving Carousel Bottles */}
      {products.map((p, idx) => (
        <CarouselBottle
          key={p.id}
          product={p}
          index={idx}
          total={products.length}
          currentAngleRef={currentAngleRef}
          targetIndex={targetIndex}
          isPausedAtFront={isPausedAtFront}
          onSelect={onSelect}
          onClickBottle={onClickBottle}
        />
      ))}

      {/* Polished Dark Stage Floor */}
      <mesh position={[0, -1.91, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 16]} />
        <meshStandardMaterial
          color="#050505"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Studio Spotlight Pool on the Floor directly beneath front bottle */}
      <mesh position={[0, -1.9, 3.85]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4, 36]} />
        <meshBasicMaterial
          color="#fef3c7"
          transparent={true}
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Golden Floor Ring */}
      <mesh position={[0, -1.895, 3.85]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.4, 36]} />
        <meshBasicMaterial
          color="#d4af37"
          transparent={true}
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sparkling Light Dust Particles */}
      <StudioEmbers />
    </>
  );
};

export const HeroParade3D: React.FC = () => {
  const products = HERO_PARADE_PRODUCTS;
  const total = products.length;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [dwellProgress, setDwellProgress] = useState<number>(0); // 0 to 1 during 2s pause
  const [isPausedAtFront, setIsPausedAtFront] = useState<boolean>(true);

  // Smooth angle reference used directly by Three.js frame loop
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);

  // Step Timing configuration:
  // 2.0 seconds pause at the front center for each bottle
  // 1.2 seconds smooth rotation transition to the next bottle
  const PAUSE_DURATION = 2000; // ms
  const TRANSITION_DURATION = 1200; // ms

  // Master Timing Controller: Auto-advances through all bottles with 2-second dwell
  useEffect(() => {
    if (!isPlaying) return;

    let dwellTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    // Start 2-second showcase dwell
    setIsPausedAtFront(true);
    const dwellStart = Date.now();

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - dwellStart;
      setDwellProgress(Math.min(elapsed / PAUSE_DURATION, 1));
    }, 30);

    dwellTimer = setTimeout(() => {
      // 2 seconds completed: advance to next bottle
      clearInterval(progressInterval);
      setDwellProgress(1);
      setIsPausedAtFront(false);

      setCurrentIndex((prev) => {
        const next = (prev + 1) % total;
        targetAngleRef.current += 1;
        return next;
      });
    }, PAUSE_DURATION);

    return () => {
      clearTimeout(dwellTimer);
      clearInterval(progressInterval);
    };
  }, [currentIndex, isPlaying, total]);

  // Smooth lerp frame loop for currentAngleRef
  useEffect(() => {
    let animId: number;

    const lerpLoop = () => {
      // Smoothly interpolate currentAngle towards targetAngleRef
      const diff = targetAngleRef.current - currentAngleRef.current;
      currentAngleRef.current += diff * 0.085;

      animId = requestAnimationFrame(lerpLoop);
    };

    animId = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Jump to specific bottle manually (by clicking in circle or pagination)
  const jumpToIndex = useCallback(
    (newIdx: number) => {
      const current = ((currentIndex % total) + total) % total;
      let diff = newIdx - current;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      targetAngleRef.current += diff;
      setCurrentIndex(newIdx);
      setDwellProgress(0);
      setIsPausedAtFront(true);
    },
    [currentIndex, total]
  );

  const handlePrev = useCallback(() => {
    jumpToIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, jumpToIndex]);

  const handleNext = useCallback(() => {
    jumpToIndex((currentIndex + 1) % total);
  }, [currentIndex, total, jumpToIndex]);

  // Navigate to deep-dive showcase when clicked
  const handleSelectProduct = useCallback((p: Product) => {
    const targetSection = p.category === "Beer" ? "#showcase-beers" : "#showcase-walker";
    const el = document.querySelector(targetSection);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const activeProduct = products[((currentIndex % total) + total) % total];

  return (
    <div className="relative w-full h-[660px] sm:h-[720px] md:h-[780px] flex items-center justify-center overflow-hidden select-none">
      {/* ============================================================ */}
      {/* SUSPENDED INDUSTRIAL STUDIO LIGHT FIXTURE (OVERHEAD SPOTLIGHT) */}
      {/* ============================================================ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        {/* Steel suspension wire */}
        <div className="w-[1.5px] h-12 sm:h-16 bg-gradient-to-b from-transparent via-zinc-400 to-zinc-200" />

        {/* Industrial Studio Softbox Lamp Head */}
        <div className="relative w-32 sm:w-44 h-8 sm:h-10 rounded-b-2xl bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-x border-b border-[#d4af37]/60 shadow-[0_12px_36px_rgba(0,0,0,0.9)] flex items-center justify-center">
          {/* Intense Glowing Studio Diffuser Tube */}
          <div className="w-24 sm:w-32 h-2.5 sm:h-3 rounded-full bg-gradient-to-r from-amber-100 via-white to-amber-100 shadow-[0_0_24px_rgba(255,248,230,1),0_0_48px_rgba(212,175,55,0.8)]" />
        </div>

        {/* Volumetric Downward Light Beam Cone falling on Front Bottle */}
        <div
          className="w-[360px] sm:w-[520px] md:w-[680px] h-[540px] pointer-events-none opacity-50 blur-2xl -mt-2 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at top, rgba(255,250,230,0.65) 0%, ${activeProduct.accentColor}25 40%, transparent 75%)`,
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* 3D WEBGL CAROUSEL CANVAS */}
      {/* ============================================================ */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0.5, 9.0], fov: 42 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <CarouselScene
            currentAngleRef={currentAngleRef}
            targetIndex={((currentIndex % total) + total) % total}
            isPausedAtFront={isPausedAtFront}
            onSelect={handleSelectProduct}
            onClickBottle={jumpToIndex}
            frontProduct={activeProduct}
          />
        </Canvas>
      </div>

      {/* ============================================================ */}
      {/* LUXURY PRODUCT SHOWCASE HUD OVERLAY (AT FRONT SPOTLIGHT)     */}
      {/* ============================================================ */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 w-full max-w-4xl px-4 pointer-events-auto">
        {/* Spotlight Showcase Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-xl px-6 py-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-fade-in transition-all">
          {/* Left: Product Info */}
          <div className="flex flex-col text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: activeProduct.accentColor }}
              />
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#d4af37]">
                SPOTLIGHT • {activeProduct.category.toUpperCase()} ({((currentIndex % total) + total) % total + 1} OF {total})
              </span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
              {activeProduct.name}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {activeProduct.subCategory || activeProduct.category} • {activeProduct.abv} • {activeProduct.volume}
            </span>
          </div>

          {/* Right: Price & Deep Dive CTA */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">
                Cellar Price
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-[#d4af37]">
                Rs. {activeProduct.priceLKR.toLocaleString("en-LK")}
              </span>
            </div>
            <button
              onClick={() => handleSelectProduct(activeProduct)}
              className="px-4 py-2 rounded-full bg-[#d4af37] hover:bg-[#facc15] text-black text-xs font-bold font-mono tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Enter Story →
            </button>
          </div>
        </div>

        {/* 2-Second Dwell Progress Bar */}
        <div className="w-full max-w-xl h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] to-amber-200 transition-all duration-75"
            style={{ width: `${dwellProgress * 100}%` }}
          />
        </div>

        {/* Carousel Playback & Navigation Controls */}
        <div className="flex items-center justify-between gap-3 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs">
          {/* Previous Bottle */}
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Previous Bottle"
          >
            ◀
          </button>

          {/* Play / Pause Auto-Showcase */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#d4af37] hover:text-black text-zinc-200 font-mono text-[10px] tracking-wider transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>PAUSE (2S DWELL)</span>
              </>
            ) : (
              <span>▶ RESUME REVOLVE</span>
            )}
          </button>

          {/* Next Bottle */}
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Next Bottle"
          >
            ▶
          </button>

          <div className="h-4 w-[1px] bg-white/15 mx-1" />

          {/* 11 Bottle Dot Pagination */}
          <div className="flex items-center gap-1.5">
            {products.map((p, idx) => {
              const active = idx === ((currentIndex % total) + total) % total;
              return (
                <button
                  key={p.id}
                  onClick={() => jumpToIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    active
                      ? "w-5 h-2 bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                      : "w-2 h-2 bg-white/20 hover:bg-white/50"
                  }`}
                  title={p.name}
                />
              );
            })}
          </div>
        </div>

        {/* Helpful User Instruction */}
        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase pointer-events-none">
          Revolving in 3D circle • Pauses 2s at studio spotlight • Click any bottle to view
        </span>
      </div>
    </div>
  );
};
