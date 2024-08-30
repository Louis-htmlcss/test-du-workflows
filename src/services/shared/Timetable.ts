export interface TimetableClass {
  type: "lesson" | "activity" | "detention"
  title: string
  startTimestamp: number
  endTimestamp: number
  additionalNotes?: string
  room?: string
  teacher?: string
  backgroundColor?: string,
  status?: string,
}

export type Timetable = Array<TimetableClass>;