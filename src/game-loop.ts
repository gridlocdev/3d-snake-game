import type { Scene, ArcRotateCamera } from "@babylonjs/core";
import type { GameState, InputState } from "./types.ts";
import { updateSnake, checkSelfCollision } from "./snake.ts";
import { updateDots, spawnDots } from "./dots.ts";
import { updateCamera, resetZoom } from "./camera.ts";
import { syncSnakeMeshes, setSnakeVisible } from "./snake-meshes.ts";
import { updateMenu } from "./menu.ts";
import { syncDotMeshes } from "./dot-meshes.ts";
import { resetState } from "./state.ts";

export function gameLoop(
  state: GameState,
  input: InputState,
  dt: number,
  scene: Scene,
  camera: ArcRotateCamera,
): void {
  const action = updateMenu(state, input);

  // Handle menu actions
  if (action) {
    switch (action) {
      case "play":
      case "play-again":
        resetState(state);
        spawnDots(state);
        syncDotMeshes(state, scene);
        state.phase = "zoom-in";
        resetZoom();
        setSnakeVisible(true);
        break;
      case "controls":
        state.phase = "controls-menu";
        break;
      case "back":
      case "main-menu":
      case "quit":
        state.phase = "start-menu";
        setSnakeVisible(false);
        break;
      case "resume":
        state.phase = "playing";
        break;
    }
  }

  // Handle pause input during gameplay
  if (state.phase === "playing" && input.pause) {
    state.phase = "paused";
    return;
  }

  // Phase-specific updates
  switch (state.phase) {
    case "zoom-in":
      updateCamera(camera, state, dt);
      syncSnakeMeshes(state, scene);
      break;
    case "playing":
      state.elapsedTime += dt;
      updateSnake(state, input, dt);
      updateDots(state, dt);
      if (checkSelfCollision(state)) {
        state.highScore = Math.max(state.highScore, state.score);
        state.phase = "game-over";
      }
      updateCamera(camera, state, dt);
      syncSnakeMeshes(state, scene);
      syncDotMeshes(state, scene);
      break;
    case "start-menu":
    case "controls-menu":
    case "paused":
    case "game-over":
      // Camera stays put, no game updates
      break;
  }
}
