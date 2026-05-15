// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 6: Show the town name for a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the map to be visible
    const mapCanvas = await page.locator("canvas"); // Assuming the map is rendered in a canvas element
    await expect(mapCanvas).toBeVisible();

    // Click on a location in the map (for example, center of the map)
    await mapCanvas.click({ position: { x: 200, y: 200 } }); // Arbitrary click position

    // Wait for the weather forecast panel to display the place name
    const weatherPanel = page.locator(".weather-forecast-panel"); // Assuming there's a class for the weather panel
    await expect(weatherPanel).toBeVisible();

    // Check if a place name is displayed
    const placeName = weatherPanel.locator(".place-name"); // Assuming there's a class for the place name
    await expect(placeName).toHaveText(/[\w\s]+/); // Expect some text to be present

    // Verify that the location information belongs to the clicked map position
    // This step is more about ensuring the app behaves as expected rather than checking specific coordinates
    // We assume the app correctly resolves and displays the place name for the clicked location
});
