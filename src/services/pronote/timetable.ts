import type { PronoteAccount } from "@/stores/account/types";
import type { Timetable, TimetableClass } from "../shared/Timetable";
import { ErrorServiceUnauthenticated } from "../shared/errors";
import pronote from "pawnote";
import { info } from "@/utils/logger/logger";

const decodeTimetableClass = (c: pronote.TimetableClassLesson | pronote.TimetableClassDetention | pronote.TimetableClassActivity): TimetableClass => {
  const base = {
    startTimestamp: c.startDate.getTime(),
    endTimestamp: c.endDate.getTime(),
    additionalNotes: c.notes,
    backgroundColor: c.backgroundColor
  };

  if (c.is === "lesson") {
    return {
      type: "lesson",
      title: c.subject!.name,
      room: c.classrooms.join(", ") || void 0,
      teacher: c.teacherNames?.join(", ") ?? void 0,
      status: c.status,
      ...base
    } satisfies TimetableClass;
  }
  else if (c.is === "activity") {
    return {
      type: "activity",
      title: c.title,
      ...base
    } satisfies TimetableClass;
  }
  else if (c.is === "detention") {
    return {
      type: "detention",
      title: c.title ?? "Sans titre",
      room: c.classrooms.join(", ") || void 0,
      ...base
    } satisfies TimetableClass;
  }

  throw new Error("pronote: unknown class type");
};

export const getTimetableForWeek = async (account: PronoteAccount, weekNumber: number): Promise<Timetable> => {
  if (!account.instance)
    throw new ErrorServiceUnauthenticated("pronote");

  if (weekNumber < 1 || weekNumber > 62) {
    info("PRONOTE->getTimetableForWeek(): Le numéro de semaine est en dehors des bornes (1<>62), une liste vide est retournée.", "pronote");
    return [];
  }

  const timetable = await pronote.timetableFromWeek(account.instance, weekNumber);
  pronote.parseTimetable(account.instance, timetable, {
    withSuperposedCanceledClasses: false,
    withCanceledClasses: true,
    withPlannedClasses: true
  });

  return timetable.classes.map(decodeTimetableClass);
};
