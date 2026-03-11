import { Quaternion, Vector3 } from "@babylonjs/core";
import {
  SPHERE_RADIUS,
  SNAKE_SPEED,
  INITIAL_SEGMENTS,
  SEGMENT_SPACING,
} from "./constants.ts";
import type { GameState, SnakeSegment } from "./types.ts";
import { advanceOnSphere } from "./sphere-math.ts";

export function createInitialState(): GameState {
  const headPos = new Vector3(0, SPHERE_RADIUS, 0);
  const headingQuat = Quaternion.Identity();

  const segments: SnakeSegment[] = [
    { position: headPos.clone(), growthFactor: 1 },
  ];

  // Place initial body segments behind the head
  const pathHistory: Vector3[] = [headPos.clone()];
  // Build a backwards path for initial segments
  const backQuat = Quaternion.RotationAxis(Vector3.Right(), Math.PI);
  let pos = headPos.clone();
  for (let i = 1; i < INITIAL_SEGMENTS; i++) {
    pos = advanceOnSphere(pos, backQuat, SEGMENT_SPACING);
    segments.push({ position: pos.clone(), growthFactor: 1 });
    pathHistory.push(pos.clone());
  }

  return {
    phase: "start-menu",
    snake: {
      segments,
      headingQuat,
      speed: SNAKE_SPEED,
      growQueue: 0,
      pathHistory,
    },
    dots: [],
    score: 0,
    highScore: 0,
    elapsedTime: 0,
  };
}

export function resetState(state: GameState): void {
  const fresh = createInitialState();
  state.snake = fresh.snake;
  state.dots = [];
  state.score = 0;
  state.elapsedTime = 0;
}
