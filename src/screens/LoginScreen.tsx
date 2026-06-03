import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../auth/AuthContext";
import { getSupabaseConfigWarning } from "../supabase/client";
import { mapNetworkError, pingSupabase } from "../supabase/network";
import { AgroButton } from "../components/AgroButton";
import { AgroInput } from "../components/AgroInput";
import { BrandLogo } from "../components/BrandLogo";
import type { AuthStackParamList } from "../navigation/types";
import { agro } from "../theme/agroTheme";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const msg = (error as { message?: string })?.message ?? "";
  if (code === "invalid_credentials" || msg.includes("Invalid login")) {
    return "Correo o contraseña incorrectos.";
  }
  if (/network request failed/i.test(msg)) {
    return mapNetworkError(error);
  }
  if (msg.includes("network")) return mapNetworkError(error);
  return msg || "No se pudo iniciar sesión.";
}

export function LoginScreen({ navigation }: Props) {
  const { signIn, supabaseReady } = useAuth();
  const insets = useSafeAreaInsets();
  const configWarning = getSupabaseConfigWarning();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [testingNet, setTestingNet] = useState(false);

  const onTestConnection = async () => {
    setTestingNet(true);
    try {
      const r = await pingSupabase();
      Alert.alert(r.ok ? "Conexión OK" : "Sin conexión", r.detail);
    } finally {
      setTestingNet(false);
    }
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Error", authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!supabaseReady) {
    return (
      <View style={styles.container}>
        <BrandLogo />
        <Text style={styles.setupTitle}>Configuración pendiente</Text>
        <Text style={styles.setupSub}>
          Crea android/.env con EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY (clave anon
          eyJ… desde Supabase → Settings → API). Luego reinicia con npm start.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: Math.max(insets.top, 24) + 24, paddingBottom: insets.bottom + 24 }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <BrandLogo />
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.sub}>Accede a tu panel con tu cuenta</Text>

        {configWarning ? (
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>{configWarning}</Text>
          </View>
        ) : null}

        <AgroInput
          label="Gmail o corporativa"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
        />
        <AgroInput
          label="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        <AgroButton label="Entrar" loading={loading} onPress={() => void onLogin()} />

        <Pressable style={styles.linkSecondary} onPress={() => void onTestConnection()} disabled={testingNet}>
          <Text style={styles.forgot}>
            {testingNet ? "Probando conexión…" : "Probar conexión a Supabase"}
          </Text>
        </Pressable>

        <Pressable style={styles.link} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>¿No tienes cuenta? </Text>
          <Text style={styles.linkBold}>Regístrate</Text>
        </Pressable>

        <Pressable
          style={styles.linkSecondary}
          onPress={() =>
            Alert.alert(
              "Recuperar contraseña",
              "Usa la opción «Olvidé mi contraseña» en la web de Supabase Auth o contacta al administrador."
            )
          }
        >
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: agro.gray50 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 28,
    paddingTop: 48,
    backgroundColor: agro.gray50
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: agro.green900,
    marginBottom: 6
  },
  sub: { textAlign: "center", color: agro.gray500, marginBottom: 24, fontSize: 14 },
  link: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  linkText: { color: agro.gray600, fontSize: 14 },
  linkBold: { color: agro.green700, fontWeight: "700", fontSize: 14 },
  linkSecondary: { marginTop: 16, alignItems: "center" },
  forgot: { color: agro.gray500, fontSize: 13, fontWeight: "600" },
  setupTitle: { fontSize: 20, fontWeight: "800", textAlign: "center", color: agro.green900 },
  setupSub: { textAlign: "center", color: agro.gray500, marginTop: 12, lineHeight: 22, paddingHorizontal: 16 },
  warnBox: {
    backgroundColor: "#fef3c7",
    borderRadius: agro.radiusMd,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fcd34d"
  },
  warnText: { color: "#92400e", fontSize: 13, lineHeight: 20 }
});
