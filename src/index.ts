import { startEditor } from "./editor";
import { startGame } from "./game";

function main() {
    const page = location.pathname;

    switch (page) {
        case "/":
        case "/index.html":
            setupStartButton();
            break;
        case "/editor":
        case "/editor.html":
            startEditor();
            break;
    }

    setupStartButton();
}

function setupStartButton() {
    const menuEl = document.querySelector("#start-menu") as HTMLDivElement;
    const startBtnEl = document.querySelector(
        "#btn-start",
    ) as HTMLButtonElement;
    startBtnEl.onclick = () => {
        if (!menuEl.classList.contains("hidden")) {
            menuEl.classList.add("hidden");
            startGame();
        }
    };
}

window.onload = main;
