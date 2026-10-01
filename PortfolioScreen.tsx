import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ClawLogo from "./ClawLogo";
import { C, SERIF, Sparkline } from "./HomeScreen";

// ---- sample data (replace with calls to your FastAPI backend) ----
const RANGES = ["1D", "1W", "1M", "3M", "1Y"] as const;
type Range = (typeof RANGES)[number];
const CHART: Record<Range, number[]> = {
  "1D": [2, 3, 2.6, 4, 3.4, 5, 4.6, 6, 7],
  "1W": [3, 2.5, 4, 3.8, 5, 4.4, 6.2, 6.6],
  "1M": [2, 3.2, 2.8, 4.4, 5.2, 4.8, 6.4, 7],
  "3M": [1, 2.4, 2, 3.6, 4.2, 5.4, 5, 7],
  "1Y": [1, 1.6, 2.8, 2.4, 4, 5.2, 6, 7.2],
};
const HOLDINGS = [
  { symbol: "AAPL", shares: 10, avg: "$145.32", value: "$1,453.20", pl: 1.32 },
  { symbol: "MSFT", shares: 8, avg: "$318.76", value: "$2,550.08", pl: 2.17 },
  { symbol: "NVDA", shares: 5, avg: "$742.10", value: "$3,710.50", pl: 3.04 },
  { symbol: "TSLA", shares: 3, avg: "$201.42", value: "$604.26", pl: 0.86 },
];
const ACTIVITY = [
  { agent: "Research Agent", icon: "search-outline", text: "Completed market analysis (AAPL, MSFT, NVDA)", time: "10:24 AM" },
  { agent: "Portfolio Manager", icon: "pie-chart-outline", text: "Updated allocations (risk: moderate)", time: "10:20 AM" },
  { agent: "Trading Agent", icon: "flash-outline", text: "Placed 3 paper orders", time: "10:17 AM" },
];

export default function PortfolioScreen() {
  const [range, setRange] = useState<Range>("1D");
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.row}>
            <ClawLogo size={30} />
            <Text style={s.brand}>Claw Trade</Text>
          </View>
        </View>

        <Text style={s.title}>Portfolio</Text>

        <View style={s.valueCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.cardLabel}>Portfolio Value (Paper)</Text>
            <Text style={s.value}>$10,248.32</Text>
            <View style={s.row}>
              <Ionicons name="caret-up" size={13} color={C.green} />
              <Text style={s.change}>+2.48% (24h)</Text>
            </View>
          </View>
          <Sparkline data={CHART[range]} width={140} height={64} id="pfchart" />
        </View>

        <View style={s.ranges}>
          {RANGES.map((r) => (
            <TouchableOpacity key={r} onPress={() => setRange(r)} style={[s.range, r === range && s.rangeOn]}>
              <Text style={[s.rangeText, r === range && { color: "#fff" }]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.section}>Holdings</Text>
        <View style={s.tableHead}>
          {["Symbol", "Shares", "Avg Cost", "Market Value", "P&L"].map((h, i) => (
            <Text key={h} style={[s.th, COL[i], i === 4 && { textAlign: "right" }]}>{h}</Text>
          ))}
        </View>
        {HOLDINGS.map((h) => (
          <View key={h.symbol} style={s.tr}>
            <Text style={[s.symbol, COL[0]]}>{h.symbol}</Text>
            <Text style={[s.td, COL[1]]}>{h.shares}</Text>
            <Text style={[s.td, COL[2]]}>{h.avg}</Text>
            <Text style={[s.td, COL[3]]}>{h.value}</Text>
            <Text style={[s.pl, COL[4]]}>+{h.pl.toFixed(2)}%</Text>
          </View>
        ))}

        <Text style={[s.section, { marginTop: 26 }]}>Recent Activity</Text>
        <View style={s.activity}>
          {ACTIVITY.map((a, i) => (
            <View key={a.agent} style={[s.actRow, i > 0 && s.actDivider]}>
              <View style={s.actIcon}><Ionicons name={a.icon as any} size={22} color={C.ink} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.actAgent}>{a.agent}</Text>
                <Text style={s.actText}>{a.text}</Text>
              </View>
              <Text style={s.actTime}>{a.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Column widths for the holdings table
const COL = [{ flex: 1.1 }, { flex: 0.9 }, { flex: 1.2 }, { flex: 1.5 }, { flex: 1 }];

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  brand: { fontFamily: SERIF, fontSize: 20, fontWeight: "700", color: C.ink, marginLeft: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.greenSoft, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: SERIF, fontSize: 32, fontWeight: "700", color: C.ink, marginTop: 14 },
  valueCard: { flexDirection: "row", alignItems: "center", marginTop: 14, backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#D7EFE0" },
  cardLabel: { fontSize: 13, color: C.muted },
  value: { fontSize: 30, fontWeight: "700", color: C.ink, marginVertical: 4 },
  change: { fontSize: 14, fontWeight: "600", color: C.green, marginLeft: 4 },
  ranges: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  range: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 18 },
  rangeOn: { backgroundColor: "#1F6B3A" },
  rangeText: { fontSize: 13, color: C.muted, fontWeight: "500" },
  section: { fontFamily: SERIF, fontSize: 20, fontWeight: "700", color: C.ink, marginTop: 22, marginBottom: 10 },
  tableHead: { flexDirection: "row", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.line },
  th: { fontSize: 11, color: C.muted },
  tr: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.line },
  symbol: { fontSize: 13, fontWeight: "700", color: C.ink },
  td: { fontSize: 12, color: C.ink },
  pl: { fontSize: 12, fontWeight: "600", color: C.green, textAlign: "right" },
  activity: { borderWidth: 1, borderColor: C.line, borderRadius: 16, backgroundColor: "#FBFDFC" },
  actRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  actDivider: { borderTopWidth: 1, borderTopColor: C.line },
  actIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.greenSoft, alignItems: "center", justifyContent: "center" },
  actAgent: { fontSize: 13, fontWeight: "700", color: C.ink },
  actText: { fontSize: 11, color: C.muted, marginTop: 3 },
  actTime: { fontSize: 11, color: C.muted, alignSelf: "flex-start" },
});
