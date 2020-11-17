import dom from "./dom-helper";
import { loadMap } from "./map-loader";

export async function startGame() {
    await loadMap("dev.json");
    dom.game.classList.remove("hidden");
}
