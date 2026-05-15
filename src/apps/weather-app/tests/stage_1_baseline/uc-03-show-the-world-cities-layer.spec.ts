// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 3: Show the World Cities layer", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the map to be visible
    await expect(page.locator("canvas")).toBeVisible();

    // Open the layer-switcher (toc)
    const tocButton = page.getByRole("button", { name: "Layer Switcher" });
    await tocButton.click();

    // Enable the World Cities layer
    const worldCitiesCheckbox = page.getByLabel("World Cities");
    await worldCitiesCheckbox.check();

    // Verify that the World Cities layer is visible on the map
    const cityFeature = page.locator(".city-feature"); // Assuming there's a class for city features
    await expect(cityFeature).toBeVisible();

    // Verify that the map remains interactive
    const mapCanvas = page.locator("canvas");
    await mapCanvas.click(); // Clicking on the map to check interactivity
});
