// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Heading } from "@chakra-ui/react";
import { UseCases } from "./UseCases";
import useCasesData from "../use_cases.json";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { SectionHeading, TitledSection } from "@open-pioneer/react-utils";

export function Header() {
    const [useCasesIsActive, setUseCasesIsActive] = useState<boolean>(false);

    return (
        <Box
            role="region"
            aria-label="Header Bar"
            data-testid="header"
            py={2}
            px={4}
            backgroundColor="white"
            borderBottomWidth="1px"
            minHeight="auto"
        >
            <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <Heading data-testid="header-title" size="md" flex={1} textAlign="center">
                    Open Pioneer Trails - Weather App
                </Heading>
                <Box position="absolute" right={0}>
                    <Button
                        data-testid="use-cases-button"
                        onClick={() => setUseCasesIsActive(!useCasesIsActive)}
                    >
                        Use Cases
                    </Button>
                </Box>
            </Box>

            {useCasesIsActive && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    width="100vw"
                    height="100vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="rgba(0,0,0,0.4)"
                    zIndex={1000}
                    data-testid="use-cases-overlay"
                >
                    <Box
                        backgroundColor="white"
                        p={8}
                        borderRadius="md"
                        boxShadow="lg"
                        minWidth="320px"
                        maxWidth="50vw"
                        maxHeight="80vh"
                        width="100%"
                        display="flex"
                        flexDirection="column"
                        data-testid="use-cases-dialog"
                    >
                        <Box flex="auto" overflowY="auto">
                            <TitledSection
                                title={<SectionHeading size="md">Use Cases</SectionHeading>}
                            >
                                <UseCases useCases={useCasesData.use_cases} />
                            </TitledSection>
                        </Box>
                        <Box display="flex" justifyContent="flex-end" mt={4}>
                            <Button
                                data-testid="use-cases-close-button"
                                onClick={() => setUseCasesIsActive(false)}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
