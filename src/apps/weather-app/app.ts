// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { createCustomElement } from "@open-pioneer/runtime"; // (1)
import * as appMetadata from "open-pioneer:app"; // (2)
import { AppUI } from "./AppUI"; // (3)

// (4)
const Element = createCustomElement({
    component: AppUI,
    appMetadata
});

// (5)
customElements.define("weather-app-element", Element);
