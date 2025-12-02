import { format } from "date-fns";
import { id } from "date-fns/locale";
import mqtt, { MqttClient } from "mqtt";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

type DataSensor = {
  amonia: number;
  classification: "Aman" | "Berbahaya" | "Waspada";
  ph: number;
  temperature: number;
  tds: number;
};

interface WaterQualityData {
  _id: string;
  ph: number;
  temperature: number;
  amonia: number;
  tds: number;
  classification: "Aman" | "Waspada" | "Berbahaya" | "Belum diklasifikasi";
  timestamp: string;
  __v: number;
}

export default function MqttClientScreen() {
  const [message, setMessage] = useState<DataSensor | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [data, setData] = useState<WaterQualityData>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.18.5:5000/api/sensor/latest"
        // "https://thesis-api-kappa.vercel.app/api/sensor/latest"
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

  useEffect(() => {
    const client: MqttClient = mqtt.connect(
      "wss://c1e8b4ae4ea04d9ea2f2696fb9ab84cd.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "thesis",
        password: "Thesis2025",
        connectTimeout: 4000,
        clean: true,
        reconnectPeriod: 1000,
      }
    );

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe({
        "sensor/limbah": { qos: 0 },
        "system/classify": { qos: 0 },
      });
    });

    client.on("message", (topic: string, payload: any) => {
      try {
        const msg = JSON.parse(payload.toString());
        console.log("Received:", msg);

        if (topic === "sensor/limbah") {
          setMessage(msg);
        }
        if (topic === "system/classify") {
          setClassification(msg);
        }
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    if (!message) {
      fetchData();
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.status}>
          Status:{" "}
          {classification || data?.classification || "Sensor tidak aktif"}
        </Text>
        {!message ? (
          <Text
            style={{ textAlign: "center", marginTop: -10, marginBottom: 10 }}
          >
            Data terakhir pada :{" "}
            {data?.timestamp
              ? format(data.timestamp, "EEEE, dd MMMM yyyy", { locale: id })
              : "-"}
          </Text>
        ) : null}

        <View style={styles.row}>
          {/* pH */}
          <View style={styles.card}>
            <Text style={[styles.value, { color: "#2563eb" }]}>
              {message?.ph === 0.0 ? "Off" : message?.ph || data?.ph || "-"}
            </Text>
            <Text style={styles.label}>pH</Text>
          </View>

          {/* Suhu */}
          <View style={styles.card}>
            <Text style={[styles.value, { color: "#dc2626" }]}>
              {message?.temperature === -1.0
                ? "Off"
                : message?.temperature || data?.temperature || "-"}
            </Text>
            <Text style={styles.unit}>(°C)</Text>
            <Text style={styles.label}>Suhu</Text>
          </View>
        </View>

        <View style={styles.row}>
          {/* TDS */}
          <View style={styles.card}>
            <Text style={[styles.value, { color: "#16a34a" }]}>
              {message?.tds === -2 || message?.tds === 0
                ? "Off"
                : message?.tds || data?.tds || "-"}
            </Text>
            <Text style={styles.unit}>ppm</Text>
            <Text style={styles.label}>TDS (Kekeruhan)</Text>
          </View>

          {/* Amonia */}
          <View style={styles.card}>
            <Text style={[styles.value, { color: "#9333ea" }]}>
              {message?.amonia === -1
                ? "Off"
                : message?.amonia || data?.amonia || "-"}
            </Text>
            <Text style={styles.unit}>ppm</Text>
            <Text style={styles.label}>Gas Amonia (NH3)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    height: Dimensions.get("window").height - 200,
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    fontSize: 16,
    marginBottom: 16,
    fontFamily: "monospace",
    textAlign: "center",
    color: "#374151",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 100,
    marginHorizontal: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    elevation: 3, // shadow Android
    shadowColor: "#000", // shadow iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
});
