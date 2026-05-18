// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-8: Toggle the weather forecast panel", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Basic app/map sanity
    await expect(page.getByTestId("app")).toBeVisible();
    const mapContainer = page.getByTestId("map-container");
    await expect(mapContainer).toBeVisible();

    // Select a location on the map (precondition)
    await mapContainer.click({ position: { x: 220, y: 220 } });

    // Ensure a location is displayed
    const locationText = page.getByTestId("weathercard-location");
    await expect(locationText).toBeVisible({ timeout: 10000 });
    await expect(locationText).toContainText("Location:");
    await expect(locationText).not.toContainText("No coordinate selected");

    await expect
        .poll(async () => (await locationText.textContent()) ?? "")
        .not.toContain("Loading...");
    const originalLocation = (await locationText.textContent()) ?? "";

    // Weather forecast section should be visible; if not, toggle it on
    const forecastHeading = page.getByTestId("weather-forecast-heading");
    const forecastToggle = page.getByTestId("weather-forecast-toggle");
    await expect(forecastToggle).toBeVisible();
    if ((await forecastHeading.count()) === 0 || !(await forecastHeading.isVisible())) {
        await forecastToggle.click();
    }
    await expect(forecastHeading).toBeVisible({ timeout: 10000 });

    // Toggle off the weather forecast panel
    await forecastToggle.click();
    await expect(forecastHeading).toHaveCount(0);

    // Toggle on the weather forecast panel again
    await forecastToggle.click();
    await expect(forecastHeading).toBeVisible({ timeout: 10000 });

    // Verify the selected location remains unchanged
    await expect(locationText).toContainText(originalLocation);
});
