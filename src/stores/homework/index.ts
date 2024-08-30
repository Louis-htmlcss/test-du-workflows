import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

import type { HomeworkStore } from "@/stores/homework/types";
import { log } from "@/utils/logger/logger";

export const useHomeworkStore = create<HomeworkStore>()(
  persist(
    (set) => ({
      homeworks: {},
      updateHomeworks: (weekNumber, homeworks) => {
        log(`updating classes for week ${weekNumber}`, "homework:updateHomeworks");

        set((state) => {
          return {
            homeworks: {
              ...state.homeworks,
              [weekNumber]: homeworks
            }
          };
        });

        log(`updated classes for week ${weekNumber}`, "homework:updateHomeworks");
      }
    }),
    {
      name: "<default>-homework-storage", // <default> will be replace to user id when using "switchTo"
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
