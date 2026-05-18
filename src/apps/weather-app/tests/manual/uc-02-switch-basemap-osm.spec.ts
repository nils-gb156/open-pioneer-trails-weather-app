// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-2: Switch to the OpenStreetMap basemap", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to fully load and initialize
    await page.waitForLoadState("networkidle");

    // Verify the app and map are loaded
    await expect(page.getByTestId("app")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Verify the TOC panel is visible
    const tocPanel = page.getByTestId("toc-panel");
    await expect(tocPanel).toBeVisible();

    // Find and click the Basemaps dropdown/combobox within the TOC
    const basemapsCombobox = tocPanel.getByRole("combobox", { name: "Basemaps" });
    await expect(basemapsCombobox).toBeVisible();
    await basemapsCombobox.click();

    // Wait for the dropdown options to appear and select OpenStreetMap
    const openStreetMapOption = page.getByRole("option", { name: "OpenStreetMap" });
    await expect(openStreetMapOption).toBeVisible();
    await openStreetMapOption.click();

    // Verify OpenStreetMap is now selected (displayed in the combobox)
    await expect(basemapsCombobox).toContainText("OpenStreetMap");

    // Verify the map is still interactive
    await page.getByTestId("map-container").click({ position: { x: 100, y: 100 } });

    // Verify the map canvas is still visible
    await expect(page.locator("canvas").first()).toBeVisible();
});
