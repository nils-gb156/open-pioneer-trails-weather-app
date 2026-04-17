// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Text } from "@chakra-ui/react";

export interface WeatherForecastProps {
    coordinate?: [number, number];
}

export function WeatherForecast({ coordinate }: WeatherForecastProps) {
    if (!coordinate) {
        return <Text fontSize="sm">Click in the map</Text>;
    }

    const [latitude, longitude] = coordinate;

    return (
        <>
            <Text fontSize="sm">
                Lon: {longitude.toFixed(5)}° <br /> Lat: {latitude.toFixed(5)}°
            </Text>
        </>
    );
}
