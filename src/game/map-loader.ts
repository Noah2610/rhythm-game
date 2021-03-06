import { LayoutConfig, MapConfig } from "../map-config";
import dom from "./dom-helper";

export async function fetchMap(mapName: string): Promise<MapConfig> {
    return await fetch(`/maps/${mapName}`)
        .then((response) => response.json())
        .catch(console.error);
}

/**
 * Loads a map config file with the given file name.
 * File name should end in `.json`.
 */
export async function loadMap(mapName: string): Promise<MapConfig> {
    const mapConfig = await fetchMap(mapName);
    loadMapConfig(mapConfig);
    return mapConfig;
}

export function loadMapConfig(mapConfig: MapConfig) {
    resetGame();
    loadSong(mapConfig.song);
    createBeatTargets(mapConfig.layout);
    createBeatSpawns(mapConfig.layout);
    setCssVariables(mapConfig);
}

function setCssVariables(config: MapConfig) {
    dom.game.style.setProperty(
        "--beat-fall-duration",
        `${config.beatSettings.beatFallDuration}ms`,
    );
}

function resetGame() {
    dom.beatTargetLine.innerHTML = "";
    dom.beatSpawnLine.innerHTML = "";
    const audioEl = dom.game.querySelector("audio#song");
    if (audioEl) {
        audioEl.remove();
    }
}

function loadSong(songName: string) {
    const audioEl = new Audio(`/songs/${songName}`);
    audioEl.id = "song";
    audioEl.classList.add("hidden");
    dom.game.appendChild(audioEl);
}

function createBeatTargets(layout: LayoutConfig) {
    for (const key of layout.keys) {
        const beatTargetEl = document.createElement("div");
        beatTargetEl.classList.add("beat-target");
        beatTargetEl.setAttribute("data-key", key);
        beatTargetEl.innerText = key;
        dom.beatTargetLine.appendChild(beatTargetEl);
    }
}

function createBeatSpawns(layout: LayoutConfig) {
    for (const key of layout.keys) {
        const beatSpawnEl = document.createElement("div");
        beatSpawnEl.classList.add("beat-spawn");
        beatSpawnEl.setAttribute("data-key", key);
        dom.beatSpawnLine.appendChild(beatSpawnEl);
    }
}
