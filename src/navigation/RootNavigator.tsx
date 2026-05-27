import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BootScreen } from "../components/BootScreen";
import { useAuth } from "../auth/AuthContext";
import { RegistroTablaScreen } from "../screens/RegistroTablaScreen";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { RootStackParamList } from "./types";

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
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="RegistroTabla"
            component={RegistroTablaScreen}
            options={{ headerShown: true, title: "Registro GPS" }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
