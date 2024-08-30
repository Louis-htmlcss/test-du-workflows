import { NativeListHeader } from "@/components/Global/NativeComponents";
import { updateTimetableForWeekInCache } from "@/services/timetable";
import { useCurrentAccount } from "@/stores/account";
import { AccountService } from "@/stores/account/types";
import { useTimetableStore } from "@/stores/timetable";
import { animPapillon } from "@/utils/ui/animations";
import React, { useEffect, useState } from "react";
import Reanimated, {
  LinearTransition
} from "react-native-reanimated";
import { TimetableItem } from "../../Lessons/Atoms/Item";
import { PapillonNavigation } from "@/router/refs";
import RedirectButton from "@/components/Home/RedirectButton";
import { TimetableClass } from "@/services/shared/Timetable";

const TimetableElement = () => {
  const account = useCurrentAccount(store => store.account!);
  const timetables = useTimetableStore(store => store.timetables);

  const [currentWeek, setCurrentWeek] = useState(0);

  const currentDay = new Date(/*"2024-04-19"*/);
  const [firstDate, setFirstDate] = useState(new Date("2023-09-01"));

  const [courses, setCourses] = useState<TimetableClass[]>([]);
  const [nextCourseIndex, setNextCourseIndex] = useState(0);

  useEffect(() => {
    if (account.instance) {
      if (account.service === AccountService.Pronote) {
        setFirstDate(new Date(account.instance.instance.firstDate));
      }
    }
  }, [account]);

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(firstDate);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const [currentlyUpdating, setCurrentlyUpdating] = useState(false);

  useEffect(() => {
    setCurrentWeek(getWeekNumber(currentDay));

    if (!timetables[currentWeek] && !currentlyUpdating && account.instance) {
      setCurrentlyUpdating(true);
      updateTimetableForWeekInCache(account, currentWeek);
    }
  }, [currentDay, currentlyUpdating]);

  useEffect(() => {
    if (timetables[currentWeek]) {
      const courses = timetables[currentWeek].filter(c => new Date(c.startTimestamp).getDay() === currentDay.getDay());
      setCourses(courses);

      const nextCourse = courses.find(c => {
        const courseDate = new Date(c.startTimestamp);
        const currentDate = new Date(currentDay);

        return courseDate > currentDate;
      });

      if (nextCourse) {
        setNextCourseIndex(courses.indexOf(nextCourse));
      }
    }
  }, [timetables, currentWeek]);

  if (courses.length === 0) {
    return null;
  }

  return (
    <>
      <NativeListHeader animated label="Emploi du temps"
        trailing={(
          <RedirectButton navigation={PapillonNavigation.current} redirect="Lessons" />
        )}
      />
      <Reanimated.View
        layout={animPapillon(LinearTransition)}
        style={{
          marginTop: 24,
          gap: 10,
        }}
      >
        {courses.splice(nextCourseIndex, nextCourseIndex + 3).map((course, index) => (
          <TimetableItem item={course} index={index} small />
        ))}
      </Reanimated.View>
    </>
  );
};

export default TimetableElement;