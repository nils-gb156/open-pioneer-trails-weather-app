// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-10: Measure a distance on the map", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Basic app/map sanity
    await expect(page.getByTestId("app")).toBeVisible();
    const mapContainer = page.getByTestId("map-container");
    await expect(mapContainer).toBeVisible();

    // Activate measurement tool
    const measurementToggle = page.getByTestId("measurement-toggle");
    await expect(measurementToggle).toBeVisible();
    await measurementToggle.click();

    // Measurement panel should be visible
    const measurementPanel = page.getByTestId("measurement-panel");
    await expect(measurementPanel).toBeVisible();
    await expect(page.getByTestId("measurement-content")).toBeVisible();

    // Draw a measurement line on the map (click, click, double-click to finish)
    await mapContainer.click({ position: { x: 200, y: 200 } });
    await mapContainer.click({ position: { x: 320, y: 240 } });
    await mapContainer.dblclick({ position: { x: 380, y: 280 } });

    // Verify measurement result is displayed (distance tooltip in the map area)
    const mapApp = page.getByRole("application", { name: "Weather map" });
    await expect(mapApp.getByText(/\b\d+(\.\d+)?\s?km\b/i)).toBeVisible({ timeout: 5000 });
});
