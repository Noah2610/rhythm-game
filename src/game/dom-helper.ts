/**
 * The `DomHelper` is a simple abstraction over `document.querySelector`,
 * with some functions for getting specific game elements, that we know
 * exist in the HTML (or at least should exist!).
 */
export interface DomHelper {
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
    game: HTMLElement;

    /**
     * The game's wrapper element for beat-targets.
     */
    beatTargetLine: HTMLElement;

    /**
     * The game's wrapper element for beat-spawns.
     */
    beatSpawnLine: HTMLElement;

    /**
     * Returns the `.beat-target` element for the given key.
     * Returns `null` if it doesn't exist.
     */
    getBeatTarget: (key: string) => HTMLElement | null;

    /**
     * Returns the `.beat-spawn` element for the given key.
     * Returns `null` if it doesn't exist.
     */
    getBeatSpawn: (key: string) => HTMLElement | null;

    /**
     * Returns the current map's song audio element.
     * Returns `null` if there is no song,
     * which is the case before the game starts.
     */
    getSong: () => HTMLAudioElement | null;

    /**
     * The current map's song audio.
     * This could throw an error if the game is not running.
     */
    song: HTMLAudioElement;

    /**
     * Internally used cache for queried elements.
     * Shouldn't be used outside of the `DomHelper`'s own functions.
     */
    cache: {
        game: HTMLElement | null;
        beatTargetLine: HTMLElement | null;
        beatSpawnLine: HTMLElement | null;
        beatSpawn: {
            [key: string]: HTMLElement;
        };
        song: HTMLAudioElement | null;
    };
}

const domHelper: DomHelper = {
    queryExpect(query, rootEl = undefined) {
        const el = (rootEl || document).querySelector(query);
        if (!el) {
            throw new Error(`Element with query ${query} not found.`);
        }
        return el;
    },

    get game() {
        if (!this.cache.game) {
            this.cache.game = this.queryExpect("#game") as HTMLElement;
        }
        return this.cache.game;
    },

    get beatTargetLine() {
        if (!this.cache.beatTargetLine) {
            this.cache.beatTargetLine = this.queryExpect(
                ".beat-target-line",
                this.game,
            ) as HTMLElement;
        }
        return this.cache.beatTargetLine;
    },

    get beatSpawnLine() {
        if (!this.cache.beatSpawnLine) {
            this.cache.beatSpawnLine = this.queryExpect(
                ".beat-spawn-line",
                this.game,
            ) as HTMLElement;
        }
        return this.cache.beatSpawnLine;
    },

    getBeatTarget(key: string) {
        return this.beatTargetLine.querySelector(
            `.beat-target[data-key=${key}]`,
        );
    },

    getBeatSpawn(key: string) {
        return this.beatSpawnLine.querySelector(`.beat-spawn[data-key=${key}]`);
    },

    getSong() {
        if (!this.cache.song) {
            this.cache.song = this.queryExpect(
                "audio#song",
                this.game,
            ) as HTMLAudioElement;
        }
        return this.cache.song;
    },

    get song() {
        const el = this.getSong();
        if (!el) {
            throw new Error("Game has no audio element, is the game running?");
        }
        return el;
    },

    cache: {
        game: null,
        beatTargetLine: null,
        beatSpawnLine: null,
        beatSpawn: {},
        song: null,
    },
};

export default domHelper;
