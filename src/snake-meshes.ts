import {
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
} from "@babylonjs/core";
import type { Scene, Mesh, DynamicTexture } from "@babylonjs/core";
import { HEAD_RADIUS, BODY_RADIUS } from "./constants.ts";
import type { GameState } from "./types.ts";

let headMesh: Mesh;
const bodyMeshes: Mesh[] = [];
let bodyMat: StandardMaterial;

export function createSnakeMeshes(scene: Scene, faceTex: DynamicTexture): void {
  headMesh = MeshBuilder.CreateSphere(
    "snakeHead",
    { diameter: HEAD_RADIUS * 2, segments: 12 },
    scene,
  );
  const headMat = new StandardMaterial("headMat", scene);
  headMat.diffuseColor = new Color3(0.18, 0.8, 0.25);
  headMat.emissiveColor = new Color3(0.05, 0.2, 0.05);
  headMat.diffuseTexture = faceTex;
  headMesh.material = headMat;

  bodyMat = new StandardMaterial("bodyMat", scene);
  bodyMat.diffuseColor = new Color3(0.15, 0.65, 0.2);
  bodyMat.emissiveColor = new Color3(0.03, 0.12, 0.03);
}

function ensureBodyMeshCount(count: number, scene: Scene): void {
  while (bodyMeshes.length < count) {
    const idx = bodyMeshes.length;
    const mesh = MeshBuilder.CreateSphere(
      `body_${idx}`,
      { diameter: BODY_RADIUS * 2, segments: 8 },
      scene,
    );
    mesh.material = bodyMat;
    bodyMeshes.push(mesh);
  }
  for (let i = count; i < bodyMeshes.length; i++) {
    bodyMeshes[i].setEnabled(false);
  }
}

export function syncSnakeMeshes(state: GameState, scene: Scene): void {
  const segments = state.snake.segments;

  // Head position + orientation
  headMesh.position = segments[0].position.clone();
  const forward = state.snake.forward;
  const lookTarget = headMesh.position.add(forward);
  headMesh.lookAt(lookTarget);

  // Body segments
  const bodyCount = segments.length - 1;
  ensureBodyMeshCount(bodyCount, scene);

  for (let i = 0; i < bodyCount; i++) {
    const seg = segments[i + 1];
    bodyMeshes[i].position = seg.position.clone();
    bodyMeshes[i].setEnabled(true);

    const scale = BODY_RADIUS * 2 * (0.9 + seg.growthFactor * 0.1);
    const s = scale / (BODY_RADIUS * 2);
    bodyMeshes[i].scaling = new Vector3(s, s, s);
  }
}

export function setSnakeVisible(visible: boolean): void {
  headMesh.setEnabled(visible);
  for (const m of bodyMeshes) {
    m.setEnabled(visible && m.isEnabled());
  }
}
