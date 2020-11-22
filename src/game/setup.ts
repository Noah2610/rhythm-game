import { newGameContext, GameContext } from "./game-context";
import { loadMap } from "./map-loader";

export async function startGame(): Promise<GameContext> {
    const mapConfig = await loadMap("dev.json");
    const gameContext = newGameContext(mapConfig);

    gameContext.startGame();

    return gameContext;
}
