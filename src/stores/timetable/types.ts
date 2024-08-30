import type { Timetable } from "@/services/shared/Timetable";

export interface TimetableStore {
  timetables: Record<number, Timetable>,
  updateClasses: (weekNumber: number, classes: Timetable) => void
}
