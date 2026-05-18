// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 5: Display coordinates of a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Ensure the map is visible
    const mapContainer = page.locator("data-testid=map-container");
    await expect(mapContainer).toBeVisible();

    // Click on a location in the map
    const clickPoint = { x: 200, y: 300 }; // Example coordinates within the map area
    await mapContainer.click(clickPoint.x, clickPoint.y);

    // Ensure the clicked location is highlighted (this could be visual verification)
    // For simplicity, we assume a visual check or additional UI element to confirm

    // Check if the location viewer shows longitude and latitude values
    const locationViewer = page.locator("data-testid=location-viewer-heading");
    await expect(locationViewer).toHaveText(/Latitude: \d+\.\d+, Longitude: \d+\.\d+/);

    // Additional assertion to ensure coordinates correspond to the clicked map position
    // This could involve more complex validation logic or additional UI elements
});
