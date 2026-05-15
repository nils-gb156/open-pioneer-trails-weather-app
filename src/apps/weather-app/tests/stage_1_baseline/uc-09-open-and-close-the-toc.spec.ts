// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 9: Open and close the toc", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Step 1: The user clicks the toc button.
    const tocButton = await page.getByRole("button", { name: "Table of Contents" });
    await tocButton.click();

    // Expected result 1: The toc panel is hidden after the first click.
    const tocPanel = await page.locator(".toc-panel");
    await expect(tocPanel).toHaveClass(/hidden/);

    // Step 2: The user clicks the toc button again.
    await tocButton.click();

    // Expected result 2: The toc panel is shown after the second click.
    await expect(tocPanel).not.toHaveClass(/hidden/);

    // Expected result 3: The map remains usable throughout the interaction.
    // Assuming there's a visible map container or canvas element
    const mapContainer = await page.locator(".map-container");
    await expect(mapContainer).toBeVisible();
});
