// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Box, Separator, Text, VStack } from "@chakra-ui/react";
import { DefaultMapProvider, MapContainer, MapAnchor, useMapModel } from "@open-pioneer/map";
import { BasemapSwitcher } from "@open-pioneer/basemap-switcher";
import { useId } from "react";

const MAP_ID = "main";

export function Map() {
    const { map } = useMapModel(MAP_ID);

    if (!map) {
        return null;
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {map && (
                <DefaultMapProvider map={map}>
                    <MapContainer aria-label="Weather map">
                        <MapAnchor position="top-left" horizontalGap={5} verticalGap={5}>
                            <Box
                                backgroundColor="white"
                                borderWidth="1px"
                                borderRadius="lg"
                                padding={2}
                                boxShadow="lg"
                                aria-label="Map controls"
                                w="320px"
                            >
                                <BasemapSwitcherComponent />
                            </Box>
                        </MapAnchor>
                    </MapContainer>
                </DefaultMapProvider>
            )}
        </div>
    );
}

function BasemapSwitcherComponent() {
    const labelId = useId();
    return (
        <VStack align="stretch" mt={2} gap={1}>
            <Text id={labelId} as="b" mb={1}>
                Basemap
            </Text>
            <BasemapSwitcher aria-labelledby={labelId} allowSelectingEmptyBasemap />
        </VStack>
    );
}
