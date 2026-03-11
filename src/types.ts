import type { Quaternion, Vector3 } from "@babylonjs/core";

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
  headingQuat: Quaternion;
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
  steer: number;
  confirm: boolean;
  pause: boolean;
  menuUp: boolean;
  menuDown: boolean;
}
