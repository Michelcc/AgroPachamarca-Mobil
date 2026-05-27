import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { OfflineBanner } from "../components/OfflineBanner";
import { ClimaScreen } from "../screens/ClimaScreen";
import { DatosScreen } from "../screens/DatosScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProductosScreen } from "../screens/ProductosScreen";
import { PlantaDiagnosticoScreen } from "../screens/PlantaDiagnosticoScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { RecomendacionScreen } from "../screens/RecomendacionScreen";
import { agro } from "../theme/agroTheme";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabEmoji: Record<keyof MainTabParamList, string> = {
  Inicio: "🏠",
  Datos: "📋",
  Clima: "☁️",
  Cultivo: "🌾",
  Planta: "🔬",
  Productos: "📦",
  Perfil: "👤"
};

export function MainTabs() {
  return (
    <View style={styles.shell}>
      <OfflineBanner />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: true,
          tabBarActiveTintColor: agro.green700,
          tabBarInactiveTintColor: agro.gray500,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
              {tabEmoji[route.name as keyof MainTabParamList]}
            </Text>
          ),
          tabBarLabelStyle: styles.tabLabel,
          headerStyle: { backgroundColor: agro.white },
          headerTitleStyle: { fontWeight: "800", color: agro.green900, fontSize: 17 },
          headerShadowVisible: false
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen
          name="Datos"
          component={DatosScreen}
          options={{ title: "Datos de campo", tabBarLabel: "Datos" }}
        />
        <Tab.Screen name="Clima" component={ClimaScreen} options={{ title: "Clima y alertas" }} />
        <Tab.Screen name="Cultivo" component={RecomendacionScreen} options={{ title: "Cultivo" }} />
        <Tab.Screen
          name="Planta"
          component={PlantaDiagnosticoScreen}
          options={{ title: "Mi planta — IA", tabBarLabel: "Planta" }}
        />
        <Tab.Screen name="Productos" component={ProductosScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: agro.gray50 },
  tabBar: {
    backgroundColor: agro.white,
    borderTopColor: agro.gray200,
    borderTopWidth: 1,
    paddingTop: 4,
    height: 60
  },
  tabIcon: { fontSize: 22, lineHeight: 26, opacity: 0.7 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, fontWeight: "700", marginBottom: 4 }
});
