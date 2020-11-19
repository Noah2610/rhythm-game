import dom from "./dom-helper";
import { loadMap } from "./map-loader";

const UPDATE_INTERVAL_MS = 1000.0 / 60.0;
let updateGameIntervalId: NodeJS.Timeout | null = null;

export async function startGame() {
    await loadMap("dev.json");
    dom.game.classList.remove("hidden");

    updateGameIntervalId = setInterval(updateGame, UPDATE_INTERVAL_MS);
}

export function stopGame() {
    if (updateGameIntervalId) {
        clearInterval(updateGameIntervalId);
    }
}

function updateGame() {
    console.log("UPDATE");
}
