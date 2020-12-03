import { MapConfig } from "../map-config";
import { queryExpect } from "./dom-helper";
import { newGameContext, GameContext } from "./game-context";
import { fetchMap } from "./map-loader";

export async function startGame(): Promise<GameContext> {
    const mapConfigRawEl = queryExpect(
        "#map-config-raw",
    ) as HTMLTextAreaElement;

    const mapConfig: MapConfig = await (async () => {
        try {
            // TODO: Validate MapConfig data
            const mapConfig = JSON.parse(mapConfigRawEl.value);
            return mapConfig;
        } catch (_e) {
            // TODO
            // alert("Invalid MapConfig, using default map `dev.json`.");
            return await fetchMap("dev.json");
        }
    })();

    const gameContext = newGameContext();
    gameContext.loadMapConfig(mapConfig);
    gameContext.startGame();

    return gameContext;
}
