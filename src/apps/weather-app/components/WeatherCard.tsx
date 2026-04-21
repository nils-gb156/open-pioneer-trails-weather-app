// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import opencage from "opencage-api-client";
import type { GeocodingResponse } from "opencage-api-client";
import { WeatherForecast } from "./WeatherForecast";

export interface WeatherCardProps {
    coordinate?: [number, number];
}

export function WeatherCard({ coordinate }: WeatherCardProps) {
    const [town, setTown] = useState<string | null>(null);
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    useEffect(() => {
        if (!coordinate || !apiKey) {
            setTown(null);
            return;
        }
        const [latitude, longitude] = coordinate;
        opencage
            .geocode({ q: `${latitude}, ${longitude}`, key: apiKey, language: "en" })
            .then((data: GeocodingResponse) => {
                if (data.status.code === 200 && data.results.length > 0) {
                    const components = data.results[0]?.components;
                    const townName =
                        components?.town ||
                        components?.city ||
                        components?.village ||
                        components?.city_district ||
                        components?.county ||
                        "Unknown";
                    setTown(townName);
                } else {
                    setTown("Unknown");
                }
            })
            .catch(() => setTown("Unknown"));
    }, [coordinate, apiKey]);

    if (!coordinate) {
        return (
            <Text fontSize="sm" color="gray.700">
                <strong>Location:</strong> No coordinate selected
            </Text>
        );
    }

    if (!apiKey) {
        return (
            <Text fontSize="sm" color="red.500">
                <strong>Error:</strong> API key is missing!
            </Text>
        );
    }

    return (
        <>
            <Text fontSize="sm" color="gray.700">
                <strong>Location:</strong> {town ?? "Loading..."}
            </Text>
            <WeatherForecast coordinate={coordinate} />
        </>
    );
}
