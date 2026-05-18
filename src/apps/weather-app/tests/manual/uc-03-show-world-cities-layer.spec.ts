// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-3: Show the World Cities layer", async ({ page }) => {
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

    // Find the World Cities checkbox within the TOC and toggle it via its label if possible.
    const worldCheckbox = tocPanel.getByRole("checkbox", { name: "World Cities" });
    await expect(worldCheckbox).toBeVisible({ timeout: 5000 });

    // Try to click the associated label[for=<id>] (most reliable), fallback to force-click input
    const checkboxId = await worldCheckbox.getAttribute("id");
    if (checkboxId) {
        const label = tocPanel.locator(`label[for="${checkboxId}"]`);
        if ((await label.count()) > 0) {
            await label.click();
        } else {
            await worldCheckbox.click({ force: true });
        }
    } else {
        await worldCheckbox.click({ force: true });
    }

    // Assert the checkbox becomes checked
    await expect(worldCheckbox).toBeChecked({ timeout: 5000 });

    // Verify the map canvas is still visible with the layer rendered
    const mapCanvas = page.locator("canvas").first();
    await expect(mapCanvas).toBeVisible();

    // Test that the map remains interactive
    await page.getByTestId("map-container").click({ position: { x: 100, y: 100 } });

    // Verify the map is still responsive
    await expect(mapCanvas).toBeVisible();
});
