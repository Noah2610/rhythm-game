export enum HitState {
    Perfect = "Perfect",
    Early = "Early",
    Late = "Late",
    Missed = "Missed",
}

interface Range {
    low: number;
    high: number;
}

interface BeatHitStateRanges {
    [HitState.Perfect]: Range;
    [HitState.Early]: Range;
    [HitState.Late]: Range;
    [HitState.Missed]: Range;
}

const BEAT_HIT_STATE_RANGES: BeatHitStateRanges = {
    [HitState.Perfect]: {
        low: 0,
        high: 32,
    },
    [HitState.Early]: {
        low: 32,
        high: 128,
    },
    [HitState.Late]: {
        low: -32,
        high: 0,
    },
    [HitState.Missed]: {
        low: 128,
        high: Infinity,
    },
};

export function getHitStateFromDist(dist: number): HitState {
    return (
        [HitState.Perfect, HitState.Early, HitState.Late, HitState.Missed].find(
            (hitState) =>
                dist >= BEAT_HIT_STATE_RANGES[hitState].low &&
                dist < BEAT_HIT_STATE_RANGES[hitState].high,
        ) || HitState.Missed
    );
}
