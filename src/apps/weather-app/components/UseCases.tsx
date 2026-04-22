// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Heading } from "@chakra-ui/react";

export interface UseCase {
    id: number;
    title: string;
    description: string;
    preconditions?: string[];
    steps?: string[];
    expected_result?: string[];
    complexity?: string;
}

interface UseCasesProps {
    useCases: UseCase[];
}

export function UseCases({ useCases }: UseCasesProps) {
    return (
        <Box>
            {useCases.map((uc) => (
                <Box key={uc.id} mb={6}>
                    <Box border="1px solid #ccc" borderRadius="md" p={4}>
                        <Heading size="md" mb={2}>
                            #{uc.id}: {uc.title}
                        </Heading>
                        <Box mb={2}>{uc.description}</Box>
                        {uc.preconditions && (
                            <Box mb={2}>
                                <strong>Preconditions:</strong>
                                <ul style={{ paddingLeft: 20, listStyleType: "disc" }}>
                                    {uc.preconditions.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                        {uc.steps && (
                            <Box mb={2}>
                                <strong>Steps:</strong>
                                <ol style={{ paddingLeft: 20, listStyleType: "decimal" }}>
                                    {uc.steps.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ol>
                            </Box>
                        )}
                        {uc.expected_result && (
                            <Box mb={2}>
                                <strong>Expected Result:</strong>
                                <ul style={{ paddingLeft: 20, listStyleType: "disc" }}>
                                    {uc.expected_result.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                        {uc.complexity && (
                            <Box>
                                <strong>Complexity:</strong> {uc.complexity}
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
