import createScreen from "@/router/helpers/create-screen";

import AccountSelector from "@/views/welcome/AccountSelector";
import FirstInstallation from "@/views/welcome/FirstInstallation";
import ColorSelector from "@/views/welcome/ColorSelector";
import DevMenu from "@/views/welcome/DevMenu";
import AccountCreated from "@/views/welcome/AccountCreated";

export default [
  createScreen("AccountSelector", AccountSelector, {
    headerTransparent: true,
    headerBackVisible: false,
    headerTitle: "",
    animation: "fade",
    animationDuration: 300
  }),
  createScreen("FirstInstallation", FirstInstallation, {
    headerTransparent: true,
    headerBackVisible: false,
    headerTitle: ""
  }),
  createScreen("DevMenu", DevMenu, {
    headerTitle: "Développement"
  }),
  createScreen("ColorSelector", ColorSelector, {
    headerTransparent: true,
    headerBackVisible: false,
    headerTitle: ""
  }),
  createScreen("AccountCreated", AccountCreated, {
    headerTransparent: true,
    headerBackVisible: false,
    headerTitle: ""
  }),
] as const;

