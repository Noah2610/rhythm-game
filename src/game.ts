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

const dom: DomHelper = {
    queryExpect(query, rootEl = undefined) {
        const el = (rootEl || document).querySelector(query);
        if (!el) {
            throw new Error(`Element with query ${query} not found.`);
        }
        return el;
    },

    get game() {
        if (!this.cache.game) {
            this.cache.game = this.queryExpect("#game");
        }
        return this.cache.game;
    },

    get beatTargetLine() {
        if (!this.cache.beatTargetLine) {
            this.cache.beatTargetLine = this.queryExpect(
                ".beat-target-line",
                this.game,
            );
        }
        return this.cache.beatTargetLine;
    },

    get beatSpawnLine() {
        if (!this.cache.beatSpawnLine) {
            this.cache.beatSpawnLine = this.queryExpect(
                ".beat-spawn-line",
                this.game,
            );
        }
        return this.cache.beatSpawnLine;
    },

    cache: {
        game: null,
        beatTargetLine: null,
        beatSpawnLine: null,
    },
};

interface DomHelper {
    /**
     * Run a `document.querySelector` with the given `query`,
     * but expect the element to exist.
     * Throws an error if it doesn't exist.
     *
     * Optionally pass the `rootEl`, on which `.querySelector` is called.
     * Otherwise `document` is used.
     */
    queryExpect: (query: string, rootEl?: Element) => Element;

    /**
     * The game wrapper element.
     */
    game: Element;

    /**
     * The game's wrapper element for beat-targets.
     */
    beatTargetLine: Element;

    /**
     * The game's wrapper element for beat-spawns.
     */
    beatSpawnLine: Element;

    /**
     * Internally used cache for queried elements.
     * Shouldn't be used outside of the `DomHelper`'s own functions.
     */
    cache: {
        game: Element | null;
        beatTargetLine: Element | null;
        beatSpawnLine: Element | null;
    };
}
