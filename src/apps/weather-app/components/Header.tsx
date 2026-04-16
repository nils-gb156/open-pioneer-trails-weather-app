// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Box, Heading } from "@chakra-ui/react";

export function Header() {
    return (
        <Box
            role="region"
            aria-label="Header Bar"
            textAlign="center"
            py={2}
            px={4}
            backgroundColor="white"
            borderBottomWidth="1px"
            minHeight="auto"
        >
            <Heading size="md">Open Pioneer Trails - Weather App</Heading>
        </Box>
    );
}
