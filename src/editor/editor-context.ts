import { MapConfig } from "../map-config";

export interface EditorContext {
    map: Partial<MapConfig>;
}

export function newEditorContext(): EditorContext {
    return {
        map: {},
    };
}
