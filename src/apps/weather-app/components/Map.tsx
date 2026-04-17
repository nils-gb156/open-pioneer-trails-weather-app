// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, CloseButton, Separator, Flex } from "@chakra-ui/react";
import { DefaultMapProvider, MapContainer, MapAnchor, useMapModel } from "@open-pioneer/map";
import { StaticCoordinateViewer } from "./StaticCoordinateViewer";
import { SectionHeading, TitledSection } from "@open-pioneer/react-utils";
import { ToolButton } from "@open-pioneer/map-ui-components";
import { Toc } from "@open-pioneer/toc";
import { Legend } from "@open-pioneer/legend";
import Point from "ol/geom/Point";
import { transform } from "ol/proj";
import { useEffect, useState, useId } from "react";
import { LuRuler } from "react-icons/lu";
import { InitialExtent, ZoomIn, ZoomOut } from "@open-pioneer/map-navigation";
import { Measurement } from "@open-pioneer/measurement";

const MAP_ID = "main";

interface ClickedLocation {
    coordinate: [number, number];
    mapCoordinate: [number, number];
}

export function Map() {
    const { map } = useMapModel(MAP_ID);
    const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
    const [measurementIsActive, setMeasurementIsActive] = useState<boolean>(false);
    const measurementTitleId = useId();

    function toggleMeasurement() {
        setMeasurementIsActive((previousIsActive) => !previousIsActive);
    }

    useEffect(() => {
        if (!map) {
            return;
        }

        const onSingleClick = (evt: unknown) => {
            if (measurementIsActive) {
                return;
            }

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

            setClickedLocation({
                coordinate: [lonLat[1], lonLat[0]],
                mapCoordinate: coordinate
            });
        };

        map.olMap.on("singleclick", onSingleClick);
        return () => {
            map.olMap.un("singleclick", onSingleClick);
        };
    }, [map, measurementIsActive]);

    useEffect(() => {
        if (!map || !clickedLocation) {
            return;
        }

        const highlight = map.highlight([new Point(clickedLocation.mapCoordinate)]);
        return () => {
            highlight.destroy();
        };
    }, [map, clickedLocation]);

    if (!map) {
        return null;
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {map && (
                <DefaultMapProvider map={map}>
                    <MapContainer aria-label="Weather map">
                        <MapAnchor position="top-left" horizontalGap={10} verticalGap={10}>
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
                        {clickedLocation && (
                            <MapAnchor position="top-right" horizontalGap={10} verticalGap={10}>
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
                                            setClickedLocation(null);
                                        }}
                                    />
                                    <TitledSection
                                        title={
                                            <SectionHeading size="md">
                                                Coordinate viewer
                                            </SectionHeading>
                                        }
                                    >
                                        <StaticCoordinateViewer
                                            coordinate={clickedLocation.coordinate}
                                        />
                                    </TitledSection>
                                </Box>
                            </MapAnchor>
                        )}
                        <MapAnchor position="bottom-right" horizontalGap={10} verticalGap={30}>
                            <Flex aria-label="Maptools" direction="column" gap={1} padding={1}>
                                <ToolButton
                                    label="Measurement"
                                    icon={<LuRuler />}
                                    active={measurementIsActive}
                                    onClick={toggleMeasurement}
                                />
                                <InitialExtent />
                                <ZoomIn />
                                <ZoomOut />
                            </Flex>
                        </MapAnchor>
                        <MapAnchor position="bottom-left" horizontalGap={10} verticalGap={10}>
                            {measurementIsActive && (
                                <Box
                                    backgroundColor="white"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    padding={2}
                                    boxShadow="lg"
                                    aria-label="Measurement"
                                >
                                    <Box role="dialog" aria-labelledby={measurementTitleId}>
                                        <TitledSection
                                            title={
                                                <SectionHeading
                                                    id={measurementTitleId}
                                                    size="md"
                                                    mb={2}
                                                >
                                                    Measurement
                                                </SectionHeading>
                                            }
                                        >
                                            <Measurement />
                                        </TitledSection>
                                    </Box>
                                </Box>
                            )}
                        </MapAnchor>
                    </MapContainer>
                </DefaultMapProvider>
            )}
        </div>
    );
}
