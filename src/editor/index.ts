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
        targetNrEl.innerHTML = "";
        targetLineEl.appendChild(targetNrEl);

        for (const key of editorContext.map.layout.keys) {
            const targetEl = document.createElement("div");
            targetEl.classList.add("beat-editor-target");
            targetEl.innerHTML = key;
            targetLineEl.appendChild(targetEl);
        }

        const bps = 60.0 / editorContext.map.bpm;
        const totalBeats = Math.floor(songEl.duration / bps);
        for (let beatIndex = totalBeats - 1; beatIndex >= 0; beatIndex--) {
            const rowEl = document.createElement("div");
            rowEl.classList.add("beat-editor-beats-row");
            const beatNrEl = document.createElement("div");
            beatNrEl.classList.add("beat-editor-beat-nr");
            beatNrEl.innerHTML = (beatIndex + 1).toString();
            rowEl.appendChild(beatNrEl);
            for (const key of editorContext.map.layout.keys) {
                const beatEl = document.createElement("div");
                beatEl.classList.add("beat-editor-beat");
                beatEl.setAttribute("data-beat", beatIndex.toString());
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

        const beatsWrapperEl = beatsEl.parentElement;
        if (beatsWrapperEl) {
            beatsWrapperEl.scrollTo(0, beatsWrapperEl.scrollHeight);
        }
    }
}
