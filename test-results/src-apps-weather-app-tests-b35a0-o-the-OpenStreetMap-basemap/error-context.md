# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src\apps\weather-app\tests\generated\uc-02-switch-to-the-openstreetmap-basemap.spec.ts >> Use Case 2: Switch to the OpenStreetMap basemap
- Location: src\apps\weather-app\tests\generated\uc-02-switch-to-the-openstreetmap-basemap.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('img', { name: 'map' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('img', { name: 'map' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
      - generic [ref=e4]:
            - region "Header Bar" [ref=e5]:
                  - generic [ref=e6]:
                        - heading "Open Pioneer Trails - Weather App" [level=2] [ref=e7]
                        - button "Use Cases" [ref=e9] [cursor=pointer]
            - generic "Weather map" [ref=e12]:
                  - application "Weather map" [ref=e13]
                  - generic:
                        - generic "Map controls" [ref=e21]:
                              - generic [ref=e22]:
                                    - generic [ref=e23]:
                                          - heading "Basemaps" [level=1] [ref=e24]
                                          - generic "Basemaps" [ref=e25]:
                                                - generic [ref=e27]:
                                                      - combobox "Basemaps" [ref=e28] [cursor=pointer]:
                                                            - generic [ref=e30]: ArcGIS Gray Vector
                                                      - generic:
                                                            - generic:
                                                                  - img
                                    - generic [ref=e31]:
                                          - heading "Operational layers Map tools" [level=1] [ref=e32]:
                                                - generic [ref=e33]:
                                                      - paragraph [ref=e34]: Operational layers
                                                      - button "Map tools" [ref=e37] [cursor=pointer]:
                                                            - img [ref=e38]
                                          - list "Operational layers" [ref=e42]:
                                                - listitem [ref=e43]:
                                                      - generic "World Cities" [ref=e45] [cursor=pointer]:
                                                            - checkbox "World Cities" [ref=e46]
                                                            - img [ref=e48]
                                                            - generic [ref=e49]: World Cities
                        - generic "Map controls" [ref=e52]:
                              - heading "Location Viewer" [level=1] [ref=e53]
                              - paragraph [ref=e54]: Click in the map!
                              - separator [ref=e55]
                              - heading "Weather Forecast" [level=1] [ref=e56]
                              - paragraph [ref=e57]:
                                    - strong [ref=e58]: "Location:"
                                    - text: No coordinate selected
                        - generic "Maptools" [ref=e60]:
                              - button "Weather Forecast" [pressed] [ref=e61] [cursor=pointer]:
                                    - img [ref=e62]
                              - button "Layer Switcher" [pressed] [ref=e67] [cursor=pointer]:
                                    - img [ref=e68]
                              - button "Legend" [ref=e69] [cursor=pointer]:
                                    - img [ref=e70]
                              - button "Measurement" [ref=e75] [cursor=pointer]:
                                    - img [ref=e76]
                              - button "Zoom to initial extent" [ref=e82] [cursor=pointer]:
                                    - img [ref=e83]
                              - button "Zoom in map" [ref=e86] [cursor=pointer]:
                                    - img [ref=e87]
                              - button "Zoom out map" [ref=e88] [cursor=pointer]:
                                    - img [ref=e89]
            - region "Footer Bar" [ref=e90]:
                  - region [ref=e91]:
                        - generic:
                              - paragraph
                        - generic [ref=e92]:
                              - generic:
                                    - generic: 50 km
                        - region "Scale" [ref=e93]:
                              - generic [ref=e94]: "Current scale: 1 to 2739072"
                              - paragraph [ref=e95]: 1:2,739,072
      - region "Notifications"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Use Case 2: Switch to the OpenStreetMap basemap', async ({ page }) => {
  4  |     // Navigate to the app
  5  |     await page.goto('http://localhost:5173/open-pioneer-trails-weather-app/');
  6  |
  7  |     // Wait for the map to be visible
> 8  |     await expect(page.getByRole('img', { name: 'map' })).toBeVisible();
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  9  |
  10 |     // Open the basemap switcher (assuming it's a button with a specific aria-label)
  11 |     await page.getByLabel('Basemap Switcher').click();
  12 |
  13 |     // Select the OpenStreetMap basemap from the dropdown
  14 |     await page.getByText('OpenStreetMap').click();
  15 |
  16 |     // Verify that the OpenStreetMap basemap is displayed
  17 |     await expect(page.getByRole('img', { name: 'map' })).toHaveAttribute('src', /openstreetmap/);
  18 |
  19 |     // Verify that the previous basemap is no longer active (assuming it had a specific class)
  20 |     await expect(page.locator('.previous-basemap-class')).not.toBeVisible();
  21 |
  22 |     // Ensure the user can continue panning and zooming on the map
  23 |     // This step is more about ensuring the map remains interactive, so we just check if the map container is still present
  24 |     await expect(page.getByRole('img', { name: 'map' })).toBeVisible();
  25 | });
  26 |
```
