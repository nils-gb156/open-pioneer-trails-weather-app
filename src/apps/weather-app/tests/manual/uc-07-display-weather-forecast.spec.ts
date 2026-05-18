// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-7: Display the weather forecast for a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Basic app/map sanity
    await expect(page.getByTestId("app")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Click on the map to select a location
    const mapContainer = page.getByTestId("map-container");
    await mapContainer.click({ position: { x: 220, y: 220 } });

    // Wait for forecast data to be loaded
    const forecastContainer = page.getByTestId("weather-forecast-container");
    await expect(forecastContainer).toBeVisible({ timeout: 15000 });

    // Verify the first forecast entry and all expected fields/units
    const firstEntry = page.getByTestId("forecast-entry-0");
    await expect(firstEntry).toBeVisible();

    const dateTime = page.getByTestId("forecast-dt-0");
    const weather = page.getByTestId("forecast-weather-0");
    const temperature = page.getByTestId("forecast-temp-0");
    const humidity = page.getByTestId("forecast-humidity-0");
    const windDeg = page.getByTestId("forecast-wind-deg-0");
    const windSpeed = page.getByTestId("forecast-wind-speed-0");

    await expect(dateTime).toBeVisible();
    await expect(weather).toBeVisible();
    await expect(temperature).toBeVisible();
    await expect(humidity).toBeVisible();
    await expect(windDeg).toBeVisible();
    await expect(windSpeed).toBeVisible();

    await expect(dateTime).toContainText("Dateitme:");
    await expect(weather).toContainText("weather:");
    await expect(temperature).toContainText("temperature:");
    await expect(humidity).toContainText("humidity:");
    await expect(windDeg).toContainText("winddirection:");
    await expect(windSpeed).toContainText("windspeed:");
    await expect(temperature).toContainText("°C");
    await expect(windSpeed).toContainText("m/s");
});
