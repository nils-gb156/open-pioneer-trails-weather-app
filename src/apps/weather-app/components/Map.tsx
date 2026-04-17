// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, CloseButton, Flex, Separator } from "@chakra-ui/react";
import { Legend } from "@open-pioneer/legend";
import { InitialExtent, ZoomIn, ZoomOut } from "@open-pioneer/map-navigation";
import { DefaultMapProvider, MapAnchor, MapContainer, useMapModel } from "@open-pioneer/map";
import { Measurement } from "@open-pioneer/measurement";
import { ToolButton } from "@open-pioneer/map-ui-components";
import { SectionHeading, TitledSection } from "@open-pioneer/react-utils";
import { Toc } from "@open-pioneer/toc";
import Point from "ol/geom/Point";
import { transform } from "ol/proj";
import { useEffect, useId, useState } from "react";
import { LuCloudSun, LuImages, LuMenu, LuRuler } from "react-icons/lu";
import { WeatherForecast } from "./WeatherForecast";

const MAP_ID = "main";

interface ClickedLocation {
    coordinate: [number, number];
    mapCoordinate: [number, number];
}

export function Map() {
    const { map } = useMapModel(MAP_ID);
    const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
    const [measurementIsActive, setMeasurementIsActive] = useState<boolean>(false);
    const [tocIsActive, setTocIsActive] = useState<boolean>(true);
    const [legendIsActive, setLegendIsActive] = useState<boolean>(true);
    const [weatherForecastIsActive, setWeatherForecastIsActive] = useState<boolean>(true);
    const measurementTitleId = useId();

    function toggleMeasurement() {
        setMeasurementIsActive((previousIsActive) => !previousIsActive);
    }

    function toggleLegend() {
        setLegendIsActive((previousIsActive) => !previousIsActive);
    }

    function toggleToc() {
        setTocIsActive((previousIsActive) => !previousIsActive);
    }

    function toggleWeatherForecast() {
        setWeatherForecastIsActive((previousIsActive) => !previousIsActive);
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
        if (!map || !clickedLocation || !weatherForecastIsActive) {
            return;
        }

        const highlight = map.highlight([new Point(clickedLocation.mapCoordinate)]);
        return () => {
            highlight.destroy();
        };
    }, [map, clickedLocation, weatherForecastIsActive]);

    if (!map) {
        return null;
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <DefaultMapProvider map={map}>
                <MapContainer aria-label="Weather map">
                    {(tocIsActive || legendIsActive) && (
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
                                {tocIsActive && (
                                    <Toc
                                        showTools={true}
                                        basemapSwitcherProps={{
                                            allowSelectingEmptyBasemap: true
                                        }}
                                    />
                                )}
                                {tocIsActive && legendIsActive && <Separator my={3} />}
                                {legendIsActive && (
                                    <TitledSection
                                        title={<SectionHeading size="md">Legend</SectionHeading>}
                                    >
                                        <Legend showBaseLayers={false} />
                                    </TitledSection>
                                )}
                            </Box>
                        </MapAnchor>
                    )}

                    {weatherForecastIsActive && (
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
                                <TitledSection
                                    title={
                                        <SectionHeading size="md">Weather Forecast</SectionHeading>
                                    }
                                >
                                    <WeatherForecast coordinate={clickedLocation?.coordinate} />
                                </TitledSection>
                            </Box>
                        </MapAnchor>
                    )}

                    <MapAnchor position="bottom-right" horizontalGap={10} verticalGap={30}>
                        <Flex aria-label="Maptools" direction="column" gap={1} padding={1}>
                            <ToolButton
                                label="Weather Forecast"
                                icon={<LuCloudSun />}
                                active={weatherForecastIsActive}
                                onClick={toggleWeatherForecast}
                            />
                            <ToolButton
                                label="Layer Switcher"
                                icon={<LuMenu />}
                                active={tocIsActive}
                                onClick={toggleToc}
                            />
                            <ToolButton
                                label="Legend"
                                icon={<LuImages />}
                                active={legendIsActive}
                                onClick={toggleLegend}
                            />
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
        </div>
    );
}
