import { MapConfig } from "./map-config";

export async function startGame() {
    await loadMap("dev.json");

    dom.game.classList.remove("hidden");
}

async function loadMap(mapName: string) {
    resetGame();

    const mapConfig: MapConfig = await fetch(
        `/maps/${mapName}`,
    ).then((response) => response.json());

    const beatTargetLineEl = document.createElement("div");
    beatTargetLineEl.classList.add("beat-target-line");

    for (const key of mapConfig.layout.keys) {
        const beatTargetEl = document.createElement("div");
        beatTargetEl.classList.add("beat-target");
        beatTargetEl.innerText = key;
        beatTargetLineEl.appendChild(beatTargetEl);
    }

    dom.game.appendChild(beatTargetLineEl);
}

function resetGame() {
    const gameEl = document.querySelector("#game");
    gameEl && (gameEl.innerHTML = "");
}

const dom: DomHelper = {
    query(query: string) {
        const el = document.querySelector(query);
        if (!el) {
            throw new Error(`Element with query ${query} not found.`);
        }
        return el;
    },

    get game() {
        if (!this.cache.game) {
            this.cache.game = this.query("#game");
        }
        return this.cache.game;
    },

    cache: {
        game: null,
    },
};

interface DomHelper {
    query: (query: string) => Element;
    game: Element;
    cache: {
        game: Element | null;
    };
}
