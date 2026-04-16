// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { DefaultMapProvider, MapContainer, useMapModel } from "@open-pioneer/map";

const MAP_ID = "main";

export function Map() {
    const { map } = useMapModel(MAP_ID);

    if (!map) {
        return null;
    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <DefaultMapProvider map={map}>
                <MapContainer aria-label="Weather map" />
            </DefaultMapProvider>
        </div>
    );
}
