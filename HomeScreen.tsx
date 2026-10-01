// HomeScreen.tsx  (Expo + React Native + TypeScript)
// Setup:  npx create-expo-app@latest claw-trade --template blank-typescript
//         cd claw-trade && npx expo install react-native-svg react-native-safe-area-context
// Then import and render <HomeScreen /> from App.tsx. Icons come from @expo/vector-icons (bundled with Expo).
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ClawLogo from "./ClawLogo";
import StockLogo from "./StockLogo";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export const C = {
  ink: "#0F1B2D", muted: "#6B7A90", green: "#2E9E57", greenSoft: "#E6F6EC",
  card: "#F1FAF4", line: "#E6ECE8", red: "#E5484D", redSoft: "#FDE8E8", amber: "#E8912D", amberSoft: "#FDF1DE",
};
// Swap for "PlayfairDisplay_700Bold" after loading it with expo-font / @expo-google-fonts/playfair-display
export const SERIF = Platform.select({ ios: "Georgia", android: "serif", default: "serif" });

// ---- sample data (replace with calls to your FastAPI backend) ----
const PORTFOLIO = { value: 10248.32, change: 2.48, totalReturn: 12.4, cash: 3210.5, positions: 5 };
const MARKETS = [
  { name: "S&P 500", value: "5,682.14", change: 1.24, data: [3, 4, 3.6, 5, 4.6, 6, 7] },
  { name: "NASDAQ", value: "17,923.61", change: 1.87, data: [2, 3.5, 3, 4.8, 5, 6.2, 7] },
  { name: "DOW JONES", value: "42,156.73", change: 0.96, data: [4, 3.4, 4.5, 4.2, 5.5, 6, 6.6] },
];
// shown when "See More" is tapped (sample data)
const MORE_MARKETS = [
  { name: "RUSSELL 2000", value: "2,214.38", change: 0.74, data: [3, 3.8, 3.4, 4.6, 4.2, 5.4, 6] },
  { name: "FTSE 100", value: "8,284.52", change: 0.31, data: [4, 3.6, 4.4, 4, 5, 4.8, 5.6] },
  { name: "NIKKEI 225", value: "38,642.09", change: 1.02, data: [2.5, 3.4, 3, 4.4, 4.9, 5.8, 6.4] },
];
type Trade = { symbol: string; side: "Buy" | "Sell"; qty: string; price: string; time: string; status: "Executed" | "Pending" | "Blocked" };
const TRADES: Trade[] = [
  { symbol: "AAPL", side: "Buy", qty: "5 shares", price: "$178.62", time: "10:24 AM", status: "Executed" },
  { symbol: "NVDA", side: "Sell", qty: "2 shares", price: "$875.32", time: "9:41 AM", status: "Executed" },
  { symbol: "TSLA", side: "Buy", qty: "3 shares", price: "$242.18", time: "9:12 AM", status: "Executed" },
  { symbol: "AMZN", side: "Buy", qty: "1 share", price: "$186.40", time: "8:50 AM", status: "Pending" },
  // shown when "View All" is tapped (sample data)
  { symbol: "MSFT", side: "Buy", qty: "2 shares", price: "$318.76", time: "8:31 AM", status: "Executed" },
  { symbol: "GOOGL", side: "Sell", qty: "1 share", price: "$171.05", time: "8:12 AM", status: "Executed" },
  { symbol: "META", side: "Buy", qty: "2 shares", price: "$512.30", time: "8:03 AM", status: "Executed" },
];

