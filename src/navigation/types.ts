export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/** Stack autenticado: tabs + pantallas modulares */
export type AppStackParamList = {
  MainTabs: undefined;
  DimensionDetail: { dimensionId: string };
  ModuloProductos: undefined;
  ModuloSensores: undefined;
  ModuloClima: undefined;
  ModuloCultivo: undefined;
  ModuloPlanta: undefined;
  RegistroTabla: { tabla: string };
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type MainTabParamList = {
  Inicio: undefined;
  Datos: undefined;
  Dimensiones: undefined;
  Perfil: undefined;
};

/** Compatibilidad con imports antiguos */
export type { AppStackParamList as RootModalsParamList };
