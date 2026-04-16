// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    MapConfig,
    MapConfigProvider,
    MapConfigProviderOptions,
    SimpleLayer
} from "@open-pioneer/map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";

export const MAP_ID = "main";

export class MainMapProvider implements MapConfigProvider {
    mapId = MAP_ID;

    async getMapConfig({ layerFactory }: MapConfigProviderOptions): Promise<MapConfig> {
        return {
            initialView: {
                kind: "position",
                center: { x: 847541, y: 6793584 },
                zoom: 13
            },
            projection: "EPSG:3857",
            layers: [
                layerFactory.create({
                    type: SimpleLayer,
                    title: "OpenStreetMap",
                    olLayer: new TileLayer({
                        source: new OSM(),
                        properties: { title: "OSM" }
                    }),
                    isBaseLayer: true
                }),
                layerFactory.create({
                    type: SimpleLayer,
                    title: "ArcGIS Gray Vector",
                    olLayer: new TileLayer({
                        source: new XYZ({
                            url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
                            crossOrigin: "anonymous",
                            maxZoom: 16
                        }),
                        properties: { title: "ArcGIS Gray" }
                    }),
                    isBaseLayer: true
                }),
                layerFactory.create({
                    type: SimpleLayer,
                    title: "ArcGIS Dark Gray Vector",
                    olLayer: new TileLayer({
                        source: new XYZ({
                            url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
                            crossOrigin: "anonymous",
                            maxZoom: 16
                        }),
                        properties: { title: "ArcGIS Dark Gray" }
                    }),
                    isBaseLayer: true
                })
            ]
        };
    }
}
