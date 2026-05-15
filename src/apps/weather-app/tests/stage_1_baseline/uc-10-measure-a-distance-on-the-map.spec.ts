// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 10: Measure a distance on the map", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Step 1: Click the measurement tool button
    const measureToolButton = await page.getByRole("button", { name: "Measure" });
    await measureToolButton.click();

    // Step 2: Verify that measurement mode is activated and panel is visible
    const measurementPanel = await page.getByTestId("measurement-panel");
    await expect(measurementPanel).toBeVisible();

    // Step 3 & 4: Interact with the map to define a measurement line and end it with a double click
    const mapCanvas = await page.locator("canvas"); // Assuming there's a canvas element for the map
    await mapCanvas.click(100, 200); // First point of the line
    await mapCanvas.click(300, 400); // Second point of the line
    await mapCanvas.dblclick(300, 400); // End the measurement with a double click

    // Step 5: Verify that the measured result is displayed
    const distanceResult = await page.getByTestId("distance-result");
    await expect(distanceResult).toHaveText(/Distance:.+/);
});
