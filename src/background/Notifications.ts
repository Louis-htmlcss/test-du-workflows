import { expoGoWrapper } from "@/utils/native/expoGoAlert";

const requestNotificationPermission = async () => {
  return expoGoWrapper(async () => {
    const notifee = (await import("@notifee/react-native")).default;
    await notifee.requestPermission();
  }, true);
};

const papillonNotify = async (props) => {
  expoGoWrapper(async () => {
    const notifee = (await import("@notifee/react-native")).default;
    await notifee.displayNotification({
      ...props,
      title: props.title || "Coucou, c'est Papillon 👋",
    });
  });
};

export {
  requestNotificationPermission,
};