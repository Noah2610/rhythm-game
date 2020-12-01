export function startEditor() {
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
            document.querySelector("#editor")?.appendChild(audioEl);
            resolve();
        };

        fileReader.readAsDataURL(file);
    });
}
