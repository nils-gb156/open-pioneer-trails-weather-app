// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 3: Show the World Cities layer", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Ensure the map is visible
    const mapContainer = page.locator("data-testid=map-container");
    await expect(mapContainer).toBeVisible();

    // Open the layer-switcher (toc)
    const tocToggle = page.locator("data-testid=toc-toggle");
    await tocToggle.click();

    // Enable the World Cities layer in the layer-switcher
    const worldCitiesLayer = page.locator("data-testid=world-cities-layer"); // Assuming this testid exists for the layer
    await worldCitiesLayer.check();

    // Verify that the World Cities layer is visible on the map
    const cityFeatures = page.locator("data-testid=city-features"); // Assuming this testid exists for city features
    await expect(cityFeatures).toBeVisible();

    // Ensure the map remains interactive
    const zoomInButton = page.locator("data-testid=zoom-in-button");
    await zoomInButton.click();
    await expect(mapContainer).toHaveScreenshot(); // Screenshot to verify interaction
});
