// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    MapConfig,
    MapConfigProvider,
    MapConfigProviderOptions,
    SimpleLayer
} from "@open-pioneer/map";
import EsriJSON from "ol/format/EsriJSON";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { WorldCitiesLegend } from "./styles/WorldCitiesLegend";
import { getCityStyle } from "./styles/worldCitiesStyle";

export const MAP_ID = "main";

export class MainMapProvider implements MapConfigProvider {
    mapId = MAP_ID;

    async getMapConfig({ layerFactory }: MapConfigProviderOptions): Promise<MapConfig> {
        return {
            initialView: {
                kind: "position",
                center: { x: 1163010, y: 6650236 },
                zoom: 6
            },
            projection: "EPSG:3857",
            layers: [
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
                }),
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
                    title: "World Cities",
                    attributes: {
                        legend: {
                            Component: WorldCitiesLegend
                        }
                    },
                    olLayer: new VectorLayer({
                        source: new VectorSource({
                            format: new EsriJSON(),
                            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0/query?where=1%3D1&outFields=*&f=pjson&outSR=3857"
                        }),
                        style: getCityStyle,
                        properties: { title: "World Cities" }
                    })
                })
            ]
        };
    }
}
