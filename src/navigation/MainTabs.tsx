import { createBottomTabNavigator, BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { OfflineBanner } from "../components/OfflineBanner";
import { DatosScreen } from "../screens/DatosScreen";
import { DimensionHubScreen } from "../screens/DimensionHubScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { agro } from "../theme/agroTheme";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabEmoji: Record<keyof MainTabParamList, string> = {
  Inicio: "🏠",
  Datos: "📋",
  Dimensiones: "📊",
  Perfil: "👤"
};

function TabBarWithBanner(props: BottomTabBarProps) {
  return (
    <View style={styles.tabBarShell}>
      <OfflineBanner />
      <BottomTabBar {...props} />
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      tabBar={(props) => <TabBarWithBanner {...props} />}
      screenOptions={({ route }) => ({
        lazy: false,
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
        headerShadowVisible: false,
        sceneContainerStyle: styles.scene
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Datos"
        component={DatosScreen}
        options={{ title: "Datos de campo", tabBarLabel: "Datos" }}
      />
      <Tab.Screen
        name="Dimensiones"
        component={DimensionHubScreen}
        options={{ title: "Dimensiones", tabBarLabel: "Dimensiones" }}
      />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarShell: { backgroundColor: agro.white },
  scene: { flex: 1, backgroundColor: agro.gray50 },
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
