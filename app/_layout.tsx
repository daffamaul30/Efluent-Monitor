import { initializeFCMBackgroundHandler } from "@/firebaseConfig";
import { getFCMToken, requestUserPermission } from "@/utils/push";
import messaging from "@react-native-firebase/messaging";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-get-random-values";
import "react-native-reanimated";

initializeFCMBackgroundHandler();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    async function createChannel() {
      await Notifications.getNotificationChannelAsync("default");

      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        enableLights: true,
      });
    }

    createChannel();
  }, []);

  useEffect(() => {
    requestUserPermission().then(async (granted) => {
      if (granted) {
        const token = await getFCMToken();

        await fetch("http://192.168.18.5:5000/api/users/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("📩 FCM Foreground Message:", remoteMessage);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: String(
            remoteMessage.notification?.title ??
              remoteMessage.data?.title ??
              "Notification"
          ),

          body: String(
            remoteMessage.notification?.body ??
              remoteMessage.data?.body ??
              "You have a new message"
          ),

          data: remoteMessage.data ?? {},
        },
        trigger: null,
      });

      if (!!remoteMessage.data) {
        const receivedISO = new Date().toISOString();
        const triggeredISO = String(remoteMessage.data.triggered_at) || "";

        let totalTime = 0;

        if (triggeredISO) {
          const receivedDate = new Date(receivedISO).getTime();
          const triggeredDate = new Date(triggeredISO).getTime();

          totalTime = (receivedDate - triggeredDate) / 1000;
        }

        const data = {
          alert_id: remoteMessage.data.alert_id || "",
          triggered_time: triggeredISO,
          received_time: receivedISO,
          total_time: totalTime,
          notif_type: remoteMessage.data.notif_type || "",
          algorithm: remoteMessage.data.algorithm || "",
        };

        await fetch("http://192.168.18.5:5000/api/notifs/save-notif-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarStyle: "dark",
            statusBarBackgroundColor: "#FFF",
          }}
        />
      </Stack>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
    </ThemeProvider>
  );
}