// ---- small components ----
export function Sparkline({ data, width, height, id }: { data: number[]; width: number; height: number; id: string }) {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - 3 - ((v - min) / (max - min || 1)) * (height - 6)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={C.green} stopOpacity={0.28} />
          <Stop offset="1" stopColor={C.green} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <Path d={line} stroke={C.green} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const Change = ({ v, size = 13 }: { v: number; size?: number }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Ionicons name={v >= 0 ? "caret-up" : "caret-down"} size={size} color={v >= 0 ? C.green : C.red} />
    <Text style={{ color: v >= 0 ? C.green : C.red, fontSize: size, fontWeight: "600", marginLeft: 3 }}>
      {v >= 0 ? "+" : ""}{v.toFixed(2)}%
    </Text>
  </View>
);

const SectionHeader = ({ title, action, expanded, onPress }: { title: string; action: string; expanded: boolean; onPress: () => void }) => (
  <View style={s.sectionHeader}>
    <Text style={s.sectionTitle}>{title}</Text>
    <TouchableOpacity style={s.pillBtn} onPress={onPress} activeOpacity={0.6}>
      <Text style={s.pillBtnText}>{action}</Text>
      <Ionicons name={expanded ? "arrow-up" : "arrow-down"} size={14} color={C.ink} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  </View>
);

const statusStyle = {
  Executed: { bg: C.greenSoft, fg: C.green },
  Pending: { bg: C.amberSoft, fg: C.amber },
  Blocked: { bg: C.redSoft, fg: C.red }, // use this for ArmorClaw-blocked actions
};

const Badge = ({ label, bg, fg }: { label: string; bg: string; fg: string }) => (
  <View style={[s.badge, { backgroundColor: bg }]}><Text style={[s.badgeText, { color: fg }]}>{label}</Text></View>
);

// ---- screen ----
export default function HomeScreen() {
  const [hidden, setHidden] = useState(false);
  const [moreMarkets, setMoreMarkets] = useState(false);
  const [moreTrades, setMoreTrades] = useState(false);
  const money = (n: number) => (hidden ? "••••••" : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.brand}>
            <ClawLogo size={30} />
            <Text style={s.brandText}>Claw Trade</Text>
          </View>
        </View>

        <Text style={s.greeting}>GOOD MORNING,</Text>
        <Text style={s.name}>Trader</Text>
        <Text style={s.sub}>Your AI agents are tracking the market and managing your portfolio.</Text>

        {/* Portfolio card */}
        <View style={s.portfolio}>
          <View style={s.rowBetween}>
            <TouchableOpacity style={s.row} onPress={() => setHidden(!hidden)}>
              <Text style={s.cardLabel}>Portfolio Value</Text>
              <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={16} color={C.ink} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <View style={s.livePill}><View style={s.liveDot} /><Text style={s.liveText}>Live</Text></View>
          </View>
          <View style={[s.rowBetween, { marginTop: 6 }]}>
            <View>
              <Text style={s.bigValue}>{money(PORTFOLIO.value)}</Text>
              <Change v={PORTFOLIO.change} />
            </View>
            <Sparkline data={[2, 3, 2.6, 4, 3.4, 5, 4.6, 6, 7]} width={150} height={60} id="pf" />
          </View>
          <View style={s.stats}>
            {[
              { l: "Total Return", v: `+${PORTFOLIO.totalReturn}%`, g: true },
              { l: "Cash Balance", v: money(PORTFOLIO.cash) },
              { l: "Active Positions", v: String(PORTFOLIO.positions) },
            ].map((x, i) => (
              <View key={x.l} style={[s.stat, i > 0 && s.statDivider]}>
                <Text style={s.statLabel}>{x.l}</Text>
                <Text style={[s.statValue, x.g && { color: C.green }]}>{x.v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Market overview */}
        <SectionHeader title="Market Overview" action={moreMarkets ? "See Less" : "See More"} expanded={moreMarkets} onPress={() => setMoreMarkets(!moreMarkets)} />
        {(moreMarkets ? [MARKETS, MORE_MARKETS] : [MARKETS]).map((group, g) => (
          <View key={g} style={[s.marketRow, g > 0 && { marginTop: 8 }]}>
            {group.map((m, i) => (
              <View key={m.name} style={s.marketCard}>
                <Text style={s.marketName}>{m.name}</Text>
                <Text style={s.marketValue}>{m.value}</Text>
                <View style={[s.rowBetween, { marginTop: 4 }]}>
                  <Change v={m.change} size={11} />
                  <Sparkline data={m.data} width={34} height={22} id={`m${g}${i}`} />
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Recent trades */}
        <SectionHeader title="Recent Trades" action={moreTrades ? "View Less" : "View All"} expanded={moreTrades} onPress={() => setMoreTrades(!moreTrades)} />
        <View style={s.tradesCard}>
          {(moreTrades ? TRADES : TRADES.slice(0, 4)).map((t, i) => {
            const st = statusStyle[t.status];
            const buy = t.side === "Buy";
            return (
              <View key={t.symbol + t.time} style={[s.tradeRow, i > 0 && s.tradeDivider]}>
                <StockLogo symbol={t.symbol} size={22} />
                <Text style={s.symbol}>{t.symbol}</Text>
                <Badge label={t.side} bg={buy ? C.greenSoft : C.redSoft} fg={buy ? C.green : C.red} />
                <Text style={s.qty}>{t.qty}</Text>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={s.price}>{t.price}</Text>
                  <Text style={s.time}>{t.time}</Text>
                </View>
                <Badge label={t.status} bg={st.bg} fg={st.fg} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  brand: { flexDirection: "row", alignItems: "center" },
  brandText: { fontFamily: SERIF, fontSize: 20, fontWeight: "700", color: C.ink, marginLeft: 8 },
  greeting: { marginTop: 18, fontSize: 11, letterSpacing: 1.5, color: C.muted },
  name: { fontFamily: SERIF, fontSize: 40, fontWeight: "700", color: C.ink, marginTop: 2 },
  sub: { fontSize: 14, lineHeight: 20, color: C.muted, marginTop: 6, maxWidth: 300 },
  portfolio: { marginTop: 18, backgroundColor: C.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#D7EFE0" },
  cardLabel: { fontSize: 15, color: C.muted },
  livePill: { flexDirection: "row", alignItems: "center", backgroundColor: C.greenSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green, marginRight: 6 },
  liveText: { color: C.green, fontSize: 12, fontWeight: "600" },
  bigValue: { fontSize: 30, fontWeight: "700", color: C.ink, marginBottom: 2 },
  stats: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 14, marginTop: 14, paddingVertical: 10 },
  stat: { flex: 1, paddingHorizontal: 12 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: C.line },
  statLabel: { fontSize: 11, color: C.muted },
  statValue: { fontSize: 16, fontWeight: "700", color: C.ink, marginTop: 3 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 10 },
  sectionTitle: { fontFamily: SERIF, fontSize: 20, fontWeight: "700", color: C.ink },
  pillBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: C.line, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6 },
  pillBtnText: { fontSize: 13, fontWeight: "500", color: C.ink },
  marketRow: { flexDirection: "row", gap: 8 },
  marketCard: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 10, backgroundColor: "#FBFDFC" },
  marketName: { fontSize: 10, color: C.muted },
  marketValue: { fontSize: 15, fontWeight: "700", color: C.ink, marginTop: 4 },
  tradesCard: { borderWidth: 1, borderColor: C.line, borderRadius: 16, backgroundColor: "#FBFDFC" },
  tradeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 11, paddingHorizontal: 10 },
  tradeDivider: { borderTopWidth: 1, borderTopColor: C.line },
  symbol: { width: 44, marginLeft: 8, fontSize: 12, fontWeight: "700", color: C.ink },
  qty: { marginLeft: 8, fontSize: 11, color: C.muted },
  price: { fontSize: 12, fontWeight: "600", color: C.ink },
  time: { fontSize: 10, color: C.muted },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 6 },
  badgeText: { fontSize: 10, fontWeight: "600" },
});
