import { BeatSpawnConfig, MapConfig } from "../map-config";
import dom from "./dom-helper";
import { loadMap } from "./map-loader";

const UPDATE_INTERVAL_MS = 1000.0 / 60.0;

let updateGameIntervalId: NodeJS.Timeout | null = null;
let gameContext: GameContext | null = null;

export interface GameContext {
    config: MapConfig;
    upcomingBeats?: BeatSpawnConfig[];
}

export async function startGame() {
    gameContext = await loadMap("dev.json");
    dom.game.classList.remove("hidden");
    dom.game.focus();
    dom.game.addEventListener("keydown", onKeyDown);

    gameContext.upcomingBeats = [...gameContext.config.beats];

    const songEl = dom.getSong();
    if (!songEl) {
        throw new Error("The current map has no song.");
    }
    songEl.play();

    updateGameIntervalId = setInterval(updateGame, UPDATE_INTERVAL_MS);
}

export function stopGame() {
    gameContext = null;
    dom.game.removeEventListener("keydown", onKeyDown);
    if (updateGameIntervalId) {
        clearInterval(updateGameIntervalId);
    }
}

function updateGame() {
    if (!gameContext) {
        throw new Error("GameContext has to exist in `udpateGame()` function.");
    }
    if (!gameContext.upcomingBeats) {
        throw new Error(
            "GameContext's `upcomingBeats` should exist in `updateGame()` function",
        );
    }

    const time = dom.song.currentTime * 1000.0;

    const beatIndexesToRemove = [];

    for (let i = 0; i < gameContext.upcomingBeats.length; i++) {
        const nextBeat = gameContext.upcomingBeats[i];
        if (time >= nextBeat.time) {
            spawnBeat(nextBeat.key);
            beatIndexesToRemove.push(i);
        }
    }

    for (const idx of beatIndexesToRemove.reverse()) {
        gameContext.upcomingBeats.splice(idx, 1);
    }
}

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
