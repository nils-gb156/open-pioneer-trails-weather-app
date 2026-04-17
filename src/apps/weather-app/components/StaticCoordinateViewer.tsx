// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Text } from "@chakra-ui/react";
export interface StaticCoordinateViewerProps {
    coordinate: [number, number];
}

export function StaticCoordinateViewer({ coordinate }: StaticCoordinateViewerProps) {
    const [latitude, longitude] = coordinate;

    return (
        <Text fontSize="sm">
            Longitude: {longitude.toFixed(5)}° <br /> Latitude: {latitude.toFixed(5)}°
        </Text>
    );
}
