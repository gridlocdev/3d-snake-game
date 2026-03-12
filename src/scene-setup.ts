import {
  Scene,
  HemisphericLight,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  Vector3,
  ParticleSystem,
  Texture,
  ArcRotateCamera,
} from "@babylonjs/core";
import type { Engine, Mesh } from "@babylonjs/core";
import { SPHERE_RADIUS, STARFIELD_RADIUS } from "./constants.ts";

export function createScene(engine: Engine, _canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.01, 0.01, 0.03, 1);

  const camera = new ArcRotateCamera(
    "cam",
    0,
    0,
    20,
    Vector3.Zero(),
    scene,
  );
  camera.minZ = 0.1;

  // Lighting: place light inside the sphere so the interior is lit
  const hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.6;
  hemiLight.diffuse = new Color3(0.8, 0.85, 1);

  const pointLight = new PointLight("point", new Vector3(0, 0, 0), scene);
  pointLight.intensity = 0.8;
  pointLight.diffuse = new Color3(0.9, 0.9, 1);

  return scene;
}

export function createWorldSphere(scene: Scene): Mesh {
  // Exclude the world sphere from the point light to avoid glare
  const pointLight = scene.getLightByName("point") as PointLight;

  const sphere = MeshBuilder.CreateSphere(
    "world",
    { diameter: SPHERE_RADIUS * 2, segments: 32, sideOrientation: 1 },
    scene,
  );
  const mat = new StandardMaterial("worldMat", scene);
  mat.diffuseColor = new Color3(0.08, 0.12, 0.2);
  mat.alpha = 0.35;
  mat.specularColor = Color3.Black();
  mat.emissiveColor = new Color3(0.03, 0.05, 0.1);
  mat.backFaceCulling = true;
  sphere.material = mat;
  if (pointLight) {
    pointLight.excludedMeshes.push(sphere);
  }

  // Wireframe overlay (also flipped for interior view)
  const wire = MeshBuilder.CreateSphere(
    "wireframe",
    { diameter: SPHERE_RADIUS * 1.995, segments: 16, sideOrientation: 1 },
    scene,
  );
  const wireMat = new StandardMaterial("wireMat", scene);
  wireMat.wireframe = true;
  wireMat.emissiveColor = new Color3(0.15, 0.25, 0.4);
  wireMat.disableLighting = true;
  wireMat.alpha = 0.3;
  wire.material = wireMat;

  return sphere;
}

export function createStarfield(scene: Scene): void {
  const ps = new ParticleSystem("stars", STARFIELD_RADIUS * 30, scene);
  const starTex = new Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAADlJREFUKFNjZEAC/xkY/jMwMDAyIAsgCzAxoEhgKGBkQFbAwIihAFkBIyOqAgZGDAUMjOgKkO0HABqiCA1ZJp3jAAAAAElFTkSuQmCC", scene);
  ps.particleTexture = starTex;
  ps.emitter = Vector3.Zero();
  ps.createSphereEmitter(STARFIELD_RADIUS);
  ps.minSize = 0.05;
  ps.maxSize = 0.15;
  ps.minLifeTime = 999999;
  ps.maxLifeTime = 999999;
  ps.emitRate = 0;
  ps.manualEmitCount = 2000;
  ps.color1 = new Color4(1, 1, 1, 1);
  ps.color2 = new Color4(0.8, 0.9, 1, 0.8);
  ps.minEmitPower = 0;
  ps.maxEmitPower = 0;
  ps.updateSpeed = 0;
  starTex.onLoadObservable.addOnce(() => {
    ps.start();
  });
}
