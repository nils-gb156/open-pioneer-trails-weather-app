// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-1: Display the default weather map", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to fully load and initialize
    await page.waitForLoadState("networkidle");

    // Verify the app is loaded
    await expect(page.getByTestId("app")).toBeVisible();

    // Verify the map canvas is rendered (indicates map is visible and initialized)
    const mapCanvas = page.locator("canvas").first();
    await expect(mapCanvas).toBeVisible();

    // Verify the map controls panel and operational layers are loaded
    await expect(page.getByTestId("map-controls-panel")).toBeVisible();
    await expect(page.getByTestId("toc-panel")).toBeVisible();

    // Test map interactivity by clicking on the map container
    await page.getByTestId("map-container").click({ position: { x: 100, y: 100 } });

    // Verify the map is still responsive after interaction
    await expect(mapCanvas).toBeVisible();
});
