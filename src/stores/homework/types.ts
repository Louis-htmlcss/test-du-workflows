import type { Homework } from "@/services/shared/Homework";

export interface HomeworkStore {
  homeworks: Record<number, Homework[]>
  updateHomeworks: (weekNumber: number, homeworks: Homework[]) => void
}
