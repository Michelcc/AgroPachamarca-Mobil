import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state: { isConnected: boolean | null }) => {
      setOffline(state.isConnected === false);
    });
    return () => unsub();
  }, []);

  if (!offline) return null;

  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.text}>
        Estás trabajando sin internet, tus datos se guardarán en tu celular
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fef3c7",
    borderBottomWidth: 1,
    borderBottomColor: "#fcd34d",
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  text: { color: "#92400e", fontSize: 13, textAlign: "center", fontWeight: "600" }
});
