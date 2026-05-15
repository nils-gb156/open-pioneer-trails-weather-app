// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 7: Display the weather forecast for a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the map to be visible
    const mapCanvas = await page.waitForSelector("canvas");
    expect(mapCanvas).toBeVisible();

    // Click on a location in the map (assuming coordinates 50, 50)
    await mapCanvas.click({ position: { x: 50, y: 50 } });

    // Wait for the weather forecast section to be visible
    const weatherSection = await page.waitForSelector('section[data-testid="weather-forecast"]');
    expect(weatherSection).toBeVisible();

    // Check if multiple forecast entries are displayed
    const forecastEntries = await weatherSection.$$("li");
    expect(forecastEntries.length).toBeGreaterThan(0);

    // Verify that each forecast entry contains the required information
    for (const entry of forecastEntries) {
        await expect(entry).toHaveText(/datetime/);
        await expect(entry).toHaveText(/weather description/);
        await expect(entry).toHaveText(/temperature/);
        await expect(entry).toHaveText(/humidity/);
        await expect(entry).toHaveText(/wind direction/);
        await expect(entry).toHaveText(/wind speed/);
    }

    // Verify that the forecast data is displayed in metric units
    const temperatureUnits = await weatherSection.$$('span[data-testid="temperature-unit"]');
    for (const unit of temperatureUnits) {
        await expect(unit).toHaveText("°C");
    }
});
