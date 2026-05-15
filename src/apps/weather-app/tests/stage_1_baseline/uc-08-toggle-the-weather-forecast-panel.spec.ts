// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 8: Toggle the weather forecast panel", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Assume there is a button with an aria-label for toggling the weather forecast panel
    const toggleButton = page.getByRole("button", { name: "Toggle Weather Forecast" });

    // Click the toggle button to show the weather forecast panel
    await toggleButton.click();

    // Expect the weather forecast panel to be visible
    const weatherPanel = page.getByTestId("weather-forecast-panel");
    await expect(weatherPanel).toBeVisible();

    // Click the toggle button again to hide the weather forecast panel
    await toggleButton.click();

    // Expect the weather forecast panel to be hidden
    await expect(weatherPanel).not.toBeVisible();
});
