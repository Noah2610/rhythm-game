export interface MapConfig {
    /**
     * The song file name for this map.
     */
    song: string;

    /**
     * The beat/keyboard keys to use for this map.
     */
    layout: LayoutConfig;

    /**
     * The actual falling beats.
     */
    beats: BeatSpawnConfig[];

    /**
     * The default beat settings for all beats.
     * Individual beats can overwrite this for themselves.
     */
    beatSettings: BeatSettings;
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

    /**
     * Beat specific settings, such as falling duration, color, etc.
     * If omitted, will use the MapConfig's `beatSettings`.
     */
    settings?: Partial<BeatSettings>;
}

export interface BeatSettings {
    /**
     * The fall duration for beats, in milliseconds.
     */
    beatFallDuration: number;
}
