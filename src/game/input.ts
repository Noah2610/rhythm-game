import { GameContext } from "./game-context";
import { triggerBeatTarget } from "./update";

export function onKeyDown(gameContext: GameContext, event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    if (!gameContext) {
        throw new Error("Game is not running, there is no GameContext.");
    }

    const key = event.key.toUpperCase();
    if (gameContext.config.layout.keys.includes(key)) {
        triggerBeatTarget(gameContext, key);
    }
}
