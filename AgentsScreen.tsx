import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C, SERIF } from "./HomeScreen";
import StockLogo from "./StockLogo";

// ---- sample data (replace with calls to your FastAPI backend) ----
type Item = { title: string; time: string; text: string; tags: string[] };
type Agent = {
  id: string; name: string; desc: string; icon: any; status: "Active" | "Idle";
  fg: string; soft: string; iconBg: string; border: string;
  listTitle: string; items: Item[]; toolsTitle: string; tools: { icon: any; label: string }[];
};

const AGENTS: Agent[] = [
  {
    id: "research", name: "Research Agent", icon: "search-outline", status: "Active",
    desc: "Pulls live market data and produces a structured research summary.",
    fg: C.green, soft: "#F1FAF4", iconBg: "#DDF3E4", border: "#D7EFE0",
    listTitle: "Latest Research",
    items: [
      { title: "AAPL", time: "2h ago", text: "Q3 earnings beat expectations. Positive outlook on AI integration.", tags: ["Earnings", "Bullish"] },
      { title: "NVDA", time: "5h ago", text: "Strong demand for data center GPUs. Analysts raise price target.", tags: ["AI", "Growth"] },
      { title: "TSLA", time: "8h ago", text: "Updates on autonomous driving rollout. Mixed analyst sentiment.", tags: ["Autonomous", "Neutral"] },
    ],
    toolsTitle: "Tools Access (Read Only)",
    tools: [
      { icon: "bar-chart-outline", label: "Market Data" },
      { icon: "newspaper-outline", label: "News" },
      { icon: "trending-up-outline", label: "Analysis Tools" },
    ],
  },
  {
    id: "pm", name: "Portfolio Manager", icon: "pie-chart-outline", status: "Idle",
    desc: "Decides allocations (what to hold, how much, how much risk).",
    fg: "#7C4DDB", soft: "#F8F5FF", iconBg: "#E9DDFB", border: "#E6DCF8",
    listTitle: "Latest Allocation",
    items: [{ title: "Allocation update", time: "10:20 AM", text: "Updated allocations (risk: moderate).", tags: ["Moderate risk"] }],
    toolsTitle: "Tools Access",
    tools: [
      { icon: "wallet-outline", label: "Read Portfolio" },
      { icon: "options-outline", label: "Set Allocations" },
    ],
  },
  {
    id: "trading", name: "Trading Agent", icon: "flash-outline", status: "Idle",
    desc: "Turns allocation decisions into concrete orders and sends them to Alpaca.",
    fg: "#3B82F6", soft: "#F3F7FF", iconBg: "#DCE8FD", border: "#D9E6FB",
    listTitle: "Latest Orders",
    items: [{ title: "Paper orders", time: "10:17 AM", text: "Placed 3 paper orders.", tags: ["Paper", "Executed"] }],
    toolsTitle: "Tools Access",
    tools: [
      { icon: "wallet-outline", label: "Read Portfolio" },
      { icon: "flash-outline", label: "Place Orders (Bounded)" },
    ],
  },
];

function AgentCard({ a, open, onToggle }: { a: Agent; open: boolean; onToggle: () => void }) {
  const statusBg = a.status === "Active" ? C.greenSoft : a.soft === "#F8F5FF" ? "#EDE5FB" : "#DFEAFD";
  return (
    <View style={[s.card, { backgroundColor: a.soft, borderColor: a.border }]}>
      <TouchableOpacity style={s.head} onPress={onToggle} activeOpacity={0.7}>
        <View style={[s.iconWrap, { backgroundColor: a.iconBg }]}>
          <Ionicons name={a.icon} size={26} color={a.fg} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={s.titleRow}>
            <Text style={s.name}>{a.name}</Text>
            <View style={[s.status, { backgroundColor: statusBg }]}>
              <View style={[s.dot, { backgroundColor: a.fg }]} />
              <Text style={[s.statusText, { color: a.fg }]}>{a.status}</Text>
            </View>
            <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={C.ink} style={{ marginLeft: 8 }} />
          </View>
          <Text style={s.desc}>{a.desc}</Text>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={s.body}>
          <View style={s.list}>
            <View style={s.listHead}>
              <Text style={s.listTitle}>{a.listTitle}</Text>
              <TouchableOpacity style={s.row}>
                <Text style={s.viewAll}>View All</Text>
                <Ionicons name="chevron-forward" size={14} color={C.muted} />
              </TouchableOpacity>
            </View>
            {a.items.map((it) => (
              <View key={it.title} style={s.item}>
                <StockLogo symbol={it.title} size={28} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={s.titleRow}>
                    <Text style={s.itemTitle}>{it.title}</Text>
                    <Text style={s.time}>{it.time}</Text>
                  </View>
                  <Text style={s.itemText}>{it.text}</Text>
                  <View style={s.tags}>
                    {it.tags.map((t) => (
                      <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Text style={s.toolsTitle}>{a.toolsTitle}</Text>
          <View style={s.tools}>
            {a.tools.map((t) => (
              <View key={t.label} style={s.tool}>
                <Ionicons name={t.icon} size={16} color={C.ink} />
                <Text style={s.toolText}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default function AgentsScreen() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({}); // all collapsed at start
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>AI Agents</Text>
        <Text style={s.sub}>Your trading team. Each agent has a specific role and limited access to tools.</Text>
        {AGENTS.map((a) => (
          <AgentCard key={a.id} a={a} open={!!openIds[a.id]} onToggle={() => setOpenIds({ ...openIds, [a.id]: !openIds[a.id] })} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center" },
  title: { fontFamily: SERIF, fontSize: 32, fontWeight: "700", color: C.ink, marginTop: 14 },
  sub: { fontSize: 14, lineHeight: 20, color: C.muted, marginTop: 6, marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 18, padding: 12, marginBottom: 12 },
  head: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { flex: 1, fontFamily: SERIF, fontSize: 17, fontWeight: "700", color: C.ink },
  status: { flexDirection: "row", alignItems: "center", paddingHorizontal: 9, paddingVertical: 3, borderRadius: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 11, fontWeight: "600" },
  desc: { fontSize: 12, lineHeight: 17, color: C.muted, marginTop: 3 },
  body: { marginTop: 12 },
  list: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: C.line },
  listHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12 },
  listTitle: { fontSize: 13, fontWeight: "700", color: C.ink },
  viewAll: { fontSize: 12, color: C.muted, marginRight: 2 },
  item: { flexDirection: "row", padding: 12, borderTopWidth: 1, borderTopColor: C.line },
  logo: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#EEF1F4", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 12, fontWeight: "700", color: C.ink },
  itemTitle: { fontSize: 14, fontWeight: "700", color: C.ink },
  time: { fontSize: 11, color: C.muted },
  itemText: { fontSize: 12, lineHeight: 17, color: C.muted, marginTop: 2 },
  tags: { flexDirection: "row", gap: 6, marginTop: 8 },
  tag: { backgroundColor: C.greenSoft, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  tagText: { fontSize: 11, color: C.green, fontWeight: "500" },
  toolsTitle: { fontSize: 12, color: C.ink, marginTop: 14, marginBottom: 8 },
  tools: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tool: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  toolText: { fontSize: 12, color: C.ink, marginLeft: 6 },
});
