import { queryExpect } from "../game/dom-helper";
import { newEditorContext, EditorContext } from "./editor-context";

export function startEditor() {
    const editorContext = newEditorContext();

    setupLoadSong();
    setupMapName(editorContext);
    setupBpm(editorContext);
    setupExport(editorContext);

    document.onkeydown = onKeyDown;
}

function onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    switch (key) {
        case " ":
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
            break;
    }
}

function togglePaused(audioEl: HTMLAudioElement) {
    if (audioEl.src) {
        if (audioEl.paused) {
            audioEl.play();
        } else {
            audioEl.pause();
        }
    }
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
        const songNameEl = queryExpect("#editor-song-name") as HTMLDivElement;
        songNameEl.innerText = `Loading: ${file.name}`;

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
            const audioEl = queryExpect("#editor-song") as HTMLAudioElement;
            audioEl.classList.add("hidden");
            audioEl.src = audioSrc;
            queryExpect("#editor").appendChild(audioEl);
            songNameEl.innerText = file.name;
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

function setupExport(editorContext: EditorContext) {
    const exportEl = queryExpect("#editor-input-export") as HTMLButtonElement;
    const textareaEl = queryExpect("#editor-export-raw") as HTMLTextAreaElement;
    exportEl.onclick = () => {
        if (editorContext.map) {
            const data = JSON.stringify(editorContext.map, undefined, "    ");
            textareaEl.classList.remove("hidden");
            textareaEl.innerText = data;
        }
    };
}
