'use client';

import { useEffect, useRef } from 'react';

/**
 * Procedural recreation of the approved ASCEND environment test:
 * colossal mountain walls, a weathered stone gate, distant ruins and
 * slow volumetric fog. The camera performs one deliberate forward push
 * and then holds, so the landing scene never needs an obvious loop.
 */
export function CinematicRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let startedAt = performance.now();

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

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

    const noise = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    const mountainPath = (points: Array<[number, number]>, fill: string, blur = 0) => {
      ctx.save();
      if (blur) ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(0, height);
      points.forEach(([x, y], index) => {
        if (index === 0) ctx.lineTo(x, y);
        else {
          const [px, py] = points[index - 1];
          ctx.quadraticCurveTo((px + x) / 2, py, x, y);
        }
      });
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawMountainWalls = (camera: number) => {
      const parallax = camera * width * 0.018;

      mountainPath([
        [-width * 0.08 - parallax, height * 0.46],
        [width * 0.08 - parallax, height * 0.34],
        [width * 0.18 - parallax, height * 0.43],
        [width * 0.28 - parallax, height * 0.51],
        [width * 0.39 - parallax, height * 0.61],
      ], '#34413f', 2.5);

      mountainPath([
        [width * 1.08 + parallax, height * 0.44],
        [width * 0.92 + parallax, height * 0.32],
        [width * 0.82 + parallax, height * 0.43],
        [width * 0.71 + parallax, height * 0.51],
        [width * 0.61 + parallax, height * 0.61],
      ], '#303b39', 2.5);

      mountainPath([
        [-width * 0.12 - parallax * 1.8, height * 0.72],
        [width * 0.01 - parallax, height * 0.56],
        [width * 0.10 - parallax, height * 0.28],
        [width * 0.18 - parallax, height * 0.10],
        [width * 0.25 - parallax, height * 0.35],
        [width * 0.34 - parallax, height * 0.57],
        [width * 0.43 - parallax, height * 0.73],
      ], '#111918');

      mountainPath([
        [width * 1.12 + parallax * 1.8, height * 0.72],
        [width * 0.99 + parallax, height * 0.56],
        [width * 0.90 + parallax, height * 0.25],
        [width * 0.82 + parallax, height * 0.07],
        [width * 0.75 + parallax, height * 0.35],
        [width * 0.66 + parallax, height * 0.58],
        [width * 0.57 + parallax, height * 0.73],
      ], '#101716');

      ctx.save();
      ctx.globalAlpha = 0.17;
      ctx.strokeStyle = '#aeb8b2';
      ctx.lineWidth = Math.max(1, width * 0.00055);
      const ridges = [
        [0.18, 0.11, 0.28, 0.57],
        [0.22, 0.21, 0.34, 0.65],
        [0.82, 0.08, 0.73, 0.58],
        [0.86, 0.19, 0.67, 0.67],
      ];
      ridges.forEach(([x1, y1, x2, y2], i) => {
        const direction = i < 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(width * x1 - parallax * direction, height * y1);
        ctx.quadraticCurveTo(
          width * ((x1 + x2) / 2),
          height * ((y1 + y2) / 2) + height * 0.04,
          width * x2 - parallax * direction,
          height * y2,
        );
        ctx.stroke();
      });
      ctx.restore();
    };

    const drawDistantRuins = (camera: number) => {
      const base = height * 0.665 - camera * height * 0.012;
      const scale = 1 + camera * 0.14;
      ctx.save();
      ctx.globalAlpha = 0.33;
      ctx.filter = 'blur(1.1px)';
      for (let i = 0; i < 13; i += 1) {
        const x = width * (0.14 + i * 0.061) + Math.sin(i * 4.3) * width * 0.008;
        const h = height * (0.035 + noise(i + 4) * 0.09) * scale;
        const w = width * (0.012 + noise(i + 11) * 0.016) * scale;
        ctx.fillStyle = i % 3 === 0 ? '#17201e' : '#202a27';
        ctx.fillRect(x - w / 2, base - h, w, h);
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(x - w * 0.7, base - h);
          ctx.lineTo(x, base - h - w * 0.55);
          ctx.lineTo(x + w * 0.7, base - h);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawGateway = (camera: number) => {
      const cx = width * 0.505;
      const base = height * (0.775 - camera * 0.015);
      const gateHeight = height * (0.30 + camera * 0.105);
      const gateWidth = width * (0.135 + camera * 0.052);
      const topY = base - gateHeight;
      const openingWidth = gateWidth * 0.34;
      const openingTop = topY + gateHeight * 0.23;
      const archRadius = openingWidth / 2;

      ctx.save();
      ctx.translate(cx, 0);

      const shadow = ctx.createRadialGradient(0, base, 0, 0, base, gateWidth * 1.6);
      shadow.addColorStop(0, 'rgba(0,0,0,.62)');
      shadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(0, base + height * 0.015, gateWidth * 1.25, height * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();

      const stone = ctx.createLinearGradient(-gateWidth / 2, topY, gateWidth / 2, base);
      stone.addColorStop(0, '#4a514c');
      stone.addColorStop(0.35, '#303733');
      stone.addColorStop(0.75, '#1b211f');
      stone.addColorStop(1, '#111615');
      ctx.fillStyle = stone;
      ctx.beginPath();
      ctx.moveTo(-gateWidth * 0.52, base);
      ctx.lineTo(-gateWidth * 0.48, topY + gateHeight * 0.08);
      ctx.lineTo(-gateWidth * 0.28, topY);
      ctx.lineTo(-openingWidth / 2, topY + gateHeight * 0.13);
      ctx.lineTo(openingWidth / 2, topY + gateHeight * 0.13);
      ctx.lineTo(gateWidth * 0.28, topY);
      ctx.lineTo(gateWidth * 0.48, topY + gateHeight * 0.08);
      ctx.lineTo(gateWidth * 0.52, base);
      ctx.closePath();
      ctx.fill();

      const opening = ctx.createLinearGradient(0, openingTop, 0, base);
      opening.addColorStop(0, 'rgba(216,221,213,.78)');
      opening.addColorStop(0.35, 'rgba(138,151,145,.48)');
      opening.addColorStop(1, 'rgba(34,43,40,.88)');
      ctx.fillStyle = opening;
      ctx.beginPath();
      ctx.moveTo(-openingWidth / 2, base);
      ctx.lineTo(-openingWidth / 2, openingTop + archRadius);
      ctx.arc(0, openingTop + archRadius, openingWidth / 2, Math.PI, 0, false);
      ctx.lineTo(openingWidth / 2, base);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = 'rgba(111,119,112,.42)';
      ctx.lineWidth = Math.max(1, width * 0.0007);
      const rows = Math.max(7, Math.round(9 + camera * 3));
      for (let row = 0; row < rows; row += 1) {
        const y = topY + gateHeight * 0.08 + row * gateHeight * 0.095;
        const left = -gateWidth * 0.48;
        const leftRight = -openingWidth / 2 - gateWidth * 0.035;
        const rightLeft = openingWidth / 2 + gateWidth * 0.035;
        const right = gateWidth * 0.48;
        const count = 3 + (row % 2);
        for (let b = 0; b < count; b += 1) {
          ctx.strokeRect(left + ((leftRight - left) / count) * b, y, (leftRight - left) / count, gateHeight * 0.09);
          ctx.strokeRect(rightLeft + ((right - rightLeft) / count) * b, y, (right - rightLeft) / count, gateHeight * 0.09);
        }
      }
      ctx.restore();

      ctx.fillStyle = '#171d1b';
      ctx.beginPath();
      ctx.moveTo(-gateWidth * 0.52, topY + gateHeight * 0.08);
      ctx.lineTo(-gateWidth * 0.30, topY - gateHeight * 0.075);
      ctx.lineTo(-gateWidth * 0.18, topY + gateHeight * 0.02);
      ctx.lineTo(-gateWidth * 0.20, topY + gateHeight * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(gateWidth * 0.19, topY + gateHeight * 0.02);
      ctx.lineTo(gateWidth * 0.31, topY - gateHeight * 0.055);
      ctx.lineTo(gateWidth * 0.52, topY + gateHeight * 0.08);
      ctx.lineTo(gateWidth * 0.20, topY + gateHeight * 0.12);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(218,207,174,.17)';
      ctx.lineWidth = Math.max(1, width * 0.001);
      ctx.beginPath();
      ctx.moveTo(-gateWidth * 0.31, topY + gateHeight * 0.03);
      ctx.lineTo(-gateWidth * 0.47, topY + gateHeight * 0.10);
      ctx.lineTo(-gateWidth * 0.49, base);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gateWidth * 0.30, topY + gateHeight * 0.04);
      ctx.lineTo(gateWidth * 0.47, topY + gateHeight * 0.10);
      ctx.lineTo(gateWidth * 0.49, base);
      ctx.stroke();

      ctx.restore();
    };

    const drawGround = (camera: number) => {
      const horizon = height * (0.68 - camera * 0.01);
      const ground = ctx.createLinearGradient(0, horizon, 0, height);
      ground.addColorStop(0, '#222b28');
      ground.addColorStop(0.45, '#121918');
      ground.addColorStop(1, '#050807');
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizon, width, height - horizon);

      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = '#3b4540';
      ctx.lineWidth = 1;
      for (let i = -8; i < 10; i += 1) {
        const x = width * 0.5 + i * width * 0.045;
        ctx.beginPath();
        ctx.moveTo(x, horizon + height * 0.02);
        ctx.lineTo(width * 0.5 + (x - width * 0.5) * 2.7, height);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      for (let i = 0; i < 55; i += 1) {
        const x = (noise(i * 2.17) * 1.2 - 0.1) * width;
        const y = horizon + Math.pow(noise(i * 5.91), 1.7) * (height - horizon);
        const s = (1 + noise(i * 7.2) * 4) * (0.65 + y / height);
        ctx.fillStyle = i % 4 === 0 ? '#303733' : '#181f1d';
        ctx.beginPath();
        ctx.ellipse(x, y, s * 1.8, s, noise(i) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawFog = (time: number, camera: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 8; i += 1) {
        const drift = Math.sin(time * (0.00006 + i * 0.000004) + i * 1.7) * width * 0.08;
        const x = width * (0.03 + i * 0.14) + drift;
        const y = height * (0.48 + (i % 4) * 0.09) - camera * height * 0.02;
        const rx = width * (0.20 + (i % 3) * 0.055);
        const ry = height * (0.055 + (i % 3) * 0.017);
        const fog = ctx.createRadialGradient(x, y, 0, x, y, rx);
        fog.addColorStop(0, 'rgba(207,216,210,.14)');
        fog.addColorStop(0.36, 'rgba(188,200,194,.075)');
        fog.addColorStop(1, 'rgba(170,184,178,0)');
        ctx.fillStyle = fog;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const veilX = width * 0.50 + Math.sin(time * 0.00012) * width * 0.18;
      const veil = ctx.createLinearGradient(veilX - width * 0.22, 0, veilX + width * 0.22, 0);
      veil.addColorStop(0, 'rgba(208,216,211,0)');
      veil.addColorStop(0.5, 'rgba(207,215,210,.055)');
      veil.addColorStop(1, 'rgba(208,216,211,0)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, height * 0.40, width, height * 0.28);
    };

    const drawAtmosphere = (time: number) => {
      const cx = width * 0.48 + Math.sin(time * 0.00008) * width * 0.012;
      const cy = height * 0.25;
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.43);
      bloom.addColorStop(0, 'rgba(235,231,210,.42)');
      bloom.addColorStop(0.18, 'rgba(218,218,205,.18)');
      bloom.addColorStop(0.55, 'rgba(192,204,200,.055)');
      bloom.addColorStop(1, 'rgba(192,204,200,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height * 0.72);

      ctx.save();
      ctx.globalAlpha = 0.035;
      for (let i = 0; i < 160; i += 1) {
        const x = (i * 97 + time * 0.012) % width;
        const y = (i * 53 + time * 0.004) % height;
        const s = 0.35 + (i % 3) * 0.4;
        ctx.fillStyle = i % 7 === 0 ? '#eee8d5' : '#0b1110';
        ctx.fillRect(x, y, s, s);
      }
      ctx.restore();
    };

    const draw = (now: number) => {
      const elapsed = now - startedAt;
      const reveal = clamp(elapsed / 15500, 0, 1);
      const camera = easeOut(reveal);

      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#aeb9b7');
      sky.addColorStop(0.24, '#87928f');
      sky.addColorStop(0.48, '#5a6764');
      sky.addColorStop(0.72, '#27302e');
      sky.addColorStop(1, '#070b0a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      drawAtmosphere(now);
      drawMountainWalls(camera);
      drawDistantRuins(camera);
      drawGround(camera);
      drawGateway(camera);
      drawFog(now, camera);

      const grade = ctx.createLinearGradient(0, 0, 0, height);
      grade.addColorStop(0, 'rgba(12,17,16,.08)');
      grade.addColorStop(0.58, 'rgba(3,6,6,.02)');
      grade.addColorStop(1, 'rgba(0,2,2,.62)');
      ctx.fillStyle = grade;
      ctx.fillRect(0, 0, width, height);

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        Math.min(width, height) * 0.22,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.76,
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.64, 'rgba(0,0,0,.12)');
      vignette.addColorStop(1, 'rgba(0,0,0,.70)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

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
