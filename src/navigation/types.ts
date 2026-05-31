export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  RegistroTabla: { tabla: string };
  DimensionDetail: { dimensionId: string };
  ModuloProductos: undefined;
  ModuloSensores: undefined;
  ModuloClima: undefined;
  ModuloCultivo: undefined;
  ModuloPlanta: undefined;
};

export type MainTabParamList = {
  Inicio: undefined;
  Datos: undefined;
  Dimensiones: undefined;
  Perfil: undefined;
};
