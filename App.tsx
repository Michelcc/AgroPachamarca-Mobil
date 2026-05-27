import "./src/supabase/setupPolyfill";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppErrorBoundary } from "./src/components/AppErrorBoundary";
import { AuthProvider } from "./src/auth/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { agro } from "./src/theme/agroTheme";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: agro.gray50,
    card: agro.white,
    text: agro.gray900,
    primary: agro.green700,
    border: agro.gray200
  }
};

export default function App() {
  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <AppErrorBoundary>
          <AuthProvider>
            <NavigationContainer theme={navTheme}>
              <RootNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </AuthProvider>
        </AppErrorBoundary>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: agro.gray50 }
});
