import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { agro } from "../theme/agroTheme";

type Variant = "primary" | "secondary" | "outline" | "danger";

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

const variantStyles: Record<Variant, { btn: object; text: object }> = {
  primary: { btn: { backgroundColor: agro.green600 }, text: { color: agro.white } },
  secondary: { btn: { backgroundColor: agro.blue600 }, text: { color: agro.white } },
  outline: {
    btn: { backgroundColor: agro.white, borderWidth: 2, borderColor: agro.green600 },
    text: { color: agro.green700 }
  },
  danger: { btn: { backgroundColor: agro.gray900 }, text: { color: agro.white } }
};

export function AgroButton({
  label,
  variant = "primary",
  loading,
  disabled,
  style,
  ...rest
}: Props) {
  const v = variantStyles[variant];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        v.btn,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? agro.green700 : agro.white} />
      ) : (
        <Text style={[styles.text, v.text]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: agro.radiusMd,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50
  },
  text: { fontWeight: "700", fontSize: 16 },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.88 }
});
