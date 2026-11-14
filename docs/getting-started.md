# Getting started

You can play 3D Snake online, run it from source, or serve it from a Docker container.

## What you need

- A desktop browser with WebGL, and a keyboard or a gamepad. There are no touch controls.
- For running from source: [Node.js](https://nodejs.org) 20.19 or later and [pnpm](https://pnpm.io).

## Play online

Open [gridloc.dev/games/3d-snake](https://gridloc.dev/games/3d-snake). Nothing needs installing.

## Run it from source

From the project folder:

```bash
pnpm install   # install Babylon.js, TypeScript and Vite into node_modules
pnpm dev       # serve with hot reload on http://localhost:5173
```

Open the URL `pnpm dev` prints. To play the optimized build instead, run `pnpm build` and then `pnpm preview`.

## Run it in Docker

The `Dockerfile` builds the game and serves it with BusyBox `httpd` on port 8080:

```bash
docker build -t 3d-snake .
docker run --rm -p 8080:8080 3d-snake
```

Then open `http://localhost:8080`.

## First run

The game opens on the start menu. Choose **Play** to start, or **Controls** to see the keys. After you press **Play**, the camera flies in behind the snake for two seconds, then you're in control. [How to play](features.md) explains the rules.

Your high score shows on the **Game Over** screen. It lasts until you reload the page; nothing is saved.
