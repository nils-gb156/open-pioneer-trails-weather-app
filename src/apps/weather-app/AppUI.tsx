// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Map } from "./components/Map";
import { Header } from "./components/Header";

export function AppUI() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
            <Header />
            <div style={{ flex: 1, overflow: "hidden" }}>
                <Map />
            </div>
        </div>
    );
}
