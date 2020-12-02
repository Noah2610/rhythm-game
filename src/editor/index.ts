import { queryExpect } from "../game/dom-helper";
import { newEditorContext, EditorContext } from "./editor-context";
import { setup } from "./setup";

export function startEditor() {
    const editorContext = newEditorContext();
    setup(editorContext);
}

export function generateBeatEditor(editorContext: EditorContext) {
    if (editorContext.map.layout) {
        const wrapperEl = queryExpect("#beat-editor-wrapper");

        const targetLineEl = document.createElement("div");
        targetLineEl.classList.add("beat-editor-target-line");

        for (const key of editorContext.map.layout.keys) {
            const targetEl = document.createElement("div");
            targetEl.classList.add("beat-editor-target");
            targetEl.innerHTML = key;
            targetLineEl.appendChild(targetEl);
        }

        wrapperEl.appendChild(targetLineEl);
    }
}
