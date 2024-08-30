import { type Account, AccountService } from "@/stores/account/types";
import { useGradesStore } from "@/stores/grades";
import type { Period } from "./shared/Period";
import type { AverageOverview, Grade } from "./shared/Grade";
import {error } from "@/utils/logger/logger";

export async function updateGradesPeriodsInCache <T extends Account> (account: T): Promise<void> {
  let periods: Period[] = [];
  let defaultPeriod: string;

  switch (account.service) {
    case AccountService.Pronote: {
      const { getGradesPeriods } = await import("./pronote/grades");
      const output = getGradesPeriods(account);

      periods = output.periods;
      defaultPeriod = output.default;

      break;
    }
    default:
      throw new Error("Service not implemented");
  }

  useGradesStore.getState().updatePeriods(periods, defaultPeriod);
}

export async function updateGradesAndAveragesInCache <T extends Account> (account: T, periodName: string): Promise<void> {
  let grades: Grade[];
  let averages: AverageOverview;

  try {
    switch (account.service) {
      case AccountService.Pronote: {
        const { getGradesAndAverages } = await import("./pronote/grades");
        const output = await getGradesAndAverages(account, periodName);

        grades = output.grades;
        averages = output.averages;

        break;
      }
      default:
        throw new Error(`Service (${AccountService[account.service]}) not implemented for this request`);
    }

    useGradesStore.getState().updateGradesAndAverages(periodName, grades, averages);
  }
  catch (err) {
    error("not updated, see:" + err, "updateGradesAndAveragesInCache");
  }
}
