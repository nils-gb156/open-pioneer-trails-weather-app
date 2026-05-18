// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-9: Open and close the toc", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Basic app/map sanity
    await expect(page.getByTestId("app")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();

    // TOC should be visible by default
    const tocPanel = page.getByTestId("toc-panel");
    await expect(tocPanel).toBeVisible();

    // Toggle TOC off
    const tocToggle = page.getByTestId("toc-toggle");
    await expect(tocToggle).toBeVisible();
    await tocToggle.click();
    await expect(tocPanel).toHaveCount(0);

    // Toggle TOC on
    await tocToggle.click();
    await expect(tocPanel).toBeVisible({ timeout: 10000 });

    // Map remains usable
    await page.getByTestId("map-container").click({ position: { x: 120, y: 120 } });
    await expect(page.locator("canvas").first()).toBeVisible();
});
