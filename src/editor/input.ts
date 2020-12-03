import { queryExpect } from "../game/dom-helper";
import { EditorContext } from "./editor-context";

export function onKeyDown(editorContext: EditorContext, event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    const key = event.key.toUpperCase();
    if (key === " ") {
        const activeElement = document.activeElement;
        if (
            !activeElement ||
            !["INPUT", "BUTTON"].includes(activeElement.tagName)
        ) {
            const audioEl = document.querySelector(
                "#editor-song",
            ) as HTMLAudioElement | null;
            if (audioEl) {
                togglePaused(audioEl);
            }
        }
    } else {
        const audioEl = queryExpect("#editor-song") as HTMLAudioElement;
        if (
            audioEl.src &&
            audioEl.duration &&
            editorContext.map.bpm &&
            editorContext.map.layout?.keys.includes(key)
        ) {
            const bps = 60.0 / editorContext.map.bpm;
            const beatIndex = Math.floor(audioEl.currentTime / bps);
            const beatEl = document.querySelector(
                `.beat-editor-beat[data-beat="${beatIndex}"][data-key="${key}"]`,
            );
            if (beatEl) {
                beatEl.classList.toggle("on");
            }
        }
    }
}

export function togglePaused(audioEl: HTMLAudioElement) {
    if (audioEl.src) {
        if (audioEl.paused) {
            audioEl.play();
        } else {
            audioEl.pause();
        }
    }
}
