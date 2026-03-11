import { Vector3, Quaternion, Matrix } from "@babylonjs/core";
import { SPHERE_RADIUS } from "./constants.ts";

/**
 * Advance a point on the sphere surface by rotating around a given axis.
 * Returns the new position (still on the sphere surface).
 */
export function advanceOnSphere(
  position: Vector3,
  headingQuat: Quaternion,
  distance: number,
): Vector3 {
  const forward = getForward(position, headingQuat);
  const axis = Vector3.Cross(position.normalize(), forward).normalize();
  const angle = distance / SPHERE_RADIUS;
  const rotation = Quaternion.RotationAxis(axis, angle);
  const newPos = position.clone();
  newPos.rotateByQuaternionAroundPointToRef(rotation, Vector3.Zero(), newPos);
  // Re-project onto sphere to prevent drift
  newPos.normalize().scaleInPlace(SPHERE_RADIUS);
  return newPos;
}

/**
 * Get the forward direction tangent to the sphere at the given position.
 */
export function getForward(
  position: Vector3,
  headingQuat: Quaternion,
): Vector3 {
  const normal = position.normalize();
  // Start with a reference forward: project world forward onto tangent plane
  const refForward = getTangentRef(normal);
  // Rotate by heading quaternion around the normal
  const mat = new Matrix();
  headingQuat.toRotationMatrix(mat);
  const rotated = Vector3.TransformNormal(refForward, mat);
  // Project onto tangent plane and normalize
  const dot = Vector3.Dot(rotated, normal);
  const tangent = rotated.subtract(normal.scale(dot)).normalize();
  return tangent;
}

/**
 * Get a reference tangent vector for a given surface normal.
 * Used as the "zero heading" direction at that point.
 */
function getTangentRef(normal: Vector3): Vector3 {
  const up = Math.abs(normal.y) < 0.99 ? Vector3.Up() : Vector3.Right();
  return Vector3.Cross(up, normal).normalize();
}

/**
 * Steer the heading quaternion by rotating around the surface normal.
 */
export function steerHeading(
  headingQuat: Quaternion,
  position: Vector3,
  angle: number,
): Quaternion {
  const normal = position.normalize();
  const steerRot = Quaternion.RotationAxis(normal, angle);
  return steerRot.multiply(headingQuat);
}

/**
 * Random point on the sphere surface.
 */
export function randomPointOnSphere(): Vector3 {
  const u = Math.random() * 2 - 1;
  const theta = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return new Vector3(r * Math.cos(theta), u, r * Math.sin(theta)).scale(
    SPHERE_RADIUS,
  );
}

/**
 * Geodesic (great-circle) distance between two points on the sphere.
 */
export function geodesicDistance(a: Vector3, b: Vector3): number {
  const cosAngle = Math.max(
    -1,
    Math.min(1, Vector3.Dot(a.normalize(), b.normalize())),
  );
  return Math.acos(cosAngle) * SPHERE_RADIUS;
}
