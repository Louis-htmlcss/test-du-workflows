import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

import type { TimetableStore } from "@/stores/timetable/types";
import { log } from "@/utils/logger/logger";

export const useTimetableStore = create<TimetableStore>()(
  persist(
    (set) => ({
      timetables: {},
      updateClasses: (weekNumber, classes) => {
        log(`updating classes for week ${weekNumber}`, "timetable:updateClasses");

        set((state) => {
          return {
            timetables: {
              ...state.timetables,
              [weekNumber]: classes
            }
          };
        });

        log(`[timetable:updateClasses]: updated classes for week ${weekNumber}`, "timetable:updateClasses");
      }
    }),
    {
      name: "<default>-timetable-storage", // <default> will be replace to user id when using "switchTo"
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
