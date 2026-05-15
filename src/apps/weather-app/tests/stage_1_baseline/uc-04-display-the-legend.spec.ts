// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 4: Display the legend", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Click the legend tool button
    await page.getByRole("button", { name: "Legend" }).click();

    // Verify that the legend panel is visible
    const legendPanel = page.locator(".legend-panel");
    await expect(legendPanel).toBeVisible();

    // Verify that legend entries for active layers are displayed
    const worldCitiesLayerEntry = legendPanel.getByText("World Cities");
    await expect(worldCitiesLayerEntry).toBeVisible();

    // Verify that the user can inspect map symbols
    // Assuming there is a symbol in the legend entry that can be interacted with
    const symbol = worldCitiesLayerEntry.locator(".legend-symbol");
    await expect(symbol).toBeVisible();
});
