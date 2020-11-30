export function startEditor() {
    const loadSongEl = document.querySelector("#editor #btn-load-song");
    if (loadSongEl) {
        loadSongEl.addEventListener("change", (event) => {
            console.log(event)
        });
    }
}
