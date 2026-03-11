import {
  DOT_COUNT,
  DOT_EAT_DISTANCE,
  GROW_PER_EAT,
  DOT_MAGNET_RADIUS,
  DOT_MAGNET_ACCEL,
} from "./constants.ts";
import type { GameState } from "./types.ts";
import { randomPointInSphere } from "./sphere-math.ts";

// Per-dot magnet velocity (speed toward head)
const magnetSpeed: number[] = [];

export function spawnDots(state: GameState): void {
  while (state.dots.length < DOT_COUNT) {
    state.dots.push({
      position: randomPointInSphere(),
      meshIndex: state.dots.length,
    });
    magnetSpeed.push(0);
  }
}

export function updateDots(state: GameState, dt: number): number {
  const head = state.snake.segments[0].position;
  let eaten = 0;

  for (let i = state.dots.length - 1; i >= 0; i--) {
    const toHead = head.subtract(state.dots[i].position);
    const dist = toHead.length();

    if (dist < DOT_EAT_DISTANCE) {
      // Eaten
      state.dots[i] = {
        position: randomPointInSphere(),
        meshIndex: state.dots[i].meshIndex,
      };
      magnetSpeed[i] = 0;
      state.score++;
      state.snake.growQueue += GROW_PER_EAT;
      eaten++;
    } else if (dist < DOT_MAGNET_RADIUS) {
      // Inside magnet zone: accelerate toward head
      // Acceleration increases as dot gets closer (inverse of distance ratio)
      const closeness = 1 - dist / DOT_MAGNET_RADIUS;
      magnetSpeed[i] += DOT_MAGNET_ACCEL * closeness * dt;
      const moveAmount = magnetSpeed[i] * dt;
      const dir = toHead.normalize();
      state.dots[i].position = state.dots[i].position.add(
        dir.scale(Math.min(moveAmount, dist - DOT_EAT_DISTANCE * 0.5)),
      );
    } else {
      // Outside magnet zone: reset speed
      magnetSpeed[i] = 0;
    }
  }

  return eaten;
}
