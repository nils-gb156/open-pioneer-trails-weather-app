// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 1: Display the default weather map", async ({ page }) => {
    // Navigate to the app's main page
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the main map to be visible
    const mapContainer = await page.locator("#map-container"); // Assuming the map container has this id
    await expect(mapContainer).toBeVisible();

    // Check if the user can interact with the map
    await mapContainer.click(); // A simple click to simulate interaction

    // Verify that the default map view is loaded successfully
    const baseLayer = await page.locator('div[aria-label="OpenStreetMap"]'); // Assuming OpenStreetMap is the base layer
    await expect(baseLayer).toBeVisible();

    // Additional check for operational layers (if any specific layers are expected)
    const operationalLayer = await page.locator('div[aria-label="Weather Layer"]'); // Assuming there's a weather layer
    await expect(operationalLayer).toBeVisible();
});
