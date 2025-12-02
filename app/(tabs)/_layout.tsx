import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import AntIcon from "react-native-vector-icons/AntDesign";
import FAIcon6 from "react-native-vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#000080",
        tabBarInactiveTintColor: "#808080",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Monitor",
          tabBarIcon: ({ focused }) => (
            <AntIcon
              name="monitor"
              color={focused ? "#000080" : "#808080"}
              size={focused ? 30 : 25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="graph"
        options={{
          title: "Histori",
          tabBarIcon: ({ focused }) => (
            <FAIcon6
              name="chart-line"
              color={focused ? "#000080" : "#808080"}
              size={focused ? 30 : 25}
            />
          ),
        }}
      />
    </Tabs>
  );
}
