import { Vector3 } from "@babylonjs/core";
import {
  SEGMENT_SPACING,
  COLLISION_SKIP,
  COLLISION_THRESHOLD,
  TURN_RATE,
  PATH_HISTORY_MAX,
} from "./constants.ts";
import type { GameState, InputState } from "./types.ts";
import {
  advanceOnSphere,
  steerHeading,
  geodesicDistance,
} from "./sphere-math.ts";

export function updateSnake(state: GameState, input: InputState, dt: number): void {
  const snake = state.snake;

  // Steer
  if (Math.abs(input.steer) > 0.01) {
    snake.headingQuat = steerHeading(
      snake.headingQuat,
      snake.segments[0].position,
      TURN_RATE * input.steer * dt,
    );
  }

  // Advance head
  const moveDistance = snake.speed * dt;
  const newHeadPos = advanceOnSphere(
    snake.segments[0].position,
    snake.headingQuat,
    moveDistance,
  );
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
    const dist = geodesicDistance(head, state.snake.segments[i].position);
    if (dist < COLLISION_THRESHOLD) {
      return true;
    }
  }
  return false;
}
