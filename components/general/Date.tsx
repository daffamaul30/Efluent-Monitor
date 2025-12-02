import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function TanggalWaktuSekarang() {
  const [waktu, setWaktu] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tanggal = format(waktu, "EEEE, dd MMMM yyyy", { locale: id });

  return (
    <View>
      <Text style={{ textAlign: "center", fontWeight: 600, fontSize: 20 }}>
        {tanggal}
      </Text>
    </View>
  );
}
