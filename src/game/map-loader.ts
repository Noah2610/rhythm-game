import { MapConfig } from "../map-config";
import dom from "./dom-helper";

/**
 * Loads a map config file with the given file name.
 * File name should end in `.json`.
 */
export async function loadMap(mapName: string) {
    resetGame();

    const mapConfig: MapConfig = await fetch(
        `/maps/${mapName}`,
    ).then((response) => response.json());

    for (const key of mapConfig.layout.keys) {
        const beatTargetEl = document.createElement("div");
        beatTargetEl.classList.add("beat-target");
        beatTargetEl.innerText = key;
        dom.beatTargetLine.appendChild(beatTargetEl);
    }
}

function resetGame() {
    dom.beatTargetLine.innerHTML = "";
    dom.beatSpawnLine.innerHTML = "";
}
