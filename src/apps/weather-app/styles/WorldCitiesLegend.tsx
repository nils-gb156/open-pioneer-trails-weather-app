// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Box, HStack, Text, VStack } from "@chakra-ui/react";

export function WorldCitiesLegend() {
    return (
        <VStack align="stretch" gap={2}>
            <LegendRow />
        </VStack>
    );
}

function LegendRow() {
    return (
        <HStack align="center" gap={3}>
            <Box
                borderRadius="full"
                width="20px"
                height="20px"
                backgroundColor="rgba(217, 95, 14, 0.45)"
                border="1.25px solid rgba(255, 255, 255, 0.9)"
                boxShadow="0 0 0 1px rgba(94, 94, 94, 0.25) inset"
            />
            <Text fontSize="sm">Cities (Size by Population)</Text>
        </HStack>
    );
}
