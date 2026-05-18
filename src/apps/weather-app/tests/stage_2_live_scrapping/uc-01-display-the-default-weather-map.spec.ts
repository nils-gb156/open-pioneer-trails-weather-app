// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 1: Display the default weather map", async ({ page }) => {
    // Step 1: The user opens the main page of the weather app.
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Step 2: The app initializes the main map.
    // Expectation: The main map is visible and can be interacted with.
    const mapContainer = await page.getByTestId("map-container");
    await expect(mapContainer).toBeVisible();

    // Step 3: The app displays the default map view with the configured base layer and operational layers.
    // Expectation: The default map view is loaded successfully.
    const initialExtentButton = await page.getByTestId("initial-extent-button");
    await expect(initialExtentButton).toBeEnabled();

    // Additional check to ensure some part of the map controls are visible
    const zoomInButton = await page.getByTestId("zoom-in-button");
    await expect(zoomInButton).toBeVisible();
});
