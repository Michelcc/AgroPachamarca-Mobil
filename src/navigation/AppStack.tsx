import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClimaScreen } from "../screens/ClimaScreen";
import { DimensionDetailScreen } from "../screens/DimensionDetailScreen";
import { PlantaDiagnosticoScreen } from "../screens/PlantaDiagnosticoScreen";
import { ProductosScreen } from "../screens/ProductosScreen";
import { RegistroTablaScreen } from "../screens/RegistroTablaScreen";
import { RecomendacionScreen } from "../screens/RecomendacionScreen";
import { SensoresSueloScreen } from "../screens/SensoresSueloScreen";
import { MainTabs } from "./MainTabs";
import type { AppStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontWeight: "800", color: "#14532d", fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#f9fafb" }
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="DimensionDetail"
        component={DimensionDetailScreen}
        options={{ title: "Dimensión" }}
      />
      <Stack.Screen name="ModuloProductos" component={ProductosScreen} options={{ title: "Productos" }} />
      <Stack.Screen
        name="ModuloSensores"
        component={SensoresSueloScreen}
        options={{ title: "Sensores de suelo" }}
      />
      <Stack.Screen name="ModuloClima" component={ClimaScreen} options={{ title: "Clima y alertas" }} />
      <Stack.Screen name="ModuloCultivo" component={RecomendacionScreen} options={{ title: "Cultivo" }} />
      <Stack.Screen
        name="ModuloPlanta"
        component={PlantaDiagnosticoScreen}
        options={{ title: "Mi planta — IA" }}
      />
      <Stack.Screen
        name="RegistroTabla"
        component={RegistroTablaScreen}
        options={{ title: "Registro GPS" }}
      />
    </Stack.Navigator>
  );
}
