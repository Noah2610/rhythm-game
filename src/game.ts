import { MapConfig } from "./map-config";

export async function startGame() {
    await loadMap("dev.json");

    const gameEl = document.querySelector("#game");
    gameEl?.classList.remove("hidden");
}

async function loadMap(mapName: string) {
    resetGame();
    const mapConfig: MapConfig = await fetch(
        `/maps/${mapName}`,
    ).then((response) => response.json());
    console.log(mapConfig);
}

function resetGame() {
    const gameEl = document.querySelector("#game");
    gameEl && (gameEl.innerHTML = "");
}
