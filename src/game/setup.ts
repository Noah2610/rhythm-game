import { newGameContext, GameContext } from "./game-context";

export async function startGame(): Promise<GameContext> {
    const gameContext = newGameContext();

    await gameContext.loadMap("dev.json");
    gameContext.startGame();

    return gameContext;
}
