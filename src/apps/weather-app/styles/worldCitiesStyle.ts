// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { FeatureLike } from "ol/Feature";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

export const worldCitiesRenderer = {
    type: "simple",
    symbol: {
        type: "simple-marker",
        color: "rgba(217, 95, 14, 0.45)",
        outline: {
            color: "rgba(255, 255, 255, 0.9)",
            width: 1.25
        }
    },
    visualVariables: [
        {
            type: "sizeInfo",
            field: "POP",
            minDataValue: 100000,
            maxDataValue: 14000000,
            minSize: 6,
            maxSize: 26
        }
    ]
} as const;

const cityStyleCache = new Map<number, Style>();

function getPopulationSize(population: number): number {
    const sizeVariable = worldCitiesRenderer.visualVariables[0];
    const clampedPopulation = Math.min(
        Math.max(population, sizeVariable.minDataValue),
        sizeVariable.maxDataValue
    );
    const scale =
        (clampedPopulation - sizeVariable.minDataValue) /
        (sizeVariable.maxDataValue - sizeVariable.minDataValue);

    return sizeVariable.minSize + scale * (sizeVariable.maxSize - sizeVariable.minSize);
}

export function getCityStyle(feature: FeatureLike): Style {
    const sizeVariable = worldCitiesRenderer.visualVariables[0];
    const populationValue = Number(feature.get(sizeVariable.field));
    const population = Number.isFinite(populationValue)
        ? populationValue
        : sizeVariable.minDataValue;

    const radius = Math.round(getPopulationSize(population));
    const cachedStyle = cityStyleCache.get(radius);
    if (cachedStyle) {
        return cachedStyle;
    }

    const style = new Style({
        image: new CircleStyle({
            radius,
            fill: new Fill({ color: "rgba(217, 95, 14, 0.45)" }),
            stroke: new Stroke({ color: "rgba(255, 255, 255, 0.9)", width: 1.25 })
        })
    });

    cityStyleCache.set(radius, style);
    return style;
}
