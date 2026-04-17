// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, CloseButton, Separator } from "@chakra-ui/react";
import { DefaultMapProvider, MapContainer, MapAnchor, useMapModel } from "@open-pioneer/map";
import { CoordinateViewer } from "./CoordinateViewer";
import { SectionHeading, TitledSection } from "@open-pioneer/react-utils";
import { Toc } from "@open-pioneer/toc";
import { Legend } from "@open-pioneer/legend";
import { transform } from "ol/proj";
import { useEffect, useState } from "react";

const MAP_ID = "main";

export function Map() {
    const { map } = useMapModel(MAP_ID);
    const [clickedCoordinate, setClickedCoordinate] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!map) {
            return;
        }

        const onSingleClick = (evt: unknown) => {
            if (
                !evt ||
                typeof evt !== "object" ||
                !("coordinate" in evt) ||
                !Array.isArray((evt as { coordinate?: unknown }).coordinate)
            ) {
                return;
            }

            const coordinate = (evt as { coordinate: [number, number] }).coordinate;
            const lonLat = transform(coordinate, map.olView.getProjection(), "EPSG:4326");
            if (lonLat[0] == null || lonLat[1] == null) {
                return;
            }

            setClickedCoordinate([lonLat[1], lonLat[0]]);
        };

        map.olMap.on("singleclick", onSingleClick);
        return () => {
            map.olMap.un("singleclick", onSingleClick);
        };
    }, [map]);

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
                                w="400px"
                            >
                                <Toc
                                    showTools={true}
                                    basemapSwitcherProps={{
                                        allowSelectingEmptyBasemap: true
                                    }}
                                />
                                <TitledSection
                                    title={<SectionHeading size="md">Legend</SectionHeading>}
                                >
                                    <Legend showBaseLayers={false} />
                                </TitledSection>
                            </Box>
                        </MapAnchor>
                        {clickedCoordinate && (
                            <MapAnchor position="top-right" horizontalGap={5} verticalGap={5}>
                                <Box
                                    backgroundColor="white"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    padding={2}
                                    boxShadow="lg"
                                    aria-label="Map controls"
                                    w="400px"
                                    position="relative"
                                >
                                    <CloseButton
                                        aria-label="Coordinate viewer schliessen"
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        onClick={() => {
                                            setClickedCoordinate(null);
                                        }}
                                    />
                                    <TitledSection
                                        title={
                                            <SectionHeading size="md">
                                                Coordinate viewer
                                            </SectionHeading>
                                        }
                                    >
                                        <CoordinateViewer coordinate={clickedCoordinate} />
                                    </TitledSection>
                                </Box>
                            </MapAnchor>
                        )}
                    </MapContainer>
                </DefaultMapProvider>
            )}
        </div>
    );
}
