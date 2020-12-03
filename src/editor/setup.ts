import { generateBeatEditor } from ".";
import { queryExpect } from "../game/dom-helper";
import { EditorContext } from "./editor-context";
import { onKeyDown } from "./input";

export function setup(editorContext: EditorContext) {
    // setupLoadSongFile(editorContext);
    setupSelectSong(editorContext);
    setupMapName(editorContext);
    setupBpm(editorContext);
    setupLayout(editorContext);
    setupExport(editorContext);

    document.onkeydown = onKeyDown;
}

async function setupSelectSong(editorContext: EditorContext): Promise<void> {
    interface SongsData {
        songs: string[];
    }

    const songsData: SongsData = await fetch("/songs/index.json")
        .then((response) => response.json())
        .catch(console.error);

    const selectEl = queryExpect(
        "#editor-input-select-song",
    ) as HTMLSelectElement;
    selectEl.innerHTML = "";

    const defaultOptionEl = document.createElement("option");
    defaultOptionEl.value = "DEFAULT";
    defaultOptionEl.innerHTML = "Select Song ...";
    selectEl.appendChild(defaultOptionEl);

    for (const song of songsData.songs) {
        const optionEl = document.createElement("option");
        optionEl.value = song;
        optionEl.innerHTML = song;
        selectEl.appendChild(optionEl);
    }

    selectEl.onchange = (event) => {
        const target = event.target as HTMLSelectElement | null;
        if (target) {
            const selectedSong = target.value;
            if (selectedSong !== "DEFAULT") {
                const audioEl = createSongAudio(`/songs/${selectedSong}`);
                audioEl.onloadedmetadata = () => {
                    editorContext.map.song = selectedSong;
                    generateBeatEditor(editorContext);
                };
            } else {
                editorContext.map.song = undefined;
            }
        }
    };
}

function setupLoadSongFile(editorContext: EditorContext) {
    const loadSongEl = document.querySelector(
        "#editor #btn-load-song-file",
    ) as HTMLInputElement;
    if (loadSongEl) {
        loadSongEl.onchange = () => {
            const file = (loadSongEl.files || [])[0];
            if (file) {
                loadAudioFile(editorContext, file).then(() =>
                    generateBeatEditor(editorContext),
                );
            }
        };
    }
}

async function loadAudioFile(
    editorContext: EditorContext,
    file: File,
): Promise<void> {
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
            const audioEl = createSongAudio(audioSrc);
            audioEl.onloadedmetadata = () => {
                songNameEl.innerText = file.name;
                editorContext.map.song = file.name;
                resolve();
            };
        };

        fileReader.readAsDataURL(file);
    });
}

function createSongAudio(src: string): HTMLAudioElement {
    const audioEl = queryExpect("#editor-song") as HTMLAudioElement;
    audioEl.classList.add("hidden");
    audioEl.src = src;
    return audioEl;
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
                generateBeatEditor(editorContext);
            } else {
                target.classList.add("error");
            }
        }
    };
}

function setupLayout(editorContext: EditorContext) {
    const inputEl = queryExpect("#editor-input-layout") as HTMLInputElement;
    inputEl.onchange = (event) => {
        const target = event.target as HTMLInputElement | null;
        const layoutS = target?.value;
        if (target && layoutS) {
            const layoutKeys = layoutS
                .replace(/\s+/g, "")
                .split("")
                .map((k) => k.toUpperCase())
                .filter((key, idx, arr) => arr.indexOf(key) === idx);
            target.value = layoutKeys.join(" ");
            const layoutEl = queryExpect("#editor-layout");
            layoutEl.innerHTML = "";
            for (const key of layoutKeys) {
                const keyEl = document.createElement("div");
                keyEl.classList.add("editor-layout-key");
                keyEl.innerHTML = key;
                layoutEl.appendChild(keyEl);
            }
            editorContext.map.layout = {
                keys: layoutKeys,
            };
            generateBeatEditor(editorContext);
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
