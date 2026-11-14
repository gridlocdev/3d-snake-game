# Development

3D Snake is written in TypeScript on [Babylon.js](https://www.babylonjs.com), and [Vite](https://vite.dev) serves and bundles it. The rules in `AGENTS.md` at the repository root apply to everyone working on it.

## Getting set up

You need [Node.js](https://nodejs.org) 20.19 or later and [pnpm](https://pnpm.io). Use pnpm for every package task.

```bash
pnpm install   # install Babylon.js, TypeScript, Vite, ESLint and Prettier into node_modules
pnpm dev       # serve with hot reload on http://localhost:5173
pnpm build     # type-check with tsc, then bundle into dist/
pnpm preview   # serve the dist/ build
```

There is no `justfile`. `dist/` is ignored by git.

## Checking your work

The project has no test suite and no separate check script. Run the type checker after every change:

```bash
pnpm exec tsc   # type-check src/ without writing files (tsconfig.json sets noEmit)
pnpm build      # the same type check, then a production bundle
```

## Layout

```
index.html            # The page: a full-window canvas that loads src/main.ts.
src/
├── main.ts           # Creates the engine, scene, meshes and GUI, then runs the render loop.
├── game-loop.ts      # One frame: menu actions, then the update for the current phase.
├── state.ts          # The game state as a plain object: new game and reset.
├── types.ts          # GameState, InputState and the game phases.
├── constants.ts      # Speeds, sizes, dot counts and camera settings.
├── input.ts          # Keyboard and gamepad, read into one InputState each frame.
├── snake.ts          # Steering, movement, growth, and wall and self collisions.
├── dots.ts           # Spawning dots, the pull toward the head, eating.
├── sphere-math.ts    # Random points inside the sphere for new dots.
├── camera.ts         # The follow camera and the zoom-in at the start of a run.
├── scene-setup.ts    # The scene, lights, the sphere's wall and the starfield.
├── snake-meshes.ts   # Babylon meshes for the snake, kept in sync with the state.
├── dot-meshes.ts     # Babylon meshes for the dots.
├── face-texture.ts   # The snake's face, drawn on a canvas texture.
├── menu.ts           # Start, controls, pause and game-over menus, and the score display.
└── style.css         # Page styles.
Dockerfile            # Builds the game and serves dist/ on port 8080.
```

## Deploying

`vite.config.ts` sets `base: './'`, so the built files use relative paths and the game works from a subfolder such as `/games/3d-snake`. Upload the contents of `dist/` after `pnpm build`, or build and run the Docker image:

```bash
docker build -t 3d-snake .
docker run --rm -p 8080:8080 3d-snake
```
