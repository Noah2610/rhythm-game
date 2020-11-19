import { MapConfig } from "../map-config";
import dom from "./dom-helper";
import { loadMap } from "./map-loader";

const UPDATE_INTERVAL_MS = 1000.0 / 60.0;

let updateGameIntervalId: NodeJS.Timeout | null = null;
let gameContext: GameContext | null = null;

export interface GameContext {
    config: MapConfig;
}

export async function startGame() {
    gameContext = await loadMap("dev.json");
    dom.game.classList.remove("hidden");
    dom.game.focus();

    dom.game.addEventListener("keydown", onKeyDown);

    updateGameIntervalId = setInterval(updateGame, UPDATE_INTERVAL_MS);
}

export function stopGame() {
    gameContext = null;
    dom.game.removeEventListener("keydown", onKeyDown);
    if (updateGameIntervalId) {
        clearInterval(updateGameIntervalId);
    }
}

function updateGame() {}

function spawnBeat(beat: string) {
    if (!gameContext) {
        throw new Error("Game is not running, there is no GameContext.");
    }
    if (!gameContext.config.layout.keys.includes(beat)) {
        throw new Error(`Invalid beat key for layout: ${beat}`);
    }

    const spawnEl = dom.getBeatSpawn(beat);
    if (!spawnEl) {
        throw new Error(`No .beat-spawn element for beat key: ${beat}`);
    }

    const beatEl = document.createElement("div");
    beatEl.classList.add("beat");
    const beatInnerEl = document.createElement("div");
    beatInnerEl.innerText = beat;

    beatEl.append(beatInnerEl);
    spawnEl.appendChild(beatEl);
}

function onKeyDown(event: KeyboardEvent) {}
