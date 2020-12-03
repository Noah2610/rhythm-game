import { queryExpect } from "../game/dom-helper";
import { newEditorContext, EditorContext } from "./editor-context";
import { setup } from "./setup";

export function startEditor() {
    const editorContext = newEditorContext();
    setup(editorContext);
}

export function generateBeatEditor(editorContext: EditorContext) {
    const songEl = document.querySelector(
        "#editor-song",
    ) as HTMLAudioElement | null;
    if (
        editorContext.map.bpm &&
        editorContext.map.layout &&
        songEl &&
        songEl.src
    ) {
        const beatsEl = queryExpect("#beat-editor .beat-editor-beats");
        beatsEl.innerHTML = "";
        const targetLineEl = queryExpect(
            "#beat-editor .beat-editor-target-line",
        );
        targetLineEl.innerHTML = "";

        const targetNrEl = document.createElement("div");
        targetNrEl.classList.add("beat-editor-beat-nr");
        targetNrEl.innerHTML = "0";
        targetLineEl.appendChild(targetNrEl);

        for (const key of editorContext.map.layout.keys) {
            const targetEl = document.createElement("div");
            targetEl.classList.add("beat-editor-target");
            targetEl.innerHTML = key;
            targetLineEl.appendChild(targetEl);
        }

        const bps = editorContext.map.bpm / 60.0;
        const totalBeats = Math.floor(songEl.duration / bps);
        for (let i = totalBeats; i > 0; i--) {
            const rowEl = document.createElement("div");
            rowEl.classList.add("beat-editor-beats-row");
            const beatNrEl = document.createElement("div");
            beatNrEl.classList.add("beat-editor-beat-nr");
            beatNrEl.innerHTML = i.toString();
            rowEl.appendChild(beatNrEl);
            for (const key of editorContext.map.layout.keys) {
                const beatEl = document.createElement("div");
                beatEl.classList.add("beat-editor-beat");
                beatEl.setAttribute("data-key", key);
                beatEl.onclick = (event) => {
                    const element = event.target as HTMLDivElement | null;
                    if (element) {
                        element.classList.toggle("on");
                    }
                };
                rowEl.appendChild(beatEl);
            }
            beatsEl.appendChild(rowEl);
        }

        const beatsParentEl = beatsEl.parentElement;
        if (beatsParentEl) {
            const beatSize = parseInt(
                window
                    .getComputedStyle(queryExpect("#editor"))
                    .getPropertyValue("--beat-editor-beat-size"),
            );
            if (beatSize) {
                beatsParentEl.scrollTo(0, totalBeats * beatSize);
            }
        }
    }
}
