// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL ?? "http://localhost:5173/");
});

// The TOC renders inside the left "Map controls" box. Use the "Basemaps" heading
// that the Toc component always renders as a reliable anchor for the locator.
const tocSelector = '[aria-label="Map controls"]';

test("TOC is visible by default", async ({ page }) => {
    // tocIsActive starts as true, so the TOC container must be visible immediately.
    const toc = page.locator(tocSelector, { hasText: "Basemaps" });
    await expect(toc).toBeVisible();
});
