import type { InputState } from "./types.ts";

const keys: Record<string, boolean> = {};
const prevKeys: Record<string, boolean> = {};
const prevGp: Record<string, boolean> = {};

export function initInput(): void {
  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
  });
  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
}

function edgeTrigger(code: string): boolean {
  return keys[code] === true && prevKeys[code] !== true;
}

function gpEdge(id: string, pressed: boolean): boolean {
  const triggered = pressed && !prevGp[id];
  prevGp[id] = pressed;
  return triggered;
}

export function pollInput(): InputState {
  // Keyboard steering (2-axis)
  let steerX = 0;
  let steerY = 0;
  if (keys["KeyA"] || keys["ArrowLeft"]) steerX -= 1;
  if (keys["KeyD"] || keys["ArrowRight"]) steerX += 1;
  if (keys["KeyW"] || keys["ArrowUp"]) steerY += 1;
  if (keys["KeyS"] || keys["ArrowDown"]) steerY -= 1;

  let confirm = edgeTrigger("Space") || edgeTrigger("Enter");
  let pause = edgeTrigger("Escape");
  let menuUp = edgeTrigger("KeyW") || edgeTrigger("ArrowUp");
  let menuDown = edgeTrigger("KeyS") || edgeTrigger("ArrowDown");

  // Gamepad
  const gamepads = navigator.getGamepads();
  for (const gp of gamepads) {
    if (!gp) continue;

    // Left stick (both axes)
    const stickX = gp.axes[0] ?? 0;
    const stickY = gp.axes[1] ?? 0;
    if (Math.abs(stickX) > 0.15) steerX += stickX;
    if (Math.abs(stickY) > 0.15) steerY -= stickY; // Y axis inverted on gamepads

    // D-pad (buttons 12=up, 13=down, 14=left, 15=right)
    if (gp.buttons[14]?.pressed) steerX -= 1;
    if (gp.buttons[15]?.pressed) steerX += 1;
    if (gp.buttons[12]?.pressed) steerY += 1;
    if (gp.buttons[13]?.pressed) steerY -= 1;

    // Edge-triggered buttons
    if (gpEdge("a", gp.buttons[0]?.pressed === true)) confirm = true;
    if (gpEdge("start", gp.buttons[9]?.pressed === true)) pause = true;

    // D-pad edge triggers for menu navigation
    if (gpEdge("dpad_up", gp.buttons[12]?.pressed === true)) menuUp = true;
    if (gpEdge("dpad_down", gp.buttons[13]?.pressed === true)) menuDown = true;
  }

  // Clamp
  steerX = Math.max(-1, Math.min(1, steerX));
  steerY = Math.max(-1, Math.min(1, steerY));

  // Save previous key state
  Object.assign(prevKeys, { ...keys });

  return { steerX, steerY, confirm, pause, menuUp, menuDown };
}
