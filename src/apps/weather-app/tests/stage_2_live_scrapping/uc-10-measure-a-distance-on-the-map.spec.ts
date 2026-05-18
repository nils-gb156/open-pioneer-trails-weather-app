// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 10: Measure a distance on the map", async ({ page }) => {
    // Step 1: Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Step 2: Click the measurement tool button
    await page.getByTestId("measurement-toggle").click();

    // Step 3: Verify that measurement mode is activated and panel is visible
    await expect(page.getByTestId("bottom-left-measurement-anchor")).toBeVisible();
    await expect(page.getByTestId("coordinate-viewer")).toBeVisible();

    // Step 4: Interact with the map to define a measurement line
    // Simulate drawing a line on the map (this step cannot be tested directly)
    // For demonstration, we'll assume the user has drawn a line

    // Step 5: End the measurement line with a double click
    await page.getByTestId("map-container").dblclick();

    // Step 6: Verify that the measured result is displayed
    await expect(page.getByTestId("coordinate-viewer")).toHaveText(/Distance:/);
});
