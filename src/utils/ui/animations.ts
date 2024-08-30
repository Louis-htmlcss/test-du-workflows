import { Easing, withTiming } from "react-native-reanimated";

const animPapillon = (animation: any) => {
  return animation.springify().mass(1).damping(20).stiffness(300);
};

const EnteringDuration = 200;
const ExitingDuration = 150;

// Paramètres d'animation pour l'entrée du menu contextuel
const PapillonAnimSettings = {
  duration: EnteringDuration,
  easing: Easing.bezier(0, 0, 0, 1),
};

// Paramètres d'animation pour la sortie du menu contextuel
const PapillonAnimSettingsExit = {
  duration: ExitingDuration,
  easing: Easing.bezier(0, 0, 0, 1),
};

// Fonction d'animation pour l'entrée du menu contextuel
const PapillonContextEnter = () => {
  "worklet";
  const animations = {
    opacity: withTiming(1, PapillonAnimSettings),
    transform: [
      {
        scale: withTiming(1, PapillonAnimSettings),
      },
      { translateY: withTiming(0, PapillonAnimSettings) },
      { translateX: withTiming(0, PapillonAnimSettings) },
    ],
  };
  const initialValues = {
    opacity: 0,
    transform: [
      { scale: 0.7 },
      { translateY: -20 },
      { translateX: 0 },
    ],
  };
  return {
    initialValues,
    animations,
  };
};

// Fonction d'animation pour la sortie du menu contextuel
const PapillonContextExit = () => {
  "worklet";
  const animations = {
    opacity: withTiming(0, PapillonAnimSettingsExit),
    transform: [
      { scale: withTiming(0.7, PapillonAnimSettingsExit) },
      { translateY: withTiming(-20, PapillonAnimSettingsExit) },
      { translateX: withTiming(0, PapillonAnimSettingsExit) },
    ],
  };
  const initialValues = {
    opacity: 1,
    transform: [{ scale: 1 }, { translateY: 0 }, { translateX: 0 }],
  };
  return {
    initialValues,
    animations,
  };
};

export {
  animPapillon,
  PapillonContextEnter,
  PapillonContextExit,
};