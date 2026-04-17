// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Text } from "@chakra-ui/react";
export interface CoordinateViewerProps {
    coordinate: [number, number];
}

export function CoordinateViewer({ coordinate }: CoordinateViewerProps) {
    const [latitude, longitude] = coordinate;

    return (
        <Text fontSize="sm">
            Latitude: {latitude.toFixed(5)}° <br /> Longitude: {longitude.toFixed(5)}°
        </Text>
    );
}
