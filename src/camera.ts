import { Vector3 } from "@babylonjs/core";
import type { ArcRotateCamera } from "@babylonjs/core";
import {
  CAMERA_HEIGHT,
  CAMERA_DISTANCE,
  CAMERA_LERP_SPEED,
  ZOOM_IN_DURATION,
  ZOOM_IN_START_DISTANCE,
} from "./constants.ts";
import type { GameState } from "./types.ts";
import { getForward } from "./sphere-math.ts";

let zoomElapsed = 0;

export function resetZoom(): void {
  zoomElapsed = 0;
}

export function updateCamera(
  camera: ArcRotateCamera,
  state: GameState,
  dt: number,
): void {
  const head = state.snake.segments[0];
  const normal = head.position.normalize();
  const forward = getForward(head.position, state.snake.headingQuat);

  const targetPos = head.position
    .add(normal.scale(CAMERA_HEIGHT))
    .subtract(forward.scale(CAMERA_DISTANCE));

  const lookTarget = head.position.clone();

  if (state.phase === "zoom-in") {
    zoomElapsed += dt;
    const t = Math.min(zoomElapsed / ZOOM_IN_DURATION, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3);

    const farPos = head.position
      .add(normal.scale(CAMERA_HEIGHT * 2))
      .subtract(forward.scale(ZOOM_IN_START_DISTANCE));

    const pos = Vector3.Lerp(farPos, targetPos, eased);
    camera.position = pos;
    camera.setTarget(lookTarget);

    if (t >= 1) {
      state.phase = "playing";
    }
    return;
  }

  // Smooth follow
  camera.position = Vector3.Lerp(
    camera.position,
    targetPos,
    Math.min(1, CAMERA_LERP_SPEED * dt),
  );
  camera.setTarget(lookTarget);
}
