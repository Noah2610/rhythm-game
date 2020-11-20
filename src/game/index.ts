import { BeatSettings, BeatSpawnConfig, MapConfig } from "../map-config";
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

    document.addEventListener("keydown", onKeyDown);

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
    document.removeEventListener("keydown", onKeyDown);

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

    const time = dom.song.currentTime * 1000;

    const beatIndexesToRemove = [];

    for (let i = 0; i < gameContext.upcomingBeats.length; i++) {
        const nextBeat = gameContext.upcomingBeats[i];
        const fallDuration =
            nextBeat.settings?.beatFallDuration ||
            gameContext.config.beatSettings.beatFallDuration;
        if (time >= nextBeat.time - fallDuration) {
            spawnBeat(nextBeat.key, nextBeat.settings);
            beatIndexesToRemove.push(i);
        }
    }

    for (const idx of beatIndexesToRemove.reverse()) {
        gameContext.upcomingBeats.splice(idx, 1);
    }
}

function spawnBeat(beat: string, settings?: Partial<BeatSettings>) {
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

    if (settings?.beatFallDuration) {
        beatEl.style.setProperty(
            "animation-duration",
            `${settings.beatFallDuration}ms`,
        );
    }

    beatEl.onanimationend = (event) => {
        switch (event.animationName) {
            case "beatFall":
                beatEl.classList.add("beat--despawn");
                break;
            case "beatDespawn":
                beatEl.remove();
        }
    };

    const beatInnerEl = document.createElement("div");
    beatInnerEl.innerText = beat;

    beatEl.append(beatInnerEl);
    spawnEl.appendChild(beatEl);
}

function onKeyDown(event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    if (!gameContext) {
        throw new Error("Game is not running, there is no GameContext.");
    }

    const key = event.key.toUpperCase();
    if (gameContext.config.layout.keys.includes(key)) {
        triggerBeatTarget(key);
    }
}

function triggerBeatTarget(key: string) {
    const beatTargetEl = dom.getBeatTarget(key);
    if (!beatTargetEl) {
        throw new Error(`Beat target element doesn't exist for key: ${key}`);
    }

    playBeatTargetTriggerAnimation(beatTargetEl);
    checkBeatHit(key);
}

function playBeatTargetTriggerAnimation(beatTargetEl: HTMLElement) {
    beatTargetEl.classList.remove("beat-target--triggered");
    setTimeout(() => beatTargetEl.classList.add("beat-target--triggered"), 0);
    beatTargetEl.onanimationend = () =>
        beatTargetEl.classList.remove("beat-target--triggered");
}

function checkBeatHit(key: string) {
    const beatSpawnEl = dom.getBeatSpawn(key);
    if (!beatSpawnEl) {
        throw new Error(`Beat spawn element doesn't exist for key: ${key}`);
    }
    const nearestBeatEl = beatSpawnEl.firstChild as HTMLElement | null;
    if (nearestBeatEl) {
        const beatTargetEl = dom.getBeatTarget(key);
        if (!beatTargetEl) {
            throw new Error(
                `Beat target element doesn't exist for key: ${key}`,
            );
        }

        const beatTargetRect = beatTargetEl.getBoundingClientRect();
        const beatTargetY = beatTargetRect.top + beatTargetRect.height * 0.5;
        const nearestBeatRect = nearestBeatEl.getBoundingClientRect();
        const nearestBeatY = nearestBeatRect.top + nearestBeatRect.height * 0.5;

        const dist = beatTargetY - nearestBeatY;

        const hitState: HitState = getHitStateFromDist(dist);

        console.log(hitState);
    }
}

function getHitStateFromDist(dist: number): HitState {
    return (
        [HitState.Perfect, HitState.Early, HitState.Late, HitState.Missed].find(
            (hitState) =>
                dist >= BEAT_HIT_STATE_RANGES[hitState].low &&
                dist < BEAT_HIT_STATE_RANGES[hitState].high,
        ) || HitState.Missed
    );
}

enum HitState {
    Perfect = "Perfect",
    Early = "Early",
    Late = "Late",
    Missed = "Missed",
}

interface Range {
    low: number;
    high: number;
}

interface BeatHitStateRanges {
    [HitState.Perfect]: Range;
    [HitState.Early]: Range;
    [HitState.Late]: Range;
    [HitState.Missed]: Range;
}

const BEAT_HIT_STATE_RANGES: BeatHitStateRanges = {
    [HitState.Perfect]: {
        low: 0,
        high: 32,
    },
    [HitState.Early]: {
        low: 32,
        high: 128,
    },
    [HitState.Late]: {
        low: -32,
        high: 0,
    },
    [HitState.Missed]: {
        low: 128,
        high: Infinity,
    },
};
