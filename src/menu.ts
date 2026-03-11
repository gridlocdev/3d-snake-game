import {
  AdvancedDynamicTexture,
  TextBlock,
  StackPanel,
  Control,
  Rectangle,
} from "@babylonjs/gui";
import type { GameState, InputState } from "./types.ts";

let gui: AdvancedDynamicTexture;
let startPanel: StackPanel;
let controlsPanel: StackPanel;
let pausePanel: StackPanel;
let gameOverPanel: StackPanel;
let scoreText: TextBlock;
let gameOverScoreText: TextBlock;
let menuSelection = 0;
const menuButtons: Rectangle[][] = [[], [], [], []]; // per panel

export function createGUI(
  guiTexture: AdvancedDynamicTexture,
): void {
  gui = guiTexture;

  // Score display (during gameplay)
  scoreText = new TextBlock("score", "Score: 0");
  scoreText.color = "white";
  scoreText.fontSize = 28;
  scoreText.fontFamily = "monospace";
  scoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  scoreText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  scoreText.paddingRight = "20px";
  scoreText.paddingTop = "20px";
  scoreText.isVisible = false;
  gui.addControl(scoreText);

  // Start Menu
  startPanel = createPanel();
  addTitle(startPanel, "3D SNAKE");
  menuButtons[0].push(addButton(startPanel, "Play"));
  menuButtons[0].push(addButton(startPanel, "Controls"));
  gui.addControl(startPanel);

  // Controls Menu
  controlsPanel = createPanel();
  addTitle(controlsPanel, "CONTROLS");
  addLabel(controlsPanel, "W/A/S/D  or  Left Stick — Steer");
  addLabel(controlsPanel, "D-pad — Steer");
  addLabel(controlsPanel, "Space  or  A Button — Confirm");
  addLabel(controlsPanel, "Escape  or  Start — Pause");
  addLabel(controlsPanel, "");
  menuButtons[1].push(addButton(controlsPanel, "Back"));
  gui.addControl(controlsPanel);

  // Pause Menu
  pausePanel = createPanel();
  addTitle(pausePanel, "PAUSED");
  menuButtons[2].push(addButton(pausePanel, "Resume"));
  menuButtons[2].push(addButton(pausePanel, "Quit to Menu"));
  gui.addControl(pausePanel);

  // Game Over
  gameOverPanel = createPanel();
  addTitle(gameOverPanel, "GAME OVER");
  gameOverScoreText = new TextBlock("goScore", "Score: 0");
  gameOverScoreText.color = "#ff6666";
  gameOverScoreText.fontSize = 36;
  gameOverScoreText.fontFamily = "monospace";
  gameOverScoreText.height = "50px";
  gameOverPanel.addControl(gameOverScoreText);
  menuButtons[3].push(addButton(gameOverPanel, "Play Again"));
  menuButtons[3].push(addButton(gameOverPanel, "Main Menu"));
  gui.addControl(gameOverPanel);

  hideAll();
}

function createPanel(): StackPanel {
  const panel = new StackPanel("panel");
  panel.width = "400px";
  panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  return panel;
}

function addTitle(panel: StackPanel, text: string): void {
  const tb = new TextBlock("title", text);
  tb.color = "#44ff66";
  tb.fontSize = 48;
  tb.fontFamily = "monospace";
  tb.fontWeight = "bold";
  tb.height = "80px";
  tb.paddingBottom = "20px";
  panel.addControl(tb);
}

function addLabel(panel: StackPanel, text: string): void {
  const tb = new TextBlock("label", text);
  tb.color = "#cccccc";
  tb.fontSize = 20;
  tb.fontFamily = "monospace";
  tb.height = "35px";
  panel.addControl(tb);
}

function addButton(panel: StackPanel, text: string): Rectangle {
  const rect = new Rectangle("btn");
  rect.width = "300px";
  rect.height = "50px";
  rect.cornerRadius = 8;
  rect.color = "#44ff66";
  rect.thickness = 2;
  rect.background = "rgba(0, 0, 0, 0.5)";
  rect.paddingTop = "5px";
  rect.paddingBottom = "5px";

  const tb = new TextBlock("btnText", text);
  tb.color = "white";
  tb.fontSize = 24;
  tb.fontFamily = "monospace";
  rect.addControl(tb);

  panel.addControl(rect);
  return rect;
}

function hideAll(): void {
  startPanel.isVisible = false;
  controlsPanel.isVisible = false;
  pausePanel.isVisible = false;
  gameOverPanel.isVisible = false;
  scoreText.isVisible = false;
}

function highlightButton(panelIdx: number, idx: number): void {
  const buttons = menuButtons[panelIdx];
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].background =
      i === idx ? "rgba(68, 255, 102, 0.3)" : "rgba(0, 0, 0, 0.5)";
  }
}

type MenuAction = "play" | "controls" | "back" | "resume" | "quit" | "play-again" | "main-menu" | null;

export function updateMenu(
  state: GameState,
  input: InputState,
): MenuAction {
  hideAll();
  let action: MenuAction = null;

  switch (state.phase) {
    case "start-menu": {
      startPanel.isVisible = true;
      const max = menuButtons[0].length;
      if (input.menuDown) menuSelection = (menuSelection + 1) % max;
      if (input.menuUp) menuSelection = (menuSelection - 1 + max) % max;
      highlightButton(0, menuSelection);
      if (input.confirm) {
        action = menuSelection === 0 ? "play" : "controls";
        menuSelection = 0;
      }
      break;
    }
    case "controls-menu": {
      controlsPanel.isVisible = true;
      highlightButton(1, 0);
      if (input.confirm || input.pause) {
        action = "back";
        menuSelection = 0;
      }
      break;
    }
    case "paused": {
      pausePanel.isVisible = true;
      const max = menuButtons[2].length;
      if (input.menuDown) menuSelection = (menuSelection + 1) % max;
      if (input.menuUp) menuSelection = (menuSelection - 1 + max) % max;
      highlightButton(2, menuSelection);
      if (input.confirm) {
        action = menuSelection === 0 ? "resume" : "quit";
        menuSelection = 0;
      }
      if (input.pause) {
        action = "resume";
        menuSelection = 0;
      }
      break;
    }
    case "game-over": {
      gameOverPanel.isVisible = true;
      gameOverScoreText.text = `Score: ${state.score}  |  High: ${state.highScore}`;
      const max = menuButtons[3].length;
      if (input.menuDown) menuSelection = (menuSelection + 1) % max;
      if (input.menuUp) menuSelection = (menuSelection - 1 + max) % max;
      highlightButton(3, menuSelection);
      if (input.confirm) {
        action = menuSelection === 0 ? "play-again" : "main-menu";
        menuSelection = 0;
      }
      break;
    }
    case "playing":
    case "zoom-in": {
      scoreText.isVisible = true;
      scoreText.text = `Score: ${state.score}`;
      break;
    }
  }

  return action;
}
