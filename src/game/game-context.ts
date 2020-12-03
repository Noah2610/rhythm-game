import { BeatSpawnConfig, MapConfig } from "../map-config";
import dom from "./dom-helper";
import { onKeyDown } from "./input";
import { loadMap, loadMapConfig } from "./map-loader";
import { updateGame } from "./update";

export interface GameContext {
    map?: MapConfig;
    upcomingBeats: BeatSpawnConfig[];
    /**
     * The map's current beat index.
     */
    beatIndex: number;

    loadMap: (mapName: string) => Promise<void>;
    loadMapConfig: (mapConfig: MapConfig) => void;
    setMapConfig: (mapConfig: MapConfig) => void;
    startGame: () => void;
    stopGame: () => void;

    updateGameIntervalId: NodeJS.Timeout | null;
    onKeyDown: (event: KeyboardEvent) => void;
}

const UPDATE_INTERVAL_MS = 1000.0 / 60.0;

export function newGameContext(): GameContext {
    return {
        upcomingBeats: [],
        beatIndex: 0,

        loadMapConfig(mapConfig) {
            loadMapConfig(mapConfig);
            this.setMapConfig(mapConfig);
        },

        async loadMap(mapName) {
            try {
                this.setMapConfig(await loadMap(mapName));
            } catch (e) {
                throw new Error(e);
            }
        },

        setMapConfig(mapConfig) {
            this.map = mapConfig;
            this.upcomingBeats = [...this.map.beats];
        },

        startGame() {
            if (!this.map) {
                throw new Error("Can't start game with no map config");
            }

            dom.game.classList.remove("hidden");

            const context = this;

            this.onKeyDown = (event: KeyboardEvent) =>
                onKeyDown(context, event);

            document.removeEventListener("keydown", this.onKeyDown);
            document.addEventListener("keydown", this.onKeyDown);

            const songEl = dom.getSong();
            if (!songEl) {
                throw new Error("The current map has no song.");
            }
            songEl.play();

            this.updateGameIntervalId = setInterval(
                () => updateGame(this),
                UPDATE_INTERVAL_MS,
            );
        },

        stopGame() {
            document.removeEventListener("keydown", this.onKeyDown);
            if (this.updateGameIntervalId) {
                clearInterval(this.updateGameIntervalId);
            }
        },

        updateGameIntervalId: null,

        // This should be overwritten in `startGame`.
        onKeyDown(_event) {},
    };
}
