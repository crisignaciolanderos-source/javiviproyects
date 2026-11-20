"use client";

import { useEffect, useRef } from "react";

export default function GrainientBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Grainy gradient colors (pink palette)
    const colors = [
      { r: 229, g: 129, b: 162 }, // rose
      { r: 255, g: 180, b: 200 }, // light pink
      { r: 45, g: 27, b: 46 },    // dark pink bg
      { r: 30, g: 20, b: 35 },     // darker
    ];

    function draw() {
      t += 0.003;
      const w = canvas!.width;
      const h = canvas!.height;

      // Base gradient
      const grad = ctx!.createRadialGradient(
        w * (0.3 + 0.2 * Math.sin(t)),
        h * (0.3 + 0.2 * Math.cos(t * 0.7)),
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.8
      );
      grad.addColorStop(0, `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, 0.6)`);
      grad.addColorStop(0.4, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.3)`);
      grad.addColorStop(0.7, `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, 0.8)`);
      grad.addColorStop(1, `rgba(${colors[3].r}, ${colors[3].g}, ${colors[3].b}, 1)`);

      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Second blob
      const grad2 = ctx!.createRadialGradient(
        w * (0.7 + 0.15 * Math.cos(t * 1.2)),
        h * (0.6 + 0.15 * Math.sin(t * 0.9)),
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.6
      );
      grad2.addColorStop(0, `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, 0.25)`);
      grad2.addColorStop(0.5, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.15)`);
      grad2.addColorStop(1, "transparent");
      ctx!.fillStyle = grad2;
      ctx!.fillRect(0, 0, w, h);

      // Grain effect
      const imageData = ctx!.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 25;
        data[i] = Math.max(0, Math.min(255, data[i] + grain));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
      }
      ctx!.putImageData(imageData, 0, 0);

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}