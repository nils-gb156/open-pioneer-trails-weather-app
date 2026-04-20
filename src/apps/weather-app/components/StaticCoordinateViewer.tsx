// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Text, Heading } from "@chakra-ui/react";

export interface StaticCoordinateViewerProps {
    coordinate?: [number, number];
}

export function StaticCoordinateViewer({ coordinate }: StaticCoordinateViewerProps) {
    if (!coordinate) {
        return <Text fontSize="sm">Click in the map!</Text>;
    }

    const [latitude, longitude] = coordinate;

    return (
        <>
            <Heading as="h4" size="sm" mb={2} color="teal.700">
                Hitten Coordinate
            </Heading>
            <Text fontSize="sm" color="gray.700">
                <strong>Lon:</strong> {longitude.toFixed(5)}°
            </Text>
            <Text fontSize="sm" color="gray.700">
                <strong>Lat:</strong> {latitude.toFixed(5)}°
            </Text>
        </>
    );
}
