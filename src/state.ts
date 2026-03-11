import { Vector3 } from "@babylonjs/core";
import {
  SNAKE_SPEED,
  INITIAL_SEGMENTS,
  SEGMENT_SPACING,
} from "./constants.ts";
import type { GameState, SnakeSegment } from "./types.ts";

export function createInitialState(): GameState {
  // Start near the center, heading in +Z direction
  const headPos = new Vector3(0, 0, 0);
  const forward = new Vector3(0, 0, 1).normalize();
  const up = new Vector3(0, 1, 0);

  const segments: SnakeSegment[] = [
    { position: headPos.clone(), growthFactor: 1 },
  ];

  // Place initial body segments behind the head
  const pathHistory: Vector3[] = [headPos.clone()];
  for (let i = 1; i < INITIAL_SEGMENTS; i++) {
    const pos = headPos.subtract(forward.scale(i * SEGMENT_SPACING));
    segments.push({ position: pos.clone(), growthFactor: 1 });
    pathHistory.push(pos.clone());
  }

  return {
    phase: "start-menu",
    snake: {
      segments,
      forward,
      up,
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
