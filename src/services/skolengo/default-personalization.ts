import type { Personalization } from "@/stores/account/types";
import { defaultTabs } from "@/views/settings/SettingsTabs";

import colors from "@/utils/data/colors.json";

const defaultSkolengoTabs : typeof defaultTabs[number]["tab"][]= [
  "Home",
  // "Lessons",
  // "Homeworks",
  // "Grades",
  // "News",
  // "Attendance",
  // "Messages",
];

const defaultSkolengoPersonalization = (): Partial<Personalization> => {
  return {
    color: colors[0],
    magicEnabled: true,
    profilePictureB64: void 0,

    tabs: defaultTabs.filter(current => defaultSkolengoTabs.includes(current.tab)).map((tab, index) => ({
      name: tab.tab,
      enabled: index <= 4
    }))
  };
};

export default defaultSkolengoPersonalization;
