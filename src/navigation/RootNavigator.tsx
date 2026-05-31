import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BootScreen } from "../components/BootScreen";
import { useAuth } from "../auth/AuthContext";
import { ClimaScreen } from "../screens/ClimaScreen";
import { DimensionDetailScreen } from "../screens/DimensionDetailScreen";
import { PlantaDiagnosticoScreen } from "../screens/PlantaDiagnosticoScreen";
import { ProductosScreen } from "../screens/ProductosScreen";
import { RegistroTablaScreen } from "../screens/RegistroTablaScreen";
import { RecomendacionScreen } from "../screens/RecomendacionScreen";
import { SensoresSueloScreen } from "../screens/SensoresSueloScreen";
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
          <Stack.Screen
            name="DimensionDetail"
            component={DimensionDetailScreen}
            options={{ headerShown: true, title: "Dimensión" }}
          />
          <Stack.Screen
            name="ModuloProductos"
            component={ProductosScreen}
            options={{ headerShown: true, title: "Productos" }}
          />
          <Stack.Screen
            name="ModuloSensores"
            component={SensoresSueloScreen}
            options={{ headerShown: true, title: "Sensores de suelo" }}
          />
          <Stack.Screen
            name="ModuloClima"
            component={ClimaScreen}
            options={{ headerShown: true, title: "Clima y alertas" }}
          />
          <Stack.Screen
            name="ModuloCultivo"
            component={RecomendacionScreen}
            options={{ headerShown: true, title: "Cultivo" }}
          />
          <Stack.Screen
            name="ModuloPlanta"
            component={PlantaDiagnosticoScreen}
            options={{ headerShown: true, title: "Mi planta — IA" }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
