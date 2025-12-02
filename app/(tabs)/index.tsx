import TanggalWaktuSekarang from "@/components/general/Date";
import MqttClientScreen from "@/components/monitoring/RealTimeMonitoring";
import React from "react";
import { ScrollView, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Index = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF"
        translucent={false}
      />
      <ScrollView
        style={{ backgroundColor: "#FFF", flex: 1, paddingVertical: 50 }}
      >
        <TanggalWaktuSekarang />
        <MqttClientScreen />
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Index;
