export enum BeatHitState {
    Perfect = "Perfect",
    Early = "Early",
    Late = "Late",
    Missed = "Missed",
}

interface Range {
    low: number;
    high: number;
}

interface BeatBeatHitStateRanges {
    [BeatHitState.Perfect]: Range;
    [BeatHitState.Early]: Range;
    [BeatHitState.Late]: Range;
    [BeatHitState.Missed]: Range;
}

const BEAT_HIT_STATE_RANGES: BeatBeatHitStateRanges = {
    [BeatHitState.Perfect]: {
        low: -16,
        high: 16,
    },
    [BeatHitState.Early]: {
        low: 16,
        high: 48,
    },
    [BeatHitState.Late]: {
        low: -48,
        high: -16,
    },
    [BeatHitState.Missed]: {
        low: 48,
        high: Infinity,
    },
};

export function getBeatHitStateFromDist(dist: number): BeatHitState {
    return (
        [
            BeatHitState.Perfect,
            BeatHitState.Early,
            BeatHitState.Late,
            BeatHitState.Missed,
        ].find(
            (hitState) =>
                dist >= BEAT_HIT_STATE_RANGES[hitState].low &&
                dist < BEAT_HIT_STATE_RANGES[hitState].high,
        ) || BeatHitState.Missed
    );
}
