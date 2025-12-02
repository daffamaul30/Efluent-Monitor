import LineChartCustom from "@/components/chart/LineChart";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export interface WaterQualityData {
  _id: string;
  ph: number;
  temperature: number;
  amonia: number;
  tds: number;
  classification: "Aman" | "Waspada" | "Berbahaya" | "Belum diklasifikasi";
  timestamp: string;
  __v: number;
}

const Graph = () => {
  const [data, setData] = useState<WaterQualityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.18.5:5000/api/sensor/10"
        // "https://thesis-api-kappa.vercel.app/api/sensor/1"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      setData(result?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (key: keyof WaterQualityData) =>
    [...data]
      .sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))
      .map((item, i) => ({
        label: i % 10 === 0 ? moment(item.timestamp).format("HH:mm") : "",
        value: item[key] as number,
      }));

  const [key, setKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setKey((prev) => prev + 1);
    }, [])
  );

  return (
    <SafeAreaProvider key={key !== 1 ? key : 0}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: 20,
          paddingTop: 50,
          backgroundColor: "#fff",
        }}
      >
        Histori Parameter Air
      </Text>
      {loading ? (
        <View
          style={{
            backgroundColor: "#FFF",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <ScrollView style={{ backgroundColor: "#FFF", flex: 1 }}>
          {/* pH */}
          <LineChartCustom
            data={getChartData("ph")}
            label="pH"
            color="#155dfc"
            noOfSections={2}
            maxValue={14}
          />

          {/* Suhu */}
          <LineChartCustom
            data={getChartData("temperature")}
            label="Suhu"
            color="#fb2c36"
            noOfSections={2}
            maxValue={40}
          />

          {/* TDS */}
          <LineChartCustom
            data={getChartData("tds")}
            label="TDS"
            color="#00a63e"
            noOfSections={2}
            maxValue={700}
          />

          {/* Gas NH3 */}
          <LineChartCustom
            data={getChartData("amonia")}
            label="Gas Amonia (NH3)"
            color="#9810fa"
            noOfSections={2}
            maxValue={5}
          />
        </ScrollView>
      )}
    </SafeAreaProvider>
  );
};

export default Graph;
