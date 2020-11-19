export interface MapConfig {
    layout: LayoutConfig;
    beats: BeatSpawnConfig[];
}

export interface LayoutConfig {
    keys: string[];
}

export interface BeatSpawnConfig {
    /**
     * The time in milliseconds, relative to the playing song,
     * when to spawn the beat.
     */
    time: number;
    /**
     * The beat key to spawn.
     * Has to be a key defined in the map config's layout.
     */
    key: string;
}
