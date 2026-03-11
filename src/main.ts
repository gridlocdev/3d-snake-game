import "./style.css";
import { Engine, ArcRotateCamera } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { createScene, createWorldSphere, createStarfield } from "./scene-setup.ts";
import { createInitialState } from "./state.ts";
import { initInput, pollInput } from "./input.ts";
import { createFaceTexture } from "./face-texture.ts";
import { createSnakeMeshes, setSnakeVisible } from "./snake-meshes.ts";
import { createDotMaterial } from "./dot-meshes.ts";
import { createGUI } from "./menu.ts";
import { gameLoop } from "./game-loop.ts";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = createScene(engine, canvas);
const camera = scene.activeCamera as ArcRotateCamera;

// World
createWorldSphere(scene);
createStarfield(scene);

// Snake meshes
const faceTex = createFaceTexture(scene);
createSnakeMeshes(scene, faceTex);
setSnakeVisible(false);

// Dot meshes
createDotMaterial(scene);

// GUI
const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
createGUI(guiTexture);

// Game state
const state = createInitialState();

// Input
initInput();

// Render loop
engine.runRenderLoop(() => {
  const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
  const input = pollInput();
  gameLoop(state, input, dt, scene, camera);
  scene.render();
});

// Resize
window.addEventListener("resize", () => {
  engine.resize();
});
