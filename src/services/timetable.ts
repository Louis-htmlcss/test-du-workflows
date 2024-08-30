import { type Account, AccountService } from "@/stores/account/types";
import { useTimetableStore } from "@/stores/timetable";

/**
 * Updates the state and cache for the timetable of given week number.
 */
export async function updateTimetableForWeekInCache <T extends Account> (account: T, weekNumber: number): Promise<void> {
  switch (account.service) {
    case AccountService.Pronote: {
      const { getTimetableForWeek } = await import("./pronote/timetable");
      const timetable = await getTimetableForWeek(account, weekNumber);
      useTimetableStore.getState().updateClasses(weekNumber, timetable);
      break;
    }
    default: {
      throw new Error("Service not implemented.");
    }
  }
}
