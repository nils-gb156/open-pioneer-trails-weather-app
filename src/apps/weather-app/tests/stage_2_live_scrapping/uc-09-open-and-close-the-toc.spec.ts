// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 9: Open and close the toc", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Step 1: The user clicks the toc button.
    await page.getByTestId("toc-toggle").click();

    // Expected result 1: The toc panel is hidden after the first click.
    await expect(page.getByTestId("toc-panel")).not.toBeVisible();

    // Step 2: The user clicks the toc button again.
    await page.getByTestId("toc-toggle").click();

    // Expected result 2: The toc panel is shown after the second click.
    await expect(page.getByTestId("toc-panel")).toBeVisible();

    // Expected result 3: The map remains usable throughout the interaction.
    // This can be indirectly verified by checking if other elements are still visible and interactive
    await expect(page.getByTestId("map-container")).toBeVisible();
    await expect(page.getByTestId("zoom-in-button")).toBeEnabled();
    await expect(page.getByTestId("zoom-out-button")).toBeEnabled();
});
