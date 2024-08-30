import type { Grade } from "@/services/shared/Grade";

export interface GradeHistory {
  value: number;
  date: string;
};

type Target = "student" | "average" | "min" | "max";

export type AverageDiffGrade = {
  difference?: number;
  with: number;
  without: number;
};

// Get average as Pronote calculates it
const getPronoteAverage = (grades: Grade[], target: Target = "student"): number => {
  // If no grades, return -1
  if (!grades || grades.length === 0) return -1;

  // Group grades by subject name
  const groupedBySubject = grades.reduce((acc: Record<string, Grade[]>, grade) => {
    // If the subject doesn't exist in acc, create it
    if (!acc[grade.subjectName]) {
      acc[grade.subjectName] = [];
    }

    // Push the grade into the corresponding subject array
    acc[grade.subjectName].push(grade);
    return acc;
  }, {});

  // Get average for each subject
  const allAverages = Object.keys(groupedBySubject).map((subject) => {
    const res = getSubjectAverage(groupedBySubject[subject], target);
    return res;
  });

  const addAverage = allAverages.reduce((acc, average) => acc + average, 0);
  const addAverageLength = allAverages.length;

  // Return the average of all subject averages
  return addAverage / addAverageLength;
};

// Get subject average as Pronote calculates it
export const getSubjectAverage = (subject: Grade[], target: Target = "student"): number => {
  // Arrays of grades and outOf to be divided
  const calcGradesList: number[] = [];
  const calcOutOfList: number[] = [];

  // For each grade, calculate the grade and outOf
  subject.forEach((grade) => {
    const targetGrade = grade[target];

    // If targetGrade is undefined or disabled, skip
    if (!targetGrade || targetGrade.disabled || targetGrade.value === null || targetGrade.value < 0) return;

    // If coefficient is 0, skip
    if (grade.coefficient === 0) return;

    if(grade.isBonus) {
      // Get subject average without this grade
      const averageMoy = grade.outOf.value! / 2;
      const newGrVal = targetGrade.value - averageMoy;

      if (newGrVal < 0) {
        // If the grade is negative, skip
        return;
      }

      // Push the grade and outOf
      calcGradesList.push(newGrVal);
    }
    else if (targetGrade.value > 20 || grade.coefficient < 1) {
      // If grade is over 20, reajust the grade to be on 20
      // (grade [/20] / outOf) / (20 * coefficient)

      // Calculate the grade on 20 (grade / outOf * 20)
      let gradeOn20 = (targetGrade.value / grade.outOf.value!) * 20;

      // Push the grade and outOf
      calcGradesList.push(gradeOn20 * grade.coefficient);
      calcOutOfList.push(20 * grade.coefficient);
    }
    else {
      // Else, push the grade and outOf
      // (grade / outOf) * (outOf * coefficient)
      calcGradesList.push(targetGrade.value * grade.coefficient);
      calcOutOfList.push(grade.outOf.value! * grade.coefficient);
    }
  });

  // If no valid grades, return 0
  if (calcGradesList.length === 0) return 0;

  // Sum all grades
  const calcGradesAvg = calcGradesList.reduce((acc, grade) => acc + grade, 0);

  // Sum all outOf
  const calcOutOfAvg = calcOutOfList.reduce((acc, outOf) => acc + outOf, 0);

  // Calculate the average
  let subjectAvg = (calcGradesAvg / calcOutOfAvg) * 20;

  if(subjectAvg > 20) {
    subjectAvg = 20;
  }

  // Return the average
  return subjectAvg;
};

// Get the average difference of a grade in a list
const getAverageDiffGrade = (grades: Grade[], list: Grade[], target: Target = "student"): AverageDiffGrade => {
  // Get grades list
  const baseList = list;
  // remove each grade from the list
  const gradesToRemove = grades;

  // Get the list without the grade
  const baseListWithoutGrade = baseList.filter((grade) => !gradesToRemove.includes(grade));

  // Get the average of both lists
  const baseAverage = getSubjectAverage(baseList, target);
  const baseWithoutGradeAverage = getSubjectAverage(baseListWithoutGrade, target);

  // Return the difference
  return {
    difference: baseWithoutGradeAverage - baseAverage,
    with: baseAverage,
    without: baseWithoutGradeAverage,
  };
};

// Get the history of averages for a list of grades
const getAveragesHistory = (grades: Grade[], target: Target = "student", final?: number): GradeHistory[] => {
  // Get a list of averages from empty to full
  const history = grades.map((_, index) => {
    return {
      value: getPronoteAverage(grades.slice(0, index + 1), target),
      date: new Date(grades[index].timestamp).toISOString(),
    };
  });

  // Sort the history by date
  history.sort((a, b) => a.date.localeCompare(b.date));

  history.push({
    value: final || getPronoteAverage(grades, target),
    date: new Date().toISOString(),
  });

  return history;
};

export {
  getPronoteAverage,
  getAverageDiffGrade,
  getAveragesHistory
};
