import React, { useState } from "react";
import { View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./HomeScreen";
import PortfolioScreen from "./PortfolioScreen";
import AgentsScreen from "./AgentsScreen";
import SettingsScreen from "./SettingsScreen";
import TabBar, { Tab } from "./TabBar";

function Root() {
  const [tab, setTab] = useState<Tab>("Home");
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        {tab === "Home" && <HomeScreen />}
        {tab === "Portfolio" && <PortfolioScreen />}
        {tab === "Agents" && <AgentsScreen />}
        {tab === "Settings" && <SettingsScreen />}
      </View>
      <TabBar active={tab} onChange={setTab} />
    </View>
  );
}

export default function App() {
  const app = (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
  if (Platform.OS !== "web") return app;
  // On a laptop browser, show the app inside a phone-sized frame
  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b", alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: 390, height: 844, maxHeight: "100%", backgroundColor: "#fff", borderRadius: 24, overflow: "hidden" }}>
        {app}
      </View>
    </View>
  );
}
