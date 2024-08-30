import { expoGoWrapper } from "@/utils/native/expoGoAlert";
import notifee from "@notifee/react-native";

const registerBackgroundTasks = async () => {
  expoGoWrapper(async () => {
    // Fetch data here
  });
};

export default registerBackgroundTasks;