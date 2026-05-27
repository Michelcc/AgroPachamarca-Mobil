import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { agro } from "../theme/agroTheme";

type Props = TextInputProps & {
  label?: string;
  hint?: string;
};

export function AgroInput({ label, hint, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, rest.editable === false && styles.inputDisabled, style]}
        placeholderTextColor={agro.gray400}
        {...rest}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: agro.gray700 },
  input: {
    borderWidth: 1,
    borderColor: agro.gray200,
    borderRadius: agro.radiusMd,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: agro.white,
    fontSize: 15,
    color: agro.gray900
  },
  inputDisabled: { backgroundColor: agro.gray50, color: agro.gray600 },
  hint: { fontSize: 11, color: agro.gray500, marginTop: -4 }
});
