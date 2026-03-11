## Development Mode

- This is a game written in Babylon.js, with TypeScript and Vite.
- Use pnpm commands for all package management tasks, including installing dependencies and running scripts
- Use composition over inheritance for game objects
- Keep game state in plain objects, separate from Babylon.js classes
- Extract magic numbers into named constants at file top
- Small, pure functions for game logic; Babylon.js methods only for rendering/input
- Avoid deep nesting; early return from functions
- TypeScript strict mode enabled
- No `any` types; use interfaces for game entities
- Keep update loops simple; delegate complex logic to separate functions
- Vec2 `{x, y}` maps to Babylon `(x, heightOffset, y)` on XZ plane
- All spatial constants in 3D units (pixel values ÷ 50)
- Delta-time in seconds for all movement and timers

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.