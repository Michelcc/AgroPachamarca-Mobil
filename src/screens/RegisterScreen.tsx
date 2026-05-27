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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../auth/AuthContext";
import { AgroButton } from "../components/AgroButton";
import { AgroInput } from "../components/AgroInput";
import { BrandLogo } from "../components/BrandLogo";
import type { AuthStackParamList } from "../navigation/types";
import { agro } from "../theme/agroTheme";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

function authErrorMessage(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? "";
  if (msg.includes("already registered")) return "Ese correo ya está registrado.";
  if (msg.includes("Password")) return "Contraseña mínimo 6 caracteres.";
  return msg || "No se pudo crear la cuenta.";
}

function iniciales(nombre: string): string {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!nombre.trim() || !email.trim() || password.length < 6) {
      Alert.alert("Datos", "Nombre, correo y contraseña (mín. 6) son obligatorios.");
      return;
    }
    if (!email.trim().toLowerCase().includes("@")) {
      Alert.alert("Correo", "Ingresa un correo válido (ej. usuario@gmail.com).");
      return;
    }
    try {
      setLoading(true);
      await signUp(email, password, nombre);
      Alert.alert("Listo", "Cuenta creada. Ahora puedes iniciar sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      Alert.alert("Error", authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <BrandLogo compact />
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.sub}>Únete a la comunidad agrícola</Text>

        {nombre.trim().length > 0 ? (
          <View style={styles.avatarPreview}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{iniciales(nombre)}</Text>
            </View>
            <Text style={styles.avatarName}>{nombre}</Text>
          </View>
        ) : null}

        <AgroInput
          label="Nombre completo"
          autoCapitalize="words"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Juan Pérez"
        />
        <AgroInput
          label="Correo"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="usuario@gmail.com"
        />
        <AgroInput
          label="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          hint="Usa al menos 6 caracteres"
        />

        <AgroButton label="Registrarme" loading={loading} onPress={() => void onRegister()} />

        <Pressable style={styles.link} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>¿Ya eres parte de Agro App? </Text>
          <Text style={styles.linkBold}>Iniciar sesión</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: agro.green50 },
  container: { flexGrow: 1, padding: 28, paddingTop: 40, paddingBottom: 48 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: agro.green900,
    marginBottom: 6
  },
  sub: { textAlign: "center", color: agro.gray500, marginBottom: 20, fontSize: 14 },
  avatarPreview: { alignItems: "center", marginBottom: 16, gap: 6 },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: agro.green600,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: { color: agro.white, fontSize: 22, fontWeight: "800" },
  avatarName: { fontWeight: "700", color: agro.green900, fontSize: 16 },
  link: { flexDirection: "row", justifyContent: "center", marginTop: 20, flexWrap: "wrap" },
  linkText: { color: agro.gray600, fontSize: 14 },
  linkBold: { color: agro.green700, fontWeight: "700", fontSize: 14 }
});
