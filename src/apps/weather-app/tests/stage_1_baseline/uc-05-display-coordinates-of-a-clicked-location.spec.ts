// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 5: Display coordinates of a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the map to be visible
    const mapCanvas = await page.locator("canvas"); // Assuming the map is rendered in a canvas element
    await expect(mapCanvas).toBeVisible();

    // Click on a location in the map
    // Coordinates are chosen arbitrarily as an example; adjust as needed
    const clickPoint = { x: 200, y: 300 }; // Example coordinates within the visible area of the canvas
    await mapCanvas.click(clickPoint.x, clickPoint.y);

    // Wait for the location viewer to display coordinates
    const locationViewer = page.locator("div.location-viewer"); // Assuming there's a div with class 'location-viewer' that shows coordinates
    await expect(locationViewer).toBeVisible();

    // Check if the location viewer shows longitude and latitude values
    const latitudeText = await locationViewer.locator("span.latitude").textContent();
    const longitudeText = await locationViewer.locator("span.longitude").textContent();

    expect(latitudeText).not.toBeUndefined();
    expect(longitudeText).not.toBeUndefined();

    // Additional check to ensure the coordinates are numeric (basic validation)
    expect(Number(latitudeText)).toBeCloseTo(clickPoint.y, 1); // Adjust precision as needed
    expect(Number(longitudeText)).toBeCloseTo(clickPoint.x, 1); // Adjust precision as needed

    console.log(`Latitude: ${latitudeText}, Longitude: ${longitudeText}`);
});
