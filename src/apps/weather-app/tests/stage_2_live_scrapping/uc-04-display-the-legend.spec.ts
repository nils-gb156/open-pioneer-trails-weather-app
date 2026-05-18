// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 4: Display the legend", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Click the legend tool button
    await page.getByTestId("legend-toggle").click();

    // Verify that the legend panel is visible
    const legendPanel = page.getByTestId("toc-panel");
    await expect(legendPanel).toBeVisible();

    // Verify that legend entries for active layers are displayed
    const legendEntries = legendPanel.locator(".legend-entry");
    await expect(legendEntries).toHaveCountGreaterThan(0);

    // Verify that the user can inspect the map symbols
    // This step is more about ensuring the UI is set up correctly, so we just check if the entries are visible
    await expect(legendEntries.first()).toBeVisible();
});
