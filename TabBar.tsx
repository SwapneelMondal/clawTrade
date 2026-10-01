import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "./HomeScreen";

export type Tab = "Home" | "Portfolio" | "Agents" | "Settings";
const TABS: { name: Tab; icon: any; active: any }[] = [
  { name: "Home", icon: "home-outline", active: "home" },
  { name: "Portfolio", icon: "stats-chart-outline", active: "stats-chart" },
  { name: "Agents", icon: "hardware-chip-outline", active: "hardware-chip" },
  { name: "Settings", icon: "settings-outline", active: "settings" },
];

export default function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {TABS.map((t) => {
        const on = t.name === active;
        return (
          <TouchableOpacity key={t.name} style={s.tab} onPress={() => onChange(t.name)}>
            <Ionicons name={on ? t.active : t.icon} size={24} color={on ? C.green : C.muted} />
            <Text style={[s.text, on && { color: C.green, fontWeight: "600" }]}>{t.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: 1, borderTopColor: C.line, backgroundColor: "#fff", paddingTop: 8 },
  tab: { flex: 1, alignItems: "center" },
  text: { fontSize: 11, color: C.muted, marginTop: 3 },
});
