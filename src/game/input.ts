import { GameContext } from "./game-context";
import { triggerBeatTarget } from "./update";

export function onKeyDown(gameContext: GameContext, event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    if (!gameContext.map) {
        throw new Error("There is no MapConfig.");
    }

    const key = event.key.toUpperCase();
    if (gameContext.map.layout.keys.includes(key)) {
        triggerBeatTarget(gameContext, key);
    }
}
