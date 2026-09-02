'use client';

import { useEffect, useRef } from 'react';

export function CinematicRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const terrain = (x: number, horizon: number, scale: number, seed: number) => {
      const a = Math.sin(x * 0.006 * scale + seed) * 42;
      const b = Math.sin(x * 0.014 * scale + seed * 1.7) * 22;
      const c = Math.sin(x * 0.031 * scale + seed * 2.4) * 11;
      const d = Math.sin(x * 0.071 * scale + seed * 3.1) * 5;
      return horizon - a - b - c - d;
    };

    const draw = () => {
      frame += 0.55;
      const t = frame * 0.001;
      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#dfe2df');
      sky.addColorStop(0.24, '#aeb5b1');
      sky.addColorStop(0.52, '#66706d');
      sky.addColorStop(0.78, '#252d2c');
      sky.addColorStop(1, '#070b0b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Moving atmospheric exposure: a soft, almost photographic celestial bloom.
      const cx = width * 0.53;
      const cy = height * 0.24;
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.46);
      bloom.addColorStop(0, 'rgba(255,247,214,.95)');
      bloom.addColorStop(0.08, 'rgba(244,225,177,.56)');
      bloom.addColorStop(0.28, 'rgba(223,211,184,.18)');
      bloom.addColorStop(0.7, 'rgba(196,205,201,.04)');
      bloom.addColorStop(1, 'rgba(196,205,201,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height * 0.72);

      // Very subtle sun disk, deliberately diffused into the atmosphere.
      const sun = ctx.createRadialGradient(cx, cy, 3, cx, cy, Math.min(width, height) * 0.13);
      sun.addColorStop(0, 'rgba(255,251,229,.9)');
      sun.addColorStop(0.12, 'rgba(255,239,193,.4)');
      sun.addColorStop(0.45, 'rgba(244,222,172,.08)');
      sun.addColorStop(1, 'rgba(244,222,172,0)');
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.13, 0, Math.PI * 2);
      ctx.fill();

      // Distant atmospheric ridges: curved terrain, not geometric triangles.
      const layers = [
        { horizon: height * 0.53, scale: 0.62, seed: 1.4, alpha: 0.24 },
        { horizon: height * 0.61, scale: 0.9, seed: 4.2, alpha: 0.32 },
        { horizon: height * 0.70, scale: 1.18, seed: 7.8, alpha: 0.58 },
        { horizon: height * 0.79, scale: 1.45, seed: 11.1, alpha: 0.9 },
      ];

      layers.forEach((layer, index) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width + 12; x += 10) {
          const y = terrain(x + t * (index + 1) * 9, layer.horizon, layer.scale, layer.seed);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, layer.horizon - 120, 0, height);
        fill.addColorStop(0, `rgba(58,68,66,${layer.alpha * 0.65})`);
        fill.addColorStop(1, `rgba(7,12,12,${layer.alpha})`);
        ctx.fillStyle = fill;
        ctx.fill();
      });

      // Distant ancient skyline, softened heavily by haze.
      ctx.save();
      ctx.globalAlpha = 0.32;
      ctx.filter = 'blur(1.5px)';
      for (let i = 0; i < 11; i += 1) {
        const x = width * (0.03 + i * 0.095);
        const base = height * (0.69 + (i % 3) * 0.018);
        const h = height * (0.055 + (i % 4) * 0.024);
        ctx.fillStyle = '#151c1b';
        ctx.fillRect(x, base - h, width * 0.018, h);
        ctx.beginPath();
        ctx.moveTo(x - width * 0.009, base - h);
        ctx.lineTo(x + width * 0.009, base - h - width * 0.011);
        ctx.lineTo(x + width * 0.027, base - h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Foreground monumental silhouettes with subtle internal vertical texture.
      ctx.save();
      ctx.globalAlpha = 0.72;
      const towers = [
        { x: 0.075, w: 0.052, h: 0.26 },
        { x: 0.19, w: 0.035, h: 0.16 },
        { x: 0.79, w: 0.04, h: 0.19 },
        { x: 0.9, w: 0.058, h: 0.29 },
      ];
      towers.forEach((tower, i) => {
        const x = width * tower.x;
        const w = width * tower.w;
        const h = height * tower.h;
        const base = height * 0.82;
        const grad = ctx.createLinearGradient(x, base - h, x + w, base);
        grad.addColorStop(0, '#101615');
        grad.addColorStop(0.45, '#3b4541');
        grad.addColorStop(0.72, '#1b2220');
        grad.addColorStop(1, '#090d0d');
        ctx.fillStyle = grad;
        ctx.fillRect(x, base - h, w, h);
        ctx.fillStyle = 'rgba(190,190,166,.055)';
        ctx.fillRect(x + w * 0.18, base - h + h * 0.1, Math.max(1, w * 0.025), h * 0.76);
        ctx.fillRect(x + w * 0.56, base - h + h * 0.08, Math.max(1, w * 0.018), h * 0.78);
        ctx.fillStyle = '#101513';
        ctx.beginPath();
        ctx.moveTo(x - w * 0.22, base - h);
        ctx.lineTo(x + w * 0.5, base - h - w * 0.38);
        ctx.lineTo(x + w * 1.22, base - h);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = `rgba(220,207,163,${0.035 + (i % 2) * 0.025})`;
        ctx.fillRect(x + w * 0.44, base - h * 0.64, Math.max(1, w * 0.12), h * 0.035);
      });
      ctx.restore();

      // Floating relics are irregular and nearly swallowed by the haze.
      const relics = [
        { x: 0.17, y: 0.31, s: 0.045, r: -0.08 },
        { x: 0.84, y: 0.27, s: 0.038, r: 0.12 },
        { x: 0.75, y: 0.47, s: 0.024, r: -0.18 },
      ];
      relics.forEach((r, i) => {
        const x = width * r.x + Math.sin(t * 0.45 + i) * 10;
        const y = height * r.y + Math.sin(t * 0.7 + i * 2) * 13;
        const s = Math.min(width, height) * r.s;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(r.r + Math.sin(t * 0.2 + i) * 0.03);
        ctx.globalAlpha = 0.28;
        ctx.shadowBlur = 22;
        ctx.shadowColor = 'rgba(231,216,172,.25)';
        const rg = ctx.createLinearGradient(-s, -s, s, s);
        rg.addColorStop(0, '#0d1312');
        rg.addColorStop(0.45, '#3b4440');
        rg.addColorStop(1, '#101615');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(-s * 0.58, -s);
        ctx.lineTo(s * 0.52, -s * 0.9);
        ctx.lineTo(s * 0.62, s * 0.82);
        ctx.lineTo(-s * 0.5, s);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(224,211,173,.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Volumetric shafts drift slowly through the haze.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 5; i += 1) {
        const x = width * (0.2 + i * 0.17) + Math.sin(t * 0.16 + i) * 80;
        const beam = ctx.createLinearGradient(x, 0, x + 150, height * 0.76);
        beam.addColorStop(0, 'rgba(255,242,198,.035)');
        beam.addColorStop(0.45, 'rgba(255,242,198,.075)');
        beam.addColorStop(1, 'rgba(255,242,198,0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(x - 40, 0);
        ctx.lineTo(x + 35, 0);
        ctx.lineTo(x + 180, height * 0.75);
        ctx.lineTo(x + 60, height * 0.75);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Huge slow fog banks provide the cinematic depth.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 7; i += 1) {
        const x = width * (0.05 + i * 0.17) + Math.sin(t * (0.09 + i * 0.006) + i) * 180;
        const y = height * (0.53 + (i % 3) * 0.105) + Math.cos(t * 0.12 + i) * 24;
        const rx = width * (0.22 + (i % 2) * 0.09);
        const ry = height * (0.075 + (i % 3) * 0.025);
        const fog = ctx.createRadialGradient(x, y, 0, x, y, rx);
        fog.addColorStop(0, 'rgba(219,224,218,.11)');
        fog.addColorStop(0.4, 'rgba(198,207,201,.065)');
        fog.addColorStop(1, 'rgba(180,191,186,0)');
        ctx.fillStyle = fog;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Fine film grain / dust keeps the scene from looking like flat UI shapes.
      ctx.save();
      ctx.globalAlpha = 0.055;
      for (let i = 0; i < 180; i += 1) {
        const x = (i * 97 + frame * 0.3) % width;
        const y = (i * 53 + frame * 0.13) % height;
        const s = (i % 3) + 0.35;
        ctx.fillStyle = i % 5 === 0 ? '#fff7dc' : '#0a0e0e';
        ctx.fillRect(x, y, s, s);
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascend-realm-canvas" aria-hidden="true" />;
}
