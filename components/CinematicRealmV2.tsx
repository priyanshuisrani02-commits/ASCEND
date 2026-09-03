'use client';

import { useEffect, useRef } from 'react';

export function CinematicRealmV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const started = performance.now();

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const ease = (v: number) => v * v * (3 - 2 * v);
    const rnd = (n: number) => {
      const x = Math.sin(n * 91.713 + 17.19) * 43758.5453;
      return x - Math.floor(x);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawMountain = (side: number, depth: number, camera: number, t: number) => {
      const parallax = camera * (0.8 + depth * 1.6) * w * 0.035 * side;
      const x0 = side < 0 ? -w * 0.08 : w * 1.08;
      const x1 = side < 0 ? w * 0.40 : w * 0.60;
      const peak = side < 0 ? w * (0.19 + depth * 0.018) : w * (0.81 - depth * 0.018);
      const peakY = h * (0.08 + depth * 0.085);
      const midY = h * (0.39 + depth * 0.065);
      const base = h * 0.78;

      ctx.save();
      ctx.translate(parallax, 0);
      ctx.beginPath();
      ctx.moveTo(x0, base);
      ctx.lineTo(side < 0 ? w * 0.02 : w * 0.98, h * 0.59);
      ctx.lineTo(side < 0 ? w * 0.085 : w * 0.915, midY);
      ctx.lineTo(peak, peakY);
      ctx.lineTo(side < 0 ? w * 0.28 : w * 0.72, h * (0.40 + depth * 0.07));
      ctx.lineTo(x1, base);
      ctx.closePath();
      ctx.fillStyle = depth < 0.35 ? '#35413e' : depth < 0.65 ? '#202a27' : '#101716';
      ctx.fill();

      ctx.globalAlpha = 0.09 + (1 - depth) * 0.05;
      ctx.strokeStyle = '#d1d3c9';
      ctx.lineWidth = Math.max(0.7, w * 0.0005);
      for (let i = 0; i < 8; i += 1) {
        const f = (i + 1) / 9;
        const sx = side < 0 ? w * (0.09 + f * 0.11) : w * (0.91 - f * 0.11);
        const sy = h * (0.20 + f * 0.15);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(
          sx + side * w * 0.018,
          sy + h * 0.10,
          sx + side * w * 0.075,
          h * (0.54 + f * 0.10),
        );
        ctx.stroke();
      }
      ctx.restore();

      if (depth < 0.5) {
        ctx.save();
        ctx.globalAlpha = 0.025 + Math.sin(t * 0.00023 + depth * 8) * 0.006;
        const light = ctx.createRadialGradient(peak, peakY + h * 0.06, 0, peak, peakY + h * 0.06, w * 0.13);
        light.addColorStop(0, '#e8e5d4');
        light.addColorStop(1, 'rgba(232,229,212,0)');
        ctx.fillStyle = light;
        ctx.fillRect(peak - w * 0.14, peakY - h * 0.04, w * 0.28, h * 0.22);
        ctx.restore();
      }
    };

    const drawClouds = (t: number, camera: number) => {
      ctx.save();
      ctx.globalAlpha = 0.075;
      for (let i = 0; i < 7; i += 1) {
        const x = w * (-0.08 + i * 0.18) + Math.sin(t * 0.000012 + i * 2.1) * w * 0.055 - camera * w * 0.012;
        const y = h * (0.12 + (i % 3) * 0.075);
        const rx = w * (0.13 + (i % 2) * 0.06);
        const ry = h * 0.025;
        const cloud = ctx.createRadialGradient(x, y, 0, x, y, rx);
        cloud.addColorStop(0, '#e1e3dd');
        cloud.addColorStop(1, 'rgba(225,227,221,0)');
        ctx.fillStyle = cloud;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawRuins = (camera: number) => {
      const horizon = h * 0.655 - camera * h * 0.02;
      ctx.save();
      ctx.globalAlpha = 0.44;
      ctx.filter = 'blur(0.55px)';
      for (let i = 0; i < 22; i += 1) {
        const x = w * (0.12 + i * 0.037) - camera * w * (0.015 + rnd(i) * 0.01);
        const bw = w * (0.008 + rnd(i + 2) * 0.015) * (1 + camera * 0.16);
        const bh = h * (0.025 + rnd(i + 8) * 0.09) * (1 + camera * 0.12);
        ctx.fillStyle = i % 4 === 0 ? '#111817' : '#1b2421';
        ctx.fillRect(x, horizon - bh, bw, bh);
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x - bw * 0.25, horizon - bh);
          ctx.lineTo(x + bw * 0.5, horizon - bh - bw * 0.55);
          ctx.lineTo(x + bw * 1.25, horizon - bh);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawGateway = (camera: number, t: number) => {
      const z = 1 + camera * 0.28;
      const cx = w * 0.505 - camera * w * 0.006;
      const base = h * (0.775 - camera * 0.018);
      const gh = h * 0.285 * z;
      const gw = w * 0.12 * z;
      const top = base - gh;
      const openW = gw * 0.30;
      const archTop = top + gh * 0.25;
      const r = openW / 2;

      ctx.save();
      ctx.translate(cx, 0);

      const shadow = ctx.createRadialGradient(0, base, 0, 0, base, gw * 1.7);
      shadow.addColorStop(0, 'rgba(0,0,0,.68)');
      shadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(0, base + h * 0.025, gw * 1.25, h * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();

      const stone = ctx.createLinearGradient(-gw / 2, top, gw / 2, base);
      stone.addColorStop(0, '#5a5e57');
      stone.addColorStop(0.18, '#454a44');
      stone.addColorStop(0.48, '#303632');
      stone.addColorStop(0.82, '#191f1d');
      stone.addColorStop(1, '#0c100f');
      ctx.fillStyle = stone;
      ctx.beginPath();
      ctx.moveTo(-gw * 0.52, base);
      ctx.lineTo(-gw * 0.48, top + gh * 0.085);
      ctx.lineTo(-gw * 0.30, top);
      ctx.lineTo(-openW * 0.53, top + gh * 0.115);
      ctx.lineTo(openW * 0.53, top + gh * 0.115);
      ctx.lineTo(gw * 0.30, top);
      ctx.lineTo(gw * 0.48, top + gh * 0.085);
      ctx.lineTo(gw * 0.52, base);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.17;
      ctx.strokeStyle = '#d4d1c0';
      ctx.lineWidth = Math.max(0.7, w * 0.00045);
      for (let row = 0; row < 13; row += 1) {
        const y = top + gh * (0.075 + row * 0.071);
        const wobble = Math.sin(row * 2.7) * gw * 0.009;
        ctx.beginPath();
        ctx.moveTo(-gw * 0.46 + wobble, y);
        ctx.lineTo(-openW * 0.53, y + h * 0.001);
        ctx.moveTo(openW * 0.53, y + h * 0.001);
        ctx.lineTo(gw * 0.46 + wobble, y);
        ctx.stroke();
      }

      const inside = ctx.createLinearGradient(0, archTop, 0, base);
      inside.addColorStop(0, 'rgba(226,227,216,.70)');
      inside.addColorStop(0.28, 'rgba(166,174,166,.34)');
      inside.addColorStop(0.65, 'rgba(50,59,54,.68)');
      inside.addColorStop(1, 'rgba(5,8,7,.96)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = inside;
      ctx.beginPath();
      ctx.moveTo(-openW / 2, base);
      ctx.lineTo(-openW / 2, archTop + r);
      ctx.arc(0, archTop + r, r, Math.PI, 0, false);
      ctx.lineTo(openW / 2, base);
      ctx.closePath();
      ctx.fill();

      const pulse = 0.035 + Math.sin(t * 0.0003) * 0.009;
      ctx.globalAlpha = pulse;
      const innerGlow = ctx.createRadialGradient(0, archTop + r * 1.3, 0, 0, archTop + r * 1.3, openW * 1.65);
      innerGlow.addColorStop(0, '#efe6ca');
      innerGlow.addColorStop(1, 'rgba(239,230,202,0)');
      ctx.fillStyle = innerGlow;
      ctx.fillRect(-openW * 1.7, archTop, openW * 3.4, gh * 0.48);

      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = '#d5c9a9';
      ctx.lineWidth = Math.max(0.7, w * 0.00065);
      ctx.beginPath();
      ctx.moveTo(-gw * 0.32, top + gh * 0.025);
      ctx.lineTo(-gw * 0.48, top + gh * 0.10);
      ctx.lineTo(-gw * 0.50, base);
      ctx.moveTo(gw * 0.32, top + gh * 0.025);
      ctx.lineTo(gw * 0.48, top + gh * 0.10);
      ctx.lineTo(gw * 0.50, base);
      ctx.stroke();

      ctx.restore();
    };

    const drawGround = (camera: number) => {
      const horizon = h * (0.675 - camera * 0.012);
      const g = ctx.createLinearGradient(0, horizon, 0, h);
      g.addColorStop(0, '#2b3431');
      g.addColorStop(0.24, '#1a211f');
      g.addColorStop(0.62, '#0b100f');
      g.addColorStop(1, '#020403');
      ctx.fillStyle = g;
      ctx.fillRect(0, horizon, w, h - horizon);

      ctx.save();
      ctx.globalAlpha = 0.075;
      ctx.strokeStyle = '#b0b4aa';
      ctx.lineWidth = Math.max(0.6, w * 0.00032);
      for (let i = -11; i <= 11; i += 1) {
        const x = w * 0.5 + i * w * 0.036;
        ctx.beginPath();
        ctx.moveTo(x, horizon + h * 0.012);
        ctx.lineTo(w * 0.5 + (x - w * 0.5) * 2.9, h);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      for (let i = 0; i < 120; i += 1) {
        const x = (rnd(i * 2.31) * 1.18 - 0.09) * w;
        const y = horizon + Math.pow(rnd(i * 6.17), 1.72) * (h - horizon);
        const s = (0.5 + rnd(i * 4.7) * 3.2) * (0.5 + y / h);
        ctx.globalAlpha = 0.08 + rnd(i + 4) * 0.17;
        ctx.fillStyle = i % 7 === 0 ? '#555a52' : '#161c1a';
        ctx.beginPath();
        ctx.ellipse(x, y, s * 2.4, s, rnd(i) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawFog = (t: number, camera: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 15; i += 1) {
        const layer = i / 15;
        const speed = 0.000013 + (i % 5) * 0.000005;
        const x = w * (-0.12 + i * 0.083) + Math.sin(t * speed + i * 1.41) * w * (0.045 + layer * 0.025);
        const y = h * (0.44 + (i % 6) * 0.065) + Math.cos(t * 0.000018 + i) * h * 0.009 - camera * h * 0.016;
        const rx = w * (0.14 + (i % 4) * 0.045);
        const ry = h * (0.018 + (i % 4) * 0.007);
        const fog = ctx.createRadialGradient(x, y, 0, x, y, rx);
        fog.addColorStop(0, `rgba(204,210,204,${0.035 + (i % 3) * 0.009})`);
        fog.addColorStop(0.52, 'rgba(170,180,174,.014)');
        fog.addColorStop(1, 'rgba(170,180,174,0)');
        ctx.fillStyle = fog;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const render = (now: number) => {
      const elapsed = now - started;
      const progress = clamp(elapsed / 12000, 0, 1);
      const camera = ease(progress) * 0.88;
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#69736f');
      sky.addColorStop(0.30, '#505c58');
      sky.addColorStop(0.56, '#303a37');
      sky.addColorStop(1, '#070a09');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const lightX = w * 0.56 - camera * w * 0.012;
      const lightY = h * 0.23;
      const halo = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, w * 0.25);
      halo.addColorStop(0, 'rgba(231,227,204,.22)');
      halo.addColorStop(0.25, 'rgba(214,216,205,.075)');
      halo.addColorStop(1, 'rgba(214,216,205,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h * 0.58);

      drawClouds(now, camera);
      drawMountain(-1, 0.18, camera, now);
      drawMountain(1, 0.18, camera, now);
      drawMountain(-1, 0.48, camera, now);
      drawMountain(1, 0.48, camera, now);
      drawMountain(-1, 0.82, camera, now);
      drawMountain(1, 0.82, camera, now);
      drawRuins(camera);
      drawGround(camera);
      drawGateway(camera, now);
      drawFog(now, camera);

      const grain = 0.022 + Math.sin(now * 0.00011) * 0.004;
      ctx.save();
      ctx.globalAlpha = grain;
      for (let i = 0; i < 140; i += 1) {
        ctx.fillStyle = i % 2 ? '#ffffff' : '#000000';
        ctx.fillRect(rnd(i * 9.7) * w, rnd(i * 3.4) * h, 1, 1);
      }
      ctx.restore();

      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.18, w * 0.5, h * 0.5, w * 0.78);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.62, 'rgba(0,2,2,.10)');
      vignette.addColorStop(1, 'rgba(0,2,2,.76)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascend-realm-canvas" aria-hidden="true" />;
}
