import { Vector3, Quaternion } from "@babylonjs/core";
import {
  SEGMENT_SPACING,
  COLLISION_SKIP,
  COLLISION_THRESHOLD,
  TURN_RATE,
  PATH_HISTORY_MAX,
  SPHERE_RADIUS,
} from "./constants.ts";
import type { GameState, InputState } from "./types.ts";

export function updateSnake(state: GameState, input: InputState, dt: number): void {
  const snake = state.snake;

  // Compute the right vector from forward and up
  const right = Vector3.Cross(snake.forward, snake.up).normalize();

  // Pitch: rotate forward and up around right axis (W = pitch up, S = pitch down)
  if (Math.abs(input.steerY) > 0.01) {
    const pitchAngle = -input.steerY * TURN_RATE * dt;
    const pitchQuat = Quaternion.RotationAxis(right, pitchAngle);
    snake.forward.rotateByQuaternionAroundPointToRef(pitchQuat, Vector3.Zero(), snake.forward);
    snake.up.rotateByQuaternionAroundPointToRef(pitchQuat, Vector3.Zero(), snake.up);
    snake.forward.normalize();
    snake.up.normalize();
  }

  // Yaw: rotate forward and up around up axis (A = left, D = right)
  if (Math.abs(input.steerX) > 0.01) {
    const yawAngle = input.steerX * TURN_RATE * dt;
    const yawQuat = Quaternion.RotationAxis(snake.up, yawAngle);
    snake.forward.rotateByQuaternionAroundPointToRef(yawQuat, Vector3.Zero(), snake.forward);
    snake.forward.normalize();
    // Up stays the same for yaw (rotation is around up axis)
  }

  // Re-orthogonalize to prevent drift
  const newRight = Vector3.Cross(snake.forward, snake.up).normalize();
  snake.up = Vector3.Cross(newRight, snake.forward).normalize();

  // Advance head in forward direction (straight line)
  const moveDistance = snake.speed * dt;
  const newHeadPos = snake.segments[0].position.add(
    snake.forward.scale(moveDistance),
  );

  // Boundary: clamp to inside sphere
  if (newHeadPos.length() >= SPHERE_RADIUS) {
    state.highScore = Math.max(state.highScore, state.score);
    state.phase = "game-over";
    return;
  }

  snake.segments[0].position = newHeadPos;

  // Push to path history
  snake.pathHistory.unshift(newHeadPos.clone());

  // Position body segments along path history
  let accumDist = 0;
  let histIdx = 0;
  for (let seg = 1; seg < snake.segments.length; seg++) {
    const targetDist = seg * SEGMENT_SPACING;
    while (histIdx < snake.pathHistory.length - 1 && accumDist < targetDist) {
      const d = Vector3.Distance(
        snake.pathHistory[histIdx],
        snake.pathHistory[histIdx + 1],
      );
      if (accumDist + d >= targetDist) {
        const t = (targetDist - accumDist) / d;
        snake.segments[seg].position = Vector3.Lerp(
          snake.pathHistory[histIdx],
          snake.pathHistory[histIdx + 1],
          t,
        );
        break;
      }
      accumDist += d;
      histIdx++;
    }
  }

  // Handle growth
  if (snake.growQueue > 0) {
    const lastSeg = snake.segments[snake.segments.length - 1];
    snake.segments.push({
      position: lastSeg.position.clone(),
      growthFactor: 1,
    });
    snake.growQueue--;
  }

  // Trim path history
  if (snake.pathHistory.length > PATH_HISTORY_MAX) {
    snake.pathHistory.length = PATH_HISTORY_MAX;
  }
}

export function checkSelfCollision(state: GameState): boolean {
  const head = state.snake.segments[0].position;
  for (let i = COLLISION_SKIP; i < state.snake.segments.length; i++) {
    const dist = Vector3.Distance(head, state.snake.segments[i].position);
    if (dist < COLLISION_THRESHOLD) {
      return true;
    }
  }
  return false;
}
