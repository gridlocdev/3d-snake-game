import { Vector3 } from "@babylonjs/core";
import { SPHERE_RADIUS } from "./constants.ts";

/**
 * Random point inside the sphere (not on the surface).
 * Uses rejection sampling for uniform distribution.
 */
export function randomPointInSphere(): Vector3 {
  while (true) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const z = Math.random() * 2 - 1;
    if (x * x + y * y + z * z <= 1) {
      // Keep dots away from the very center and very edge
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > 0.2) {
        return new Vector3(x, y, z).scale(SPHERE_RADIUS * 0.85);
      }
    }
  }
}

/**
 * Check if a position is outside the sphere boundary.
 */
export function isOutsideSphere(position: Vector3): boolean {
  return position.length() >= SPHERE_RADIUS;
}
