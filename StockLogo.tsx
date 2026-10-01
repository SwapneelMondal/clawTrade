import React from "react";
import { View, Text, Image } from "react-native";

// One image per company, saved in assets/logos/. Names must match exactly (lowercase).
// If a file is a PNG instead of WebP, change its extension on the matching line below.
const aapl = require("./assets/logos/aapl.webp");
const nvda = require("./assets/logos/nvda.webp");
const tsla = require("./assets/logos/tsla.webp");
const amzn = require("./assets/logos/amzn.webp");
const msft = require("./assets/logos/msft.webp");
const googl = require("./assets/logos/googl.webp");
const meta = require("./assets/logos/meta.webp");

const LOGOS: Record<string, any> = {
  AAPL: aapl,
  NVDA: nvda,
  TSLA: tsla,
  AMZN: amzn,
  MSFT: msft,
  GOOGL: googl,
  GOGL: googl, // alias, in case the symbol is written GOGL
  META: meta,
};

export default function StockLogo({ symbol, size = 22 }: { symbol: string; size?: number }) {
  const src = LOGOS[symbol];
  if (src) return <Image source={src} style={{ width: size, height: size }} resizeMode="contain" />;
  // No logo for this symbol: show a letter circle instead
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#EEF1F4", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: size * 0.5, fontWeight: "700", color: "#0F1B2D" }}>{symbol[0]}</Text>
    </View>
  );
}
