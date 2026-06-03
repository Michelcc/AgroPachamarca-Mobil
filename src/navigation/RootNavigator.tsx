import { useAuth } from "../auth/AuthContext";
import { agro } from "../theme/agroTheme";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { BootScreen } from "../components/BootScreen";
import { StyleSheet, View } from "react-native";

/** Sin stack extra: evita pantalla negra por navegadores anidados en Android. */
export function RootNavigator() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={styles.boot}>
        <BootScreen />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.shell}>
        <AuthStack />
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <AppStack />
    </View>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: agro.gray50 },
  shell: { flex: 1, backgroundColor: agro.gray50 }
});
