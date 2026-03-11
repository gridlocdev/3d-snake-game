import { DynamicTexture } from "@babylonjs/core";
import type { Scene } from "@babylonjs/core";

export function createFaceTexture(scene: Scene): DynamicTexture {
  const tex = new DynamicTexture("faceTex", 512, scene, true);
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
  const s = 512;

  // Background (match head color)
  ctx.fillStyle = "#2ecc40";
  ctx.fillRect(0, 0, s, s);

  // Eyes - white sclera
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(s * 0.32, s * 0.35, s * 0.12, s * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(s * 0.68, s * 0.35, s * 0.12, s * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils - offset upward for angry look
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(s * 0.32, s * 0.32, s * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s * 0.68, s * 0.32, s * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = s * 0.04;
  ctx.lineCap = "round";

  // Left eyebrow (angled down toward center)
  ctx.beginPath();
  ctx.moveTo(s * 0.18, s * 0.22);
  ctx.lineTo(s * 0.42, s * 0.18);
  ctx.stroke();

  // Right eyebrow
  ctx.beginPath();
  ctx.moveTo(s * 0.82, s * 0.22);
  ctx.lineTo(s * 0.58, s * 0.18);
  ctx.stroke();

  // Mouth
  ctx.fillStyle = "#cc0000";
  ctx.beginPath();
  ctx.moveTo(s * 0.25, s * 0.65);
  ctx.quadraticCurveTo(s * 0.5, s * 0.85, s * 0.75, s * 0.65);
  ctx.closePath();
  ctx.fill();

  // Pointy teeth
  ctx.fillStyle = "white";
  const teethY = s * 0.65;
  const teethCount = 5;
  const teethWidth = s * 0.5 / teethCount;
  for (let i = 0; i < teethCount; i++) {
    const x = s * 0.25 + i * teethWidth;
    ctx.beginPath();
    ctx.moveTo(x, teethY);
    ctx.lineTo(x + teethWidth / 2, teethY + s * 0.08);
    ctx.lineTo(x + teethWidth, teethY);
    ctx.closePath();
    ctx.fill();
  }

  tex.update();
  return tex;
}
