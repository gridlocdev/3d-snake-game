import { Vector3 } from "@babylonjs/core";
import { DOT_COUNT, DOT_EAT_DISTANCE, GROW_PER_EAT } from "./constants.ts";
import type { GameState } from "./types.ts";
import { randomPointInSphere } from "./sphere-math.ts";

export function spawnDots(state: GameState): void {
  while (state.dots.length < DOT_COUNT) {
    state.dots.push({
      position: randomPointInSphere(),
      meshIndex: state.dots.length,
    });
  }
}

export function checkDotCollisions(state: GameState): number {
  const head = state.snake.segments[0].position;
  let eaten = 0;
  for (let i = state.dots.length - 1; i >= 0; i--) {
    const dist = Vector3.Distance(head, state.dots[i].position);
    if (dist < DOT_EAT_DISTANCE) {
      state.dots[i] = {
        position: randomPointInSphere(),
        meshIndex: state.dots[i].meshIndex,
      };
      state.score++;
      state.snake.growQueue += GROW_PER_EAT;
      eaten++;
    }
  }
  return eaten;
}
