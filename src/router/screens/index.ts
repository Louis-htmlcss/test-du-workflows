import welcome from "@/router/screens/welcome";
import login from "@/router/screens/login";
import views from "@/router/screens/views";
import createScreen from "../helpers/create-screen";

import { SettingsScreen } from "./settings/navigator";
import AccountScreen from "./account/stack";

export default [
  ...welcome,
  ...login,
  ...views,

  createScreen("SettingStack", SettingsScreen, {
    headerShown: false,
    presentation: "modal"
  }),

  createScreen("AccountStack", AccountScreen, {
    headerShown: false,
    gestureEnabled: false,
    animation: "none"
  }),
] as const;
