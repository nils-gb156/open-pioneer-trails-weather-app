// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-4: Display the legend", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Basic app/map sanity
    await expect(page.getByTestId("app")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Ensure the TOC is visible and the World Cities layer is enabled (precondition)
    const tocPanel = page.getByTestId("toc-panel");
    await expect(tocPanel).toBeVisible();

    const worldCheckbox = tocPanel.getByRole("checkbox", { name: "World Cities" });
    await expect(worldCheckbox).toBeVisible();
    // If not checked, toggle via associated label or force-click the input
    if (!(await worldCheckbox.isChecked())) {
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
        await expect(worldCheckbox).toBeChecked({ timeout: 5000 });
    }

    // Open the legend using the tool button
    const legendToggle = page.getByTestId("legend-toggle");
    await expect(legendToggle).toBeVisible();
    // Click; fall back to force-click if the button is blocked/overlaid
    try {
        await legendToggle.click();
    } catch {
        await legendToggle.click({ force: true });
    }

    // Verify legend heading and content (rendered separately from TOC)
    const legendHeading = page.getByTestId("legend-heading");
    await expect(legendHeading).toBeVisible({ timeout: 7000 });
    await expect(legendHeading).toHaveText("Legend");

    const legendContent = page.getByTestId("legend-content");
    await expect(legendContent).toBeVisible();
    // Verify a known legend entry for the World Cities layer is present
    await expect(legendContent.getByText("Cities (Size by Population)")).toBeVisible();

    // Map remains interactive
    await page.getByTestId("map-container").click({ position: { x: 100, y: 100 } });
    await expect(page.locator("canvas").first()).toBeVisible();
});
