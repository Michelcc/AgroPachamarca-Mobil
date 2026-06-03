import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import { SectionCard } from "../components/SectionCard";
import { StatGrid } from "../components/StatGrid";
import { loadUserProfile, type UserProfile } from "../features/perfil/profileRepository";
import type { AppStackParamList, MainTabParamList } from "../navigation/types";
import { useAppNavigation } from "../navigation/useAppNavigation";
import { agro, APP_BRAND, APP_VERSION } from "../theme/agroTheme";

type PerfilNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<AppStackParamList>
>;

function formatFecha(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  } catch {
    return "—";
  }
}

function Fila({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function PerfilScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation<PerfilNav>();
  const insets = useSafeAreaInsets();
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saliendo, setSaliendo] = useState(false);
  const [confirmarSalir, setConfirmarSalir] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setPerfil(await loadUserProfile());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el perfil");
      setPerfil(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void cargar();
    }, [cargar])
  );

  const ejecutarSalir = async () => {
    setSaliendo(true);
    try {
      await signOut();
    } finally {
      setSaliendo(false);
      setConfirmarSalir(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 12 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void cargar()} />}
    >
      <Text style={styles.title}>Perfil</Text>

      {loading && !perfil ? (
        <ActivityIndicator size="large" color={agro.green600} style={{ marginVertical: 24 }} />
      ) : null}

      {error ? (
        <SectionCard title="Error al cargar">
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.buttonSecondary} onPress={() => void cargar()}>
            <Text style={styles.buttonSecondaryText}>Reintentar</Text>
          </Pressable>
        </SectionCard>
      ) : null}

      {perfil ? (
        <>
          <View style={styles.headerCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {perfil.nombre.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.headerName}>{perfil.username}</Text>
            <Text style={styles.headerEmail}>{perfil.email}</Text>
          </View>

          <SectionCard title="Datos de cuenta">
            <Fila label="Nombre" value={perfil.nombre} />
            <Fila label="Correo" value={perfil.email} />
            <Fila label="Miembro desde" value={formatFecha(perfil.cuentaDesde)} />
            <Fila label="ID Usuario" value={`${perfil.id.slice(0, 8)}…`} />
          </SectionCard>

          <SectionCard title="Tu actividad" subtitle="Resumen de tu trabajo en campo">
            <StatGrid
              items={[
                {
                  value: perfil.registrosCampo,
                  label: "Registros",
                  sublabel: "de campo (GPS)"
                },
                {
                  value: perfil.modulosConDatos,
                  label: "Módulos",
                  sublabel: "con datos"
                },
                {
                  value: perfil.productos,
                  label: "Productos",
                  sublabel: "registrados"
                },
                {
                  value: perfil.alertasClima,
                  label: "Alertas",
                  sublabel: "de clima"
                }
              ]}
            />
          </SectionCard>

          <SectionCard
            badge="DIAGNÓSTICOS IA"
            title="Análisis inteligente"
            subtitle="Gemini identifica especies, deficiencias y plagas"
          >
            <Text style={styles.iaCount}>{perfil.diagnosticosIa}</Text>
            <Text style={styles.iaLabel}>diagnósticos guardados en tu cuenta</Text>
            <Pressable
              style={styles.iaBtn}
              onPress={() => navigation.navigate("ModuloPlanta")}
            >
              <Text style={styles.iaBtnText}>Ir a Mi planta — IA</Text>
            </Pressable>
          </SectionCard>
        </>
      ) : null}

      {confirmarSalir ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>¿Cerrar sesión?</Text>
          <Text style={styles.confirmBody}>Volverás a la pantalla de inicio de sesión.</Text>
          <Pressable
            style={[styles.buttonDanger, saliendo && styles.disabled]}
            disabled={saliendo}
            onPress={() => void ejecutarSalir()}
          >
            {saliendo ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sí, salir</Text>
            )}
          </Pressable>
          <Pressable
            style={styles.buttonCancel}
            disabled={saliendo}
            onPress={() => setConfirmarSalir(false)}
          >
            <Text style={styles.buttonCancelText}>Cancelar</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.buttonDanger} onPress={() => setConfirmarSalir(true)}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </Pressable>
      )}

      <Text style={styles.version}>
        Versión {APP_VERSION} ({APP_BRAND})
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: agro.gray50 },
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: agro.green900 },
  headerCard: {
    backgroundColor: agro.green50,
    borderRadius: agro.radiusLg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    gap: 4
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: agro.green600,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  avatarText: { color: agro.white, fontSize: 30, fontWeight: "800" },
  headerName: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  headerEmail: { fontSize: 14, color: agro.gray600 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: agro.gray100
  },
  label: { fontSize: 13, color: agro.gray500, fontWeight: "600" },
  value: { fontSize: 14, fontWeight: "700", color: agro.gray900, maxWidth: "58%", textAlign: "right" },
  iaCount: { fontSize: 36, fontWeight: "800", color: agro.purple600, textAlign: "center" },
  iaLabel: { fontSize: 13, color: agro.gray500, textAlign: "center", marginTop: -4 },
  iaBtn: {
    backgroundColor: agro.purple600,
    padding: 12,
    borderRadius: agro.radiusSm,
    alignItems: "center",
    marginTop: 4
  },
  iaBtnText: { color: agro.white, fontWeight: "700" },
  error: { color: agro.red600, lineHeight: 20 },
  buttonSecondary: {
    backgroundColor: agro.gray100,
    padding: 10,
    borderRadius: agro.radiusSm,
    alignItems: "center"
  },
  buttonSecondaryText: { fontWeight: "700", color: agro.gray700 },
  confirmBox: {
    backgroundColor: "#fef2f2",
    borderRadius: agro.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
    gap: 10
  },
  confirmTitle: { fontWeight: "800", fontSize: 16, color: "#991b1b" },
  confirmBody: { color: agro.gray600, fontSize: 14 },
  buttonDanger: {
    backgroundColor: agro.gray900,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  buttonCancel: {
    padding: 12,
    borderRadius: agro.radiusMd,
    alignItems: "center",
    backgroundColor: agro.white,
    borderWidth: 1,
    borderColor: agro.gray200
  },
  buttonCancelText: { fontWeight: "700", color: agro.gray700 },
  buttonText: { color: agro.white, fontWeight: "700" },
  disabled: { opacity: 0.6 },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: agro.gray400,
    marginTop: 8,
    fontWeight: "600"
  }
});
