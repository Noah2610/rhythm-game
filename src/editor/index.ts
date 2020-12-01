import { queryExpect } from "../game/dom-helper";
import { newEditorContext, EditorContext } from "./editor-context";

export function startEditor() {
    const editorContext = newEditorContext();

    setupLoadSong();
    setupMapName(editorContext);
    setupBpm(editorContext);
}

function setupLoadSong() {
    const loadSongEl = document.querySelector(
        "#editor #btn-load-song",
    ) as HTMLInputElement;
    if (loadSongEl) {
        loadSongEl.addEventListener("change", () => {
            const file = (loadSongEl.files || [])[0];
            if (file) {
                loadAudio(file);
            }
        });
    }
}

async function loadAudio(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onerror = () => {
            reject("Failed to load audio.");
        };

        fileReader.onload = () => {
            const audioSrc = fileReader.result as string;
            if (!audioSrc) {
                reject(`Invalid audio dataURI src: ${audioSrc}`);
                return;
            }
            const audioEl = new Audio();
            audioEl.id = "song";
            audioEl.classList.add("hidden");
            audioEl.src = audioSrc;
            queryExpect("#editor").appendChild(audioEl);
            resolve();
        };

        fileReader.readAsDataURL(file);
    });
}

function setupMapName(editorContext: EditorContext) {
    const inputEl = queryExpect("#editor-input-map-name") as HTMLInputElement;
    inputEl.onchange = (event) => {
        const newName = (event.target as HTMLInputElement | null)?.value;
        if (newName) {
            editorContext.map.name = newName;
            const mapNameEl = queryExpect("#editor-map-name");
            mapNameEl.innerHTML = newName;
        }
    };
}

function setupBpm(editorContext: EditorContext) {
    const inputEl = queryExpect("#editor-input-bpm") as HTMLInputElement;
    inputEl.onchange = (event) => {
        const target = event.target as HTMLInputElement | null;
        const newBpm = target?.value;
        if (target && newBpm) {
            const newBpmI = parseInt(newBpm);
            if (newBpmI) {
                target.classList.remove("error");
                editorContext.map.bpm = newBpmI;
            } else {
                target.classList.add("error");
            }
        }
    };
}
