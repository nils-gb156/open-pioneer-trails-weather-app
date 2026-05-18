// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC7: Display the weather forecast for a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Ensure the map is visible
    const mapContainer = page.locator("data-testid=map-container");
    await expect(mapContainer).toBeVisible();

    // Click on a location in the map (e.g., center of the map)
    await mapContainer.click({ position: { x: 200, y: 200 } });

    // Ensure the weather forecast section is visible
    const weatherForecastHeading = page.locator("data-testid=weather-forecast-heading");
    await expect(weatherForecastHeading).toBeVisible();

    // Ensure forecast data for the selected location is displayed
    const weathercardEmpty = page.locator("data-testid=weathercard-empty");
    await expect(weathercardEmpty).not.toBeVisible();

    // Ensure multiple forecast entries are shown in metric units
    const forecastEntries = page.locator(".forecast-entry");
    await expect(forecastEntries).toHaveCountGreaterThan(0);

    // Check for specific elements within each forecast entry
    for (const entry of await forecastEntries.all()) {
        await expect(entry.locator(".datetime")).toBeVisible();
        await expect(entry.locator(".weather-description")).toBeVisible();
        await expect(entry.locator(".temperature")).toContainText("°C");
        await expect(entry.locator(".humidity")).toContainText("%");
        await expect(entry.locator(".wind-direction")).toBeVisible();
        await expect(entry.locator(".wind-speed")).toContainText("m/s");
    }
});
