/** Declaraciones mínimas para typecheck si node_modules aún no está completo. Los paquetes reales proveen tipos al instalar. */
declare module "expo-location" {
  export enum Accuracy {
    Balanced = 2,
    BestForNavigation = 6
  }
  export type LocationObject = {
    coords: { latitude: number; longitude: number; altitude: number | null; accuracy: number | null };
  };
  export type LocationSubscription = { remove: () => void };
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(options?: { accuracy?: Accuracy }): Promise<LocationObject>;
  export function watchPositionAsync(
    options: {
      accuracy?: Accuracy;
      distanceInterval?: number;
      timeInterval?: number;
    },
    callback: (location: LocationObject) => void
  ): Promise<LocationSubscription>;
}

declare module "@react-native-community/netinfo" {
  export type NetInfoState = {
    isConnected: boolean | null;
    isInternetReachable?: boolean | null;
  };
  const NetInfo: {
    addEventListener(listener: (state: NetInfoState) => void): () => void;
  };
  export default NetInfo;
}

declare module "expo-image-picker" {
  export type ImagePickerAsset = { uri: string; width?: number; height?: number };
  export type ImagePickerResult = { canceled: boolean; assets?: ImagePickerAsset[] };
  export function requestMediaLibraryPermissionsAsync(): Promise<{ status: string }>;
  export function requestCameraPermissionsAsync(): Promise<{ status: string }>;
  export function launchImageLibraryAsync(options?: Record<string, unknown>): Promise<ImagePickerResult>;
  export function launchCameraAsync(options?: Record<string, unknown>): Promise<ImagePickerResult>;
}
