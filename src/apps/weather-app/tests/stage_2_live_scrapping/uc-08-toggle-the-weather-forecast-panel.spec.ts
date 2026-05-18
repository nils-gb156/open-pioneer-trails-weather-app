// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("Use Case 8: Toggle the weather forecast panel", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Step 1: Click the weather forecast tool button to show the panel
    const weatherForecastToggle = page.getByTestId("weather-forecast-toggle");
    await weatherForecastToggle.click();

    // Expectation 1: The weather forecast panel is visible
    const weatherForecastHeading = page.getByTestId("weather-forecast-heading");
    await expect(weatherForecastHeading).toBeVisible();

    // Step 2: Click the weather forecast tool button again to hide the panel
    await weatherForecastToggle.click();

    // Expectation 2: The weather forecast panel is hidden
    await expect(weatherForecastHeading).not.toBeVisible();

    // Step 3: Click the weather forecast tool button again to show the panel
    await weatherForecastToggle.click();

    // Expectation 3: The weather forecast panel is visible again
    await expect(weatherForecastHeading).toBeVisible();
});
