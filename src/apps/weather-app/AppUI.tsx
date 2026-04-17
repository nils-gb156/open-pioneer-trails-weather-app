// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Notifier } from "@open-pioneer/notifier";
import { Map } from "./components/Map";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export function AppUI() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
            <Notifier />
            <Header />
            <div style={{ flex: 1, overflow: "hidden" }}>
                <Map />
            </div>
            <Footer />
        </div>
    );
}
