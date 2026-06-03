import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BootScreen } from "../components/BootScreen";
import { useAuth } from "../auth/AuthContext";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <BootScreen />;
  }

  return (
    <Stack.Navigator
      key={isAuthenticated ? "app" : "auth"}
      screenOptions={{ headerShown: false }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}
