// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Text, Heading } from "@chakra-ui/react";

export interface LocationViewerProps {
    coordinate?: [number, number];
}

export function LocationViewer({ coordinate }: LocationViewerProps) {
    if (!coordinate) {
        return <Text fontSize="sm">Click in the map!</Text>;
    }

    const [latitude, longitude] = coordinate;

    return (
        <>
            <Text fontSize="sm" color="gray.700">
                <strong>Lon:</strong> {longitude.toFixed(5)}°
            </Text>
            <Text fontSize="sm" color="gray.700">
                <strong>Lat:</strong> {latitude.toFixed(5)}°
            </Text>
        </>
    );
}
