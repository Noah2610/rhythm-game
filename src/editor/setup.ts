import { generateBeatEditor } from ".";
import { queryExpect } from "../game/dom-helper";
import { BeatSpawnConfig } from "../map-config";
import { EditorContext } from "./editor-context";
import { onKeyDown, togglePaused } from "./input";

const SONG_PROGRESS_UPDATE_INTERVAL_MS = 10;

export function setup(editorContext: EditorContext) {
    // setupLoadSongFile(editorContext);
    setupSelectSong(editorContext);
    setupMapName(editorContext);
    setupBpm(editorContext);
    setupLayout(editorContext);
    setupExport(editorContext);
    setupSongControl(editorContext);

    document.onkeydown = (event) => onKeyDown(editorContext, event);
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
                const audioEl = createSongAudio(
                    editorContext,
                    `/songs/${selectedSong}`,
                );
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
            const audioEl = createSongAudio(editorContext, audioSrc);
            audioEl.onloadedmetadata = () => {
                songNameEl.innerText = file.name;
                editorContext.map.song = file.name;
                resolve();
            };
        };

        fileReader.readAsDataURL(file);
    });
}

function createSongAudio(
    editorContext: EditorContext,
    src: string,
): HTMLAudioElement {
    const audioEl = queryExpect("#editor-song") as HTMLAudioElement;
    audioEl.classList.add("hidden");
    audioEl.src = src;
    setupSongAudioEvents(editorContext, audioEl);
    return audioEl;
}

function setupSongAudioEvents(
    editorContext: EditorContext,
    audioEl: HTMLAudioElement,
) {
    const playBtnEl = queryExpect(
        "#editor-song-control-play-btn",
    ) as HTMLButtonElement;
    audioEl.onplay = () => {
        playBtnEl.innerHTML = ">";
    };
    audioEl.onpause = () => {
        playBtnEl.innerHTML = "||";
    };

    if (editorContext.songProgressUpdateInterval) {
        editorContext.songProgressUpdateInterval = null;
    }
    editorContext.songProgressUpdateInterval = setInterval(() => {
        syncSongControlProgress(audioEl);
        if (!audioEl.paused) {
            syncBeatEditorScroll(editorContext, audioEl);
        }
    }, SONG_PROGRESS_UPDATE_INTERVAL_MS);
}

function syncSongControlProgress(audioEl: HTMLAudioElement) {
    if (audioEl.src && audioEl.duration) {
        const progressEl = queryExpect(
            "#editor-song-control-progress",
        ) as HTMLDivElement;
        const duration = audioEl.duration;
        const currentTime = audioEl.currentTime;
        const percent = (currentTime / duration) * 100;
        progressEl.style.width = `${percent}%`;
    }
}

function syncBeatEditorScroll(
    editorContext: EditorContext,
    audioEl: HTMLAudioElement,
) {
    if (editorContext.map.bpm && audioEl.src && audioEl.duration) {
        const beatSize = parseInt(
            window
                .getComputedStyle(queryExpect("#editor"))
                .getPropertyValue("--beat-editor-beat-size"),
        );
        const bps = 60.0 / editorContext.map.bpm;
        const beatIndex = Math.floor(audioEl.currentTime / bps);
        const offset = beatIndex * beatSize;
        const beatsWrapperEl = queryExpect(
            "#beat-editor .beat-editor-beats-wrapper",
        ) as HTMLDivElement;
        const beatsWrapperHeight = beatsWrapperEl.clientHeight;
        const beatsHeight = beatsWrapperEl.scrollHeight;
        const newY = beatsHeight - beatsWrapperHeight - offset;
        beatsWrapperEl.scrollTo(0, newY);
    }
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
    exportEl.onclick = () => {
        exportMapData(editorContext);
    };

    const textareaEl = queryExpect("#editor-export-raw") as HTMLTextAreaElement;
    textareaEl.onclick = () => copyTextAreaValueToClipboard(textareaEl);
}

function exportMapData(editorContext: EditorContext) {
    if (editorContext.map) {
        const textareaEl = queryExpect(
            "#editor-export-raw",
        ) as HTMLTextAreaElement;
        collectBeatData(editorContext);
        const data = JSON.stringify(editorContext.map, null, 4);
        textareaEl.classList.remove("hidden");
        textareaEl.value = data;
        copyTextAreaValueToClipboard(textareaEl);
    }
}

function copyTextAreaValueToClipboard(textareaEl: HTMLTextAreaElement) {
    textareaEl.select();
    document.execCommand("copy");
}

function collectBeatData(editorContext: EditorContext) {
    const beatEls = Array.from(
        document.querySelectorAll("#beat-editor .beat-editor-beat.on"),
    );
    editorContext.map.beats = beatEls
        .map((beatEl) => {
            const beat = parseInt(beatEl.getAttribute("data-beat") || "");
            const key = beatEl.getAttribute("data-key");
            if (beat && key) {
                return {
                    beat,
                    key,
                };
            } else {
                return null;
            }
        })
        .filter((beat) => !!beat) as BeatSpawnConfig[];
}

function setupSongControl(editorContext: EditorContext) {
    const songEl = queryExpect("#editor-song") as HTMLAudioElement;

    const playBtnEl = queryExpect(
        "#editor-song-control-play-btn",
    ) as HTMLButtonElement;
    playBtnEl.onclick = () => {
        togglePaused(songEl);
    };

    const progressWrapperEl = queryExpect(
        "#editor-song-control-progress-wrapper",
    ) as HTMLDivElement;
    progressWrapperEl.onclick = (event) => {
        if (songEl.src && songEl.duration) {
            const elWidth = progressWrapperEl.getBoundingClientRect().width;
            const percent = event.offsetX / elWidth;
            const newTime = songEl.duration * percent;
            songEl.currentTime = newTime;
        }
    };
}
