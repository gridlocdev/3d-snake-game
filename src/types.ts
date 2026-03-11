import type { Vector3 } from "@babylonjs/core";

export type GamePhase =
  | "start-menu"
  | "controls-menu"
  | "zoom-in"
  | "playing"
  | "paused"
  | "game-over";

export interface SnakeSegment {
  position: Vector3;
  growthFactor: number;
}

export interface SnakeState {
  segments: SnakeSegment[];
  forward: Vector3;
  up: Vector3;
  speed: number;
  growQueue: number;
  pathHistory: Vector3[];
}

export interface Dot {
  position: Vector3;
  meshIndex: number;
}

export interface GameState {
  phase: GamePhase;
  snake: SnakeState;
  dots: Dot[];
  score: number;
  highScore: number;
  elapsedTime: number;
}

export interface InputState {
  steerX: number;
  steerY: number;
  confirm: boolean;
  pause: boolean;
  menuUp: boolean;
  menuDown: boolean;
}
