import { Alert } from "react-native";
import * as Location from "expo-location";

export type GpsSnapshot = {
  lat: number;
  lng: number;
  altitudMsnm?: number;
  accuracyM?: number;
  timestamp: number;
};

let lastSnapshot: GpsSnapshot | null = null;

export function getLastGpsSnapshot(): GpsSnapshot | null {
  return lastSnapshot;
}

export async function captureGpsSnapshot(silent = false): Promise<GpsSnapshot | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    if (!silent) {
      Alert.alert("GPS", "Activa la ubicación para registrar datos en tu terreno.");
    }
    return null;
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced
  });
  const snap: GpsSnapshot = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    altitudMsnm:
      pos.coords.altitude != null && !Number.isNaN(pos.coords.altitude)
        ? pos.coords.altitude
        : undefined,
    accuracyM: pos.coords.accuracy ?? undefined,
    timestamp: Date.now()
  };
  lastSnapshot = snap;
  return snap;
}

export function formatLat(snap: GpsSnapshot): string {
  return snap.lat.toFixed(6);
}

export function formatLng(snap: GpsSnapshot): string {
  return snap.lng.toFixed(6);
}

export function formatAlt(snap: GpsSnapshot): string {
  return snap.altitudMsnm != null ? String(Math.round(snap.altitudMsnm)) : "";
}
