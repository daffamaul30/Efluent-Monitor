import messaging from '@react-native-firebase/messaging';

export function initializeFCMBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {

    // const notificationBody = remoteMessage.notification?.body || 'No content';
    console.log(`Pesan background diterima: ${JSON.stringify(remoteMessage.data)}`);

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
        algorithm: remoteMessage.data.algorithm || ""
      };

      await fetch("http://192.168.18.5:5000/api/notifs/save-notif-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
  });
}