import { StyleSheet, Text, View } from "react-native";
import { agro } from "../theme/agroTheme";

type Props = {
  emoji?: string;
  title: string;
  message: string;
};

export function EmptyState({ emoji = "📦", title, message }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8
  },
  emoji: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "800", color: agro.gray900, textAlign: "center" },
  message: { fontSize: 14, color: agro.gray500, textAlign: "center", lineHeight: 22 }
});
