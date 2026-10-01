import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C, SERIF } from "./HomeScreen";

const Chevron = () => <Ionicons name="chevron-forward" size={18} color={C.muted} />;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Text style={s.section}>{title}</Text>
      <View style={s.card}>{children}</View>
    </>
  );
}

function Row({ icon, title, sub, right, first, onPress }: {
  icon: any; title: string; sub?: string; right?: React.ReactNode; first?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[s.rowItem, !first && s.divider]} onPress={onPress} disabled={!onPress} activeOpacity={0.6}>
      <Ionicons name={icon} size={24} color={C.ink} style={{ width: 32 }} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={s.rowTitle}>{title}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      {right}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const toggle = (v: boolean, set: (b: boolean) => void) => (
    <Switch value={v} onValueChange={set} trackColor={{ false: "#E1E5EA", true: C.green }} thumbColor="#fff" />
  );

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Settings</Text>

        <TouchableOpacity style={[s.card, s.profile]} activeOpacity={0.7}>
          <View style={s.avatar}><Ionicons name="person" size={34} color="#6B7280" /></View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.name}>Trader</Text>
            <Text style={s.email}>trader@cleantrade.app</Text>
          </View>
          <Chevron />
        </TouchableOpacity>

        <Group title="App Preferences">
          <Row first icon="notifications-outline" title="Notifications" right={toggle(notifications, setNotifications)} />
          <Row icon="stats-chart-outline" title="Price Alerts" right={toggle(priceAlerts, setPriceAlerts)} />
        </Group>

        <Group title="Security & Access">
          <Row first icon="shield-checkmark-outline" title="Permissions" sub="View your agent access matrix" right={<Chevron />} onPress={() => {}} />
          <Row icon="shield-checkmark-outline" title="Guardrails" sub="ArmorClaw protection settings" right={<Chevron />} onPress={() => {}} />
        </Group>

        <Group title="About">
          <Row first icon="information-circle-outline" title="Version" right={<Text style={s.version}>1.0.0</Text>} />
          <Row icon="help-circle-outline" title="Help & Support" right={<Chevron />} onPress={() => {}} />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { fontFamily: SERIF, fontSize: 32, fontWeight: "700", color: C.ink, marginTop: 14, marginBottom: 16 },
  card: { borderWidth: 1, borderColor: C.line, borderRadius: 16, backgroundColor: "#fff" },
  profile: { flexDirection: "row", alignItems: "center", padding: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#ECEEF1", alignItems: "center", justifyContent: "center" },
  name: { fontSize: 17, fontWeight: "600", color: C.ink },
  email: { fontSize: 13, color: C.muted, marginTop: 3 },
  section: { fontFamily: SERIF, fontSize: 18, fontWeight: "700", color: C.ink, marginTop: 24, marginBottom: 10 },
  rowItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 14 },
  divider: { borderTopWidth: 1, borderTopColor: C.line },
  rowTitle: { fontSize: 15, fontWeight: "500", color: C.ink },
  rowSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  version: { fontSize: 14, color: C.muted },
});
