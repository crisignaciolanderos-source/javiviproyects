"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

interface CircularCarouselProps {
  items: Product[];
  cardWidth?: number;
  aspectRatio?: number;
  speed?: number;
  gap?: number;
  tilt?: number;
  curve?: number;
  perspective?: number;
  autoplay?: "drift" | "none";
  interval?: number;
  direction?: "left" | "right";
  momentum?: number;
  snap?: boolean;
  pauseOnHover?: boolean;
  focusOnClick?: boolean;
  draggable?: boolean;
  parallax?: number;
  stretch?: number;
  fadeColor?: string;
  depthFade?: number;
  innerShade?: number;
  cornerRadius?: number;
}

export default function CircularCarousel({
  items,
  cardWidth = 220,
  aspectRatio = 1,
  speed = 14,
  gap = 25,
  tilt = -5,
  curve = 1,
  perspective = 2500,
  autoplay = "drift",
  interval = 3,
  direction = "left",
  momentum = 0.6,
  snap = true,
  pauseOnHover = true,
  focusOnClick = true,
  draggable = true,
  parallax = 0.3,
  stretch = 0.5,
  fadeColor = "#000000",
  depthFade = 0.55,
  innerShade = 0.6,
  cornerRadius = 12,
}: CircularCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isPausedRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const dragStartRef = useRef({ x: 0, rotation: 0 });
  const hasDraggedRef = useRef(false);

  const n = items.length;
  const cardHeight = cardWidth / aspectRatio;
  const radius = (cardWidth + gap) / (2 * Math.sin(Math.PI / n));
  const angleStep = 360 / n;

  // Build the carousel
  useEffect(() => {
    if (n === 0) return;

    const camera = cameraRef.current;
    const ring = ringRef.current;
    const stage = stageRef.current;
    if (!camera || !ring || !stage) return;

    // Clear previous
    ring.innerHTML = "";

    // Create tiles
    items.forEach((item, i) => {
      const tile = document.createElement("div");
      tile.className = "circular-carousel__tile";
      tile.style.width = `${cardWidth}px`;
      tile.style.height = `${cardHeight}px`;
      tile.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
      tile.style.transformOrigin = "center center";
      tile.style.backfaceVisibility = "hidden";

      // Frame
      const frame = document.createElement("div");
      frame.className = "circular-carousel__frame";
      frame.style.width = `${cardWidth}px`;
      frame.style.height = `${cardHeight}px`;
      frame.style.borderRadius = `${cornerRadius}px`;
      frame.style.overflow = "hidden";
      frame.style.position = "relative";

      // Image
      const img = document.createElement("img");
      img.className = "circular-carousel__photo";
      img.src = item.images?.[0] || "https://picsum.photos/600/750";
      img.alt = item.name;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.draggable = false;
      frame.appendChild(img);

      // Shade (depth fade)
      const shade = document.createElement("div");
      shade.className = "circular-carousel__shade";
      shade.style.opacity = String(depthFade);
      frame.appendChild(shade);

      // Inner shade
      const inner = document.createElement("div");
      inner.className = "circular-carousel__inner";
      inner.style.opacity = String(innerShade);
      frame.appendChild(inner);

      tile.appendChild(frame);

      // Click handler
      if (focusOnClick) {
        tile.style.cursor = "pointer";
        tile.addEventListener("click", () => {
          if (hasDraggedRef.current) return;
          const targetRotation = -i * angleStep;
          animateTo(targetRotation);
        });
      }

      ring.appendChild(tile);
    });

    // Set camera perspective
    camera.style.perspective = `${perspective}px`;
    camera.style.perspectiveOrigin = "50% 50%";

    // Set ring initial transform
    ring.style.transform = `rotateY(0deg)`;

    setReady(true);

    // Animation loop
    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isPausedRef.current && autoplay === "drift") {
        const speedDeg = (direction === "left" ? -1 : 1) * speed * dt;
        rotationRef.current += speedDeg;
        velocityRef.current = speedDeg / dt;
      }

      // Apply momentum decay when dragging
      if (isDragging) {
        // velocity handled by drag
      } else {
        velocityRef.current *= 0.95;
        if (Math.abs(velocityRef.current) > 0.01) {
          rotationRef.current += velocityRef.current * dt;
        }
      }

      // Snap
      if (snap && !isDragging && Math.abs(velocityRef.current) < 0.5) {
        const targetIndex = Math.round(-rotationRef.current / angleStep);
        const targetRotation = -targetIndex * angleStep;
        const diff = targetRotation - rotationRef.current;
        rotationRef.current += diff * 0.08;
        if (Math.abs(diff) < 0.1) {
          rotationRef.current = targetRotation;
          velocityRef.current = 0;
        }
      }

      // Update ring transform
      if (ring) {
        ring.style.transform = `rotateY(${rotationRef.current}deg)`;
      }

      // Update current index for external use
      const idx = Math.round(-rotationRef.current / angleStep) % n;
      setCurrentIndex(((idx % n) + n) % n);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [items, n, cardWidth, cardHeight, radius, angleStep, perspective, cornerRadius, depthFade, innerShade, focusOnClick, snap, autoplay, speed, direction]);

  const animateTo = useCallback((targetDeg: number) => {
    const start = rotationRef.current;
    const diff = targetDeg - start;
    const duration = 600;
    const startTime = performance.now();

    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      rotationRef.current = start + diff * eased;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, []);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, rotation: rotationRef.current };
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [draggable]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    if (Math.abs(dx) > 5) hasDraggedRef.current = true;
    const rotationDelta = dx * (180 / (cardWidth * 2));
    rotationRef.current = dragStartRef.current.rotation + rotationDelta;
    velocityRef.current = rotationDelta * 0.5;
  }, [isDragging, cardWidth]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) isPausedRef.current = true;
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) isPausedRef.current = false;
  }, [pauseOnHover]);

  if (n === 0) return null;

  return (
    <div
      ref={containerRef}
      className="circular-carousel"
      data-ready={ready ? "" : undefined}
      data-draggable={draggable ? "" : undefined}
      data-dragging={isDragging ? "" : undefined}
      data-axis="x"
      data-shape="wheel"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        "--cc-fade": fadeColor,
        "--cc-radius": `${cornerRadius}px`,
        "--cc-inner": innerShade,
        "--cc-depth": depthFade,
      } as React.CSSProperties}
    >
      <div className="circular-carousel__view">
        <div
          ref={stageRef}
          className="circular-carousel__stage"
          style={{
            perspective: `${perspective}px`,
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            ref={cameraRef}
            className="circular-carousel__camera"
          >
            <div
              ref={ringRef}
              className="circular-carousel__ring"
            />
          </div>
        </div>
      </div>

      {/* Caption for current item */}
      {items[currentIndex] && (
        <div className="circular-carousel__caption">
          <span className="circular-carousel__title">
            {items[currentIndex].name}
          </span>
          <span className="circular-carousel__subtitle">
            {items[currentIndex].category === "ropa" ? "Ropa Usada" : "Cosmetic"}
          </span>
        </div>
      )}
    </div>
  );
}