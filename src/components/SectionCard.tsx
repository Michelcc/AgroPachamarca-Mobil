import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { agro } from "../theme/agroTheme";

type Props = ViewProps & {
  title?: string;
  subtitle?: string;
  badge?: string;
};

export function SectionCard({ title, subtitle, badge, children, style, ...rest }: Props) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: agro.white,
    borderRadius: agro.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: agro.gray200,
    gap: 10,
    ...agro.shadow
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: agro.green700,
    textTransform: "uppercase"
  },
  title: { fontSize: 16, fontWeight: "800", color: agro.gray900 },
  subtitle: { fontSize: 13, color: agro.gray500, lineHeight: 18, marginTop: -4 }
});
