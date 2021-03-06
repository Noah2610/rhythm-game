import { MapConfig } from "../map-config";

export interface EditorContext {
    map: Partial<MapConfig>;

    songProgressUpdateInterval: NodeJS.Timeout | null;
}

export function newEditorContext(): EditorContext {
    return {
        map: {
            name: "Unnamed Map",
            beatSettings: {
                beatFallDuration: 5000,
            },
        },
        songProgressUpdateInterval: null,
    };
}
