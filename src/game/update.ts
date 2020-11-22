import { BeatSettings } from "../map-config";
import { getBeatHitStateFromDist, BeatHitState } from "./beat-hit-state";
import dom from "./dom-helper";
import { GameContext } from "./game-context";

export function updateGame(gameContext: GameContext) {
    if (!gameContext) {
        throw new Error("GameContext has to exist in `udpateGame()` function.");
    }
    if (!gameContext.upcomingBeats) {
        throw new Error(
            "GameContext's `upcomingBeats` should exist in `updateGame()` function",
        );
    }

    const time = dom.song.currentTime * 1000;

    const beatIndexesToRemove = [];

    for (let i = 0; i < gameContext.upcomingBeats.length; i++) {
        const nextBeat = gameContext.upcomingBeats[i];
        const fallDuration =
            nextBeat.settings?.beatFallDuration ||
            gameContext.config.beatSettings.beatFallDuration;
        if (time >= nextBeat.time - fallDuration) {
            spawnBeat(gameContext, nextBeat.key, nextBeat.settings);
            beatIndexesToRemove.push(i);
        }
    }

    for (const idx of beatIndexesToRemove.reverse()) {
        gameContext.upcomingBeats.splice(idx, 1);
    }

    // Despawn off-screen beats
    const beatEls = dom.beatSpawnLine.querySelectorAll(
        ".beat.beat--fall-post",
    ) as NodeListOf<HTMLElement>;
    beatEls.forEach((beatEl) => {
        const beatRect = beatEl.getBoundingClientRect();
        if (beatRect.top >= window.innerHeight) {
            setBeatElementLabel(beatEl, "Missed", "failure");
            beatEl.classList.add("beat--despawn");
        }
    });
}

function spawnBeat(
    gameContext: GameContext,
    beat: string,
    settings?: Partial<BeatSettings>,
) {
    if (!gameContext.config.layout.keys.includes(beat)) {
        throw new Error(`Invalid beat key for layout: ${beat}`);
    }

    const spawnEl = dom.getBeatSpawn(beat);
    if (!spawnEl) {
        throw new Error(`No .beat-spawn element for beat key: ${beat}`);
    }

    const beatEl = document.createElement("div");
    beatEl.classList.add("beat", "beat--fall");

    if (settings?.beatFallDuration) {
        beatEl.style.setProperty(
            "--beat-fall-duration",
            `${settings.beatFallDuration}ms`,
        );
    }

    beatEl.onanimationend = (event) => {
        switch (event.animationName) {
            case "beatFall":
                beatEl.classList.add("beat--fall-post");
                break;
            case "beatFallPost":
                setBeatElementLabel(beatEl, "Missed", "failure");
                beatEl.classList.add("beat--despawn");
                break;
            case "beatDespawn":
            case "beatDespawnSuccess":
                beatEl.remove();
        }
    };

    const beatLabelEl = document.createElement("div");
    beatLabelEl.classList.add("beat-label");
    const beatInnerEl = document.createElement("div");
    beatInnerEl.classList.add("beat-key");
    beatInnerEl.innerText = beat;

    beatEl.append(beatLabelEl);
    beatEl.append(beatInnerEl);
    spawnEl.appendChild(beatEl);
}

export function triggerBeatTarget(gameContext: GameContext, key: string) {
    const beatTargetEl = dom.getBeatTarget(key);
    if (!beatTargetEl) {
        throw new Error(`Beat target element doesn't exist for key: ${key}`);
    }

    playBeatTargetTriggerAnimation(beatTargetEl);
    checkBeatHit(key);
}

function playBeatTargetTriggerAnimation(beatTargetEl: HTMLElement) {
    beatTargetEl.classList.remove("beat-target--triggered");
    setTimeout(() => beatTargetEl.classList.add("beat-target--triggered"), 0);
    beatTargetEl.onanimationend = () =>
        beatTargetEl.classList.remove("beat-target--triggered");
}

function checkBeatHit(key: string) {
    const beatSpawnEl = dom.getBeatSpawn(key);
    if (!beatSpawnEl) {
        throw new Error(`Beat spawn element doesn't exist for key: ${key}`);
    }
    const nearestBeatEl = beatSpawnEl.firstChild as HTMLElement | null;
    if (nearestBeatEl) {
        const beatTargetEl = dom.getBeatTarget(key);
        if (!beatTargetEl) {
            throw new Error(
                `Beat target element doesn't exist for key: ${key}`,
            );
        }

        const beatTargetRect = beatTargetEl.getBoundingClientRect();
        const beatTargetY = beatTargetRect.top + beatTargetRect.height * 0.5;
        const nearestBeatRect = nearestBeatEl.getBoundingClientRect();
        const nearestBeatY = nearestBeatRect.top + nearestBeatRect.height * 0.5;

        const dist = beatTargetY - nearestBeatY;

        const hitState: BeatHitState = getBeatHitStateFromDist(dist);
        const labelType = (() => {
            switch (hitState) {
                case BeatHitState.Perfect:
                    return "success";
                case BeatHitState.Missed:
                    return "failure";
                default:
                    return "default";
            }
        })();

        setBeatElementLabel(nearestBeatEl, hitState, labelType);
        if (labelType === "success") {
            nearestBeatEl.classList.add("beat--despawn-success");
        } else {
            nearestBeatEl.classList.add("beat--despawn");
        }
    }
}

function setBeatElementLabel(
    beatEl: HTMLElement,
    label: string,
    labelType: "default" | "success" | "failure" = "default",
) {
    const labelEl = beatEl.querySelector(".beat-label") as HTMLElement | null;
    if (!labelEl) {
        throw new Error("Beat label element doesn't exist.");
    }
    labelEl.classList.add(`beat-label--${labelType}`);
    labelEl.innerText = label;
}
