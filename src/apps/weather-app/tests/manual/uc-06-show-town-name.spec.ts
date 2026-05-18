// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test("UC-6: Show the town name for a clicked location", async ({ page }) => {
    // Navigate to the app
    await page.goto("http://localhost:5173/open-pioneer-trails-weather-app/");

    // Wait for the app to initialize
    await page.waitForLoadState("networkidle");

    // Basic app/map sanity
    await expect(page.getByTestId("app")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Verify initial empty state in the weather card
    const emptyLocation = page.getByTestId("weathercard-empty");
    await expect(emptyLocation).toBeVisible();

    // Click on the map to set a location
    await page.getByTestId("map-container").click({ position: { x: 220, y: 220 } });

    // Verify a place name is displayed (town/city/village/county or Unknown)
    const locationText = page.getByTestId("weathercard-location");
    await expect(locationText).toBeVisible({ timeout: 10000 });
    await expect(locationText).toContainText("Location:");
    await expect(locationText).not.toContainText("No coordinate selected");

    // Wait until the location is resolved (not Loading...)
    await expect
        .poll(async () => (await locationText.textContent()) ?? "")
        .not.toContain("Loading...");

    // Ensure the empty state is gone
    await expect(emptyLocation).toBeHidden();
});
