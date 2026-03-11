import { Vector3 } from "@babylonjs/core";
import { SPHERE_RADIUS, DOT_SPAWN_MARGIN } from "./constants.ts";

/**
 * Random point inside the sphere, kept away from both the center
 * and the boundary so the player can always reach it safely.
 */
export function randomPointInSphere(): Vector3 {
  const maxR = SPHERE_RADIUS - DOT_SPAWN_MARGIN;
  const minR = 0.8;
  while (true) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const z = Math.random() * 2 - 1;
    const r2 = x * x + y * y + z * z;
    if (r2 > 0 && r2 <= 1) {
      const r = Math.sqrt(r2);
      const scaled = minR + r * (maxR - minR);
      const dir = new Vector3(x, y, z).normalize();
      return dir.scale(scaled);
    }
  }
}

/**
 * Check if a position is outside the sphere boundary.
 */
export function isOutsideSphere(position: Vector3): boolean {
  return position.length() >= SPHERE_RADIUS;
}
