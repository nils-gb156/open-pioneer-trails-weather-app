// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-5: Display coordinates of a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Verify the app and map are loaded
    await expect(page.getByTestId("app")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Verify location viewer starts empty
    const locationEmpty = page.getByTestId("location-empty");
    await expect(locationEmpty).toBeVisible();

    // Click on the map to select a location
    await page.getByTestId("map-container").click({ position: { x: 200, y: 200 } });

    // Verify longitude and latitude are displayed
    const longitude = page.getByTestId("location-longitude");
    const latitude = page.getByTestId("location-latitude");
    await expect(longitude).toBeVisible({ timeout: 5000 });
    await expect(latitude).toBeVisible();

    // Verify coordinates are present and formatted
    await expect(longitude).toContainText("Lon:");
    await expect(latitude).toContainText("Lat:");
});
