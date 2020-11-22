import { BeatSpawnConfig, MapConfig } from "../map-config";
import dom from "./dom-helper";
import { onKeyDown } from "./input";
import { updateGame } from "./update";

export interface GameContext {
    config: MapConfig;
    upcomingBeats: BeatSpawnConfig[];

    startGame: () => void;
    stopGame: () => void;

    updateGameIntervalId: NodeJS.Timeout | null;
}

const UPDATE_INTERVAL_MS = 1000.0 / 60.0;

export function newGameContext(mapConfig: MapConfig): GameContext {
    return {
        config: mapConfig,
        upcomingBeats: [...mapConfig.beats],

        startGame() {
            dom.game.classList.remove("hidden");

            document.addEventListener("keydown", (event) => {
                onKeyDown(this, event);
            });

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
            // TODO: I don't think this works.
            document.removeEventListener("keydown", (event) =>
                onKeyDown(this, event),
            );

            if (this.updateGameIntervalId) {
                clearInterval(this.updateGameIntervalId);
            }
        },

        updateGameIntervalId: null,
    };
}
