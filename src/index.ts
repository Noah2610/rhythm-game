import { startGame } from "./game";

function main() {
    setupStartButton();
}

function setupStartButton() {
    const startBtnEl = document.querySelector("#btn-start");
    startBtnEl?.addEventListener("click", () => {
        const parentEl = startBtnEl.parentElement;
        if (parentEl && !parentEl.classList.contains("hidden")) {
            parentEl.classList.add("hidden");
            startGame();
        }
    });
}

window.onload = main;
