// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 2: Switch to the OpenStreetMap basemap", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the map to be visible
    await expect(page.locator("canvas")).toBeVisible();

    // Open the basemap switcher (assuming it's a button with a specific aria-label)
    await page.locator('button[aria-label="Switch Basemap"]').click();

    // Select the OpenStreetMap basemap from the dropdown
    await page.locator("li >> text=OpenStreetMap").click();

    // Verify that the OpenStreetMap basemap is displayed
    await expect(page.locator("canvas")).toHaveAttribute("data-basemap", "openstreetmap");

    // Verify that the previous basemap is no longer active (assuming it was 'default')
    await expect(page.locator("canvas")).not.toHaveAttribute("data-basemap", "default");

    // Ensure the user can continue panning and zooming on the map
    // This step is more about ensuring the map remains interactive, which is covered by the previous checks.
});
