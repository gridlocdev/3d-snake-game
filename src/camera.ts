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
  const forward = state.snake.forward;
  const up = state.snake.up;

  // Camera sits behind and above the snake
  const targetPos = head.position
    .subtract(forward.scale(CAMERA_DISTANCE))
    .add(up.scale(CAMERA_HEIGHT));

  const lookTarget = head.position.add(forward.scale(1));

  if (state.phase === "zoom-in") {
    zoomElapsed += dt;
    const t = Math.min(zoomElapsed / ZOOM_IN_DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3);

    const farPos = head.position
      .subtract(forward.scale(ZOOM_IN_START_DISTANCE))
      .add(up.scale(CAMERA_HEIGHT * 2));

    const pos = Vector3.Lerp(farPos, targetPos, eased);
    camera.position = pos;
    camera.setTarget(lookTarget);
    camera.upVector = up.clone();

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
  camera.upVector = Vector3.Lerp(
    camera.upVector,
    up,
    Math.min(1, CAMERA_LERP_SPEED * dt),
  );
}
