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
    onKeyDown: (event: KeyboardEvent) => void;
}

const UPDATE_INTERVAL_MS = 1000.0 / 60.0;

export function newGameContext(mapConfig: MapConfig): GameContext {
    const context: GameContext = {
        config: mapConfig,
        upcomingBeats: [...mapConfig.beats],

        startGame() {
            dom.game.classList.remove("hidden");

            const context = this;

            this.onKeyDown = (event: KeyboardEvent) =>
                onKeyDown(context, event);

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
        onKeyDown(event) {},
    };

    return context;
}
