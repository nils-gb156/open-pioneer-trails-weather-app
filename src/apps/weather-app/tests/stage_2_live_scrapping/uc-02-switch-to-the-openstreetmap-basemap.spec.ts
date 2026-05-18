// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 2: Switch to the OpenStreetMap basemap", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Ensure the map is visible
    const mapContainer = page.locator("data-testid=map-container");
    await expect(mapContainer).toBeVisible();

    // Open the basemap switcher (TOC) panel
    const tocToggle = page.locator("data-testid=toc-toggle");
    await tocToggle.click();

    // Select the OpenStreetMap basemap in the dropdown
    const openStreetMapOption = page.locator('text="OpenStreetMap"');
    await openStreetMapOption.click();

    // Verify that the OpenStreetMap basemap is displayed
    const mapRoot = page.locator("data-testid=map-root");
    await expect(mapRoot).toHaveScreenshot("openstreetmap-basemap.png");

    // Ensure the previous basemap is no longer active
    const initialExtentButton = page.locator("data-testid=initial-extent-button");
    await initialExtentButton.click();
    await expect(mapContainer).toHaveScreenshot("openstreetmap-initial-extent.png");

    // Verify that the user can continue panning and zooming on the map
    const zoomInButton = page.locator("data-testid=zoom-in-button");
    await zoomInButton.click();
    await expect(mapContainer).toHaveScreenshot("openstreetmap-zoomed-in.png");

    const zoomOutButton = page.locator("data-testid=zoom-out-button");
    await zoomOutButton.click();
    await expect(mapContainer).toHaveScreenshot("openstreetmap-zoomed-out.png");
});
