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
            setupEditor();
            break;
    }

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

function setupEditor() {
    startEditor();
}

window.onload = main;
