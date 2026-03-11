import {
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
} from "@babylonjs/core";
import type { Scene, Mesh } from "@babylonjs/core";
import {
  DOT_RADIUS,
  DOT_BOB_SPEED,
  DOT_BOB_HEIGHT,
} from "./constants.ts";
import type { GameState } from "./types.ts";

const dotMeshes: Mesh[] = [];
let dotMat: StandardMaterial;
let elapsed = 0;

export function createDotMaterial(scene: Scene): void {
  dotMat = new StandardMaterial("dotMat", scene);
  dotMat.emissiveColor = new Color3(1, 0.9, 0.2);
  dotMat.diffuseColor = new Color3(1, 0.85, 0.1);
  dotMat.specularColor = new Color3(1, 1, 0.5);
}

export function syncDotMeshes(state: GameState, scene: Scene, dt?: number): void {
  if (dt !== undefined) elapsed += dt;

  while (dotMeshes.length < state.dots.length) {
    const mesh = MeshBuilder.CreateSphere(
      `dot_${dotMeshes.length}`,
      { diameter: DOT_RADIUS * 2, segments: 8 },
      scene,
    );
    mesh.material = dotMat;
    dotMeshes.push(mesh);
  }

  for (let i = state.dots.length; i < dotMeshes.length; i++) {
    dotMeshes[i].setEnabled(false);
  }

  for (let i = 0; i < state.dots.length; i++) {
    const dot = state.dots[i];
    // Bob gently in place (use a consistent axis for bobbing)
    const bob = Math.sin(elapsed * DOT_BOB_SPEED + i * 1.5) * DOT_BOB_HEIGHT;
    dotMeshes[i].position = dot.position.add(new Vector3(0, bob, 0));
    dotMeshes[i].setEnabled(true);

    const pulse = 0.8 + 0.2 * Math.sin(elapsed * 3 + i);
    dotMeshes[i].scaling = new Vector3(pulse, pulse, pulse);
  }
}
