export function onKeyDown(event: KeyboardEvent) {
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
