export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  RegistroTabla: { tabla: string };
};

export type MainTabParamList = {
  Inicio: undefined;
  Datos: undefined;
  Clima: undefined;
  Cultivo: undefined;
  Planta: undefined;
  Productos: undefined;
  Perfil: undefined;
};
