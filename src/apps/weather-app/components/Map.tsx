// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Flex, Separator } from "@chakra-ui/react";
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
import { LocationViewer } from "./LocationViewer";
import { WeatherCard } from "./WeatherCard";

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
    const [legendIsActive, setLegendIsActive] = useState<boolean>(false);
    const [weatherForecastIsActive, setweatherForecastIsActive] = useState<boolean>(true);
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
        setweatherForecastIsActive((previousIsActive) => !previousIsActive);
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

    useEffect(() => {
        if (clickedLocation?.coordinate) {
            setweatherForecastIsActive(true);
        }
    }, [clickedLocation]);

    if (!map) {
        return null;
    }

    return (
        <div style={{ width: "100%", height: "100%" }} data-testid="map-root">
            <DefaultMapProvider map={map}>
                <MapContainer aria-label="Weather map" data-testid="map-container">
                    {(tocIsActive || legendIsActive) && (
                        <MapAnchor
                            position="top-left"
                            horizontalGap={10}
                            verticalGap={10}
                            data-testid="top-left-anchor"
                        >
                            <Box
                                backgroundColor="white"
                                borderWidth="1px"
                                borderRadius="lg"
                                padding={2}
                                boxShadow="lg"
                                aria-label="Map controls"
                                w="400px"
                                data-testid="map-controls-panel"
                            >
                                {tocIsActive && (
                                    <Box data-testid="toc-panel">
                                        <Toc
                                            showTools={true}
                                            basemapSwitcherProps={{
                                                allowSelectingEmptyBasemap: true
                                            }}
                                        />
                                    </Box>
                                )}

                                {tocIsActive && legendIsActive && (
                                    <Separator my={3} data-testid="toc-legend-separator" />
                                )}

                                {legendIsActive && (
                                    <Box data-testid="legend-panel">
                                        <TitledSection
                                            title={
                                                <SectionHeading
                                                    size="md"
                                                    data-testid="legend-heading"
                                                >
                                                    Legend
                                                </SectionHeading>
                                            }
                                        >
                                            <Box data-testid="legend-content">
                                                <Legend showBaseLayers={false} />
                                            </Box>
                                        </TitledSection>
                                    </Box>
                                )}
                            </Box>
                        </MapAnchor>
                    )}

                    <MapAnchor
                        position="top-right"
                        horizontalGap={10}
                        verticalGap={10}
                        data-testid="top-right-anchor"
                    >
                        <Box
                            backgroundColor="white"
                            borderWidth="1px"
                            borderRadius="lg"
                            padding={2}
                            boxShadow="lg"
                            aria-label="Map info panel"
                            w="400px"
                            position="relative"
                            data-testid="info-panel"
                        >
                            <Box data-testid="location-viewer-panel">
                                <TitledSection
                                    title={
                                        <SectionHeading
                                            size="md"
                                            data-testid="location-viewer-heading"
                                        >
                                            Location Viewer
                                        </SectionHeading>
                                    }
                                >
                                    <Box data-testid="location-viewer-content">
                                        <LocationViewer coordinate={clickedLocation?.coordinate} />
                                    </Box>
                                </TitledSection>
                            </Box>

                            {weatherForecastIsActive && (
                                <>
                                    <Separator my={3} data-testid="weather-forecast-separator" />

                                    <Box data-testid="weather-forecast-panel">
                                        <TitledSection
                                            title={
                                                <SectionHeading
                                                    size="md"
                                                    data-testid="weather-forecast-heading"
                                                >
                                                    Weather Forecast
                                                </SectionHeading>
                                            }
                                        >
                                            <Box data-testid="weather-forecast-content">
                                                <WeatherCard
                                                    coordinate={clickedLocation?.coordinate}
                                                />
                                            </Box>
                                        </TitledSection>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </MapAnchor>

                    <MapAnchor
                        position="bottom-left"
                        horizontalGap={10}
                        verticalGap={30}
                        data-testid="bottom-left-tools-anchor"
                    >
                        <Flex
                            aria-label="Maptools"
                            direction="column"
                            gap={1}
                            padding={1}
                            data-testid="map-tools"
                        >
                            <Box data-testid="weather-forecast-toggle">
                                <ToolButton
                                    label="Weather Forecast"
                                    icon={<LuCloudSun />}
                                    active={weatherForecastIsActive}
                                    onClick={toggleWeatherForecast}
                                />
                            </Box>

                            <Box data-testid="toc-toggle">
                                <ToolButton
                                    label="Layer Switcher"
                                    icon={<LuMenu />}
                                    active={tocIsActive}
                                    onClick={toggleToc}
                                />
                            </Box>

                            <Box data-testid="legend-toggle">
                                <ToolButton
                                    label="Legend"
                                    icon={<LuImages />}
                                    active={legendIsActive}
                                    onClick={toggleLegend}
                                />
                            </Box>

                            <Box data-testid="measurement-toggle">
                                <ToolButton
                                    label="Measurement"
                                    icon={<LuRuler />}
                                    active={measurementIsActive}
                                    onClick={toggleMeasurement}
                                />
                            </Box>

                            <Box data-testid="initial-extent-button">
                                <InitialExtent />
                            </Box>

                            <Box data-testid="zoom-in-button">
                                <ZoomIn />
                            </Box>

                            <Box data-testid="zoom-out-button">
                                <ZoomOut />
                            </Box>
                        </Flex>
                    </MapAnchor>

                    <MapAnchor
                        position="bottom-left"
                        horizontalGap={70}
                        verticalGap={30}
                        data-testid="bottom-left-measurement-anchor"
                    >
                        {measurementIsActive && (
                            <Box
                                backgroundColor="white"
                                borderWidth="1px"
                                borderRadius="lg"
                                padding={2}
                                boxShadow="lg"
                                aria-label="Measurement"
                                data-testid="measurement-panel"
                            >
                                <Box
                                    role="dialog"
                                    aria-labelledby={measurementTitleId}
                                    data-testid="measurement-dialog"
                                >
                                    <TitledSection
                                        title={
                                            <SectionHeading
                                                id={measurementTitleId}
                                                size="md"
                                                mb={2}
                                                data-testid="measurement-heading"
                                            >
                                                Measurement
                                            </SectionHeading>
                                        }
                                    >
                                        <Box data-testid="measurement-content">
                                            <Measurement />
                                        </Box>
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
