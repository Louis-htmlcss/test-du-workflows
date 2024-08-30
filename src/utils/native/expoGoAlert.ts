import { Alert } from "react-native";
import Constants from "expo-constants";

export const isExpoGo = () => {
  return Constants.appOwnership === "expo";
};

export const alertExpoGo = async () => {
  Alert.alert(
    "Vous développez à l'aide d'Expo Go",
    "Sous Expo Go, les appels aux API natives sont indisponibles. Veuillez utiliser une build de développement pour accéder à toutes les fonctionnalités.",
  );
};

// function wrapper that only calls the function if the app is not Expo Go
export const expoGoWrapper = (fn: () => void, alert?: boolean) => {
  if (!isExpoGo()) {
    return fn();
  }
  else if (alert) {
    alertExpoGo();
    return false;
  }
};