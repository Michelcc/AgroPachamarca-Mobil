import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "./types";

/** Navegación al stack principal (dimensiones, módulos, registro GPS). */
export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<AppStackParamList>>();
}
