import type { InputState } from "./types.ts";

const keys: Record<string, boolean> = {};
const prevKeys: Record<string, boolean> = {};

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

export function pollInput(): InputState {
  let steer = 0;
  if (keys["KeyA"] || keys["ArrowLeft"]) steer -= 1;
  if (keys["KeyD"] || keys["ArrowRight"]) steer += 1;

  const confirm = edgeTrigger("Space") || edgeTrigger("Enter");
  const pause = edgeTrigger("Escape");
  const menuUp = edgeTrigger("KeyW") || edgeTrigger("ArrowUp");
  const menuDown = edgeTrigger("KeyS") || edgeTrigger("ArrowDown");

  // Gamepad
  const gamepads = navigator.getGamepads();
  for (const gp of gamepads) {
    if (!gp) continue;
    // Left stick X axis
    const stickX = gp.axes[0] ?? 0;
    if (Math.abs(stickX) > 0.15) steer += stickX;
    // D-pad (buttons 14=left, 15=right, 12=up, 13=down)
    if (gp.buttons[14]?.pressed) steer -= 1;
    if (gp.buttons[15]?.pressed) steer += 1;
  }
  steer = Math.max(-1, Math.min(1, steer));

  // Gamepad edge-triggered buttons
  // We handle these simply by OR-ing with keyboard
  for (const gp of gamepads) {
    if (!gp) continue;
    if (gp.buttons[0]?.pressed) {
      // A / Cross
      if (!prevKeys["gp_a"]) {
        prevKeys["gp_a"] = true;
        return {
          steer,
          confirm: true,
          pause,
          menuUp: menuUp || gp.buttons[12]?.pressed === true,
          menuDown: menuDown || gp.buttons[13]?.pressed === true,
        };
      }
    } else {
      prevKeys["gp_a"] = false;
    }
    if (gp.buttons[9]?.pressed) {
      // Start
      if (!prevKeys["gp_start"]) {
        prevKeys["gp_start"] = true;
        Object.assign(prevKeys, { ...keys });
        return { steer, confirm, pause: true, menuUp, menuDown };
      }
    } else {
      prevKeys["gp_start"] = false;
    }
  }

  // Save previous key state
  Object.assign(prevKeys, { ...keys });

  return { steer, confirm, pause, menuUp, menuDown };
}
