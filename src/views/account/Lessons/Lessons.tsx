import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";

import { Screen } from "@/router/helpers/types";
import { updateTimetableForWeekInCache } from "@/services/timetable";
import { useCurrentAccount } from "@/stores/account";
import { useTimetableStore } from "@/stores/timetable";
import { Page } from "./Atoms/Page";

import InfinitePager from "react-native-infinite-pager";
import { HeaderCalendar, LessonsDateModal } from "./LessonsHeader";
import { AccountService } from "@/stores/account/types";
import type { Timetable as TTimetable } from "@/services/shared/Timetable";

const RenderPage = ({ index, timetables, getWeekFromIndex, loadTimetableWeek, currentPageIndex } : {
  index: number
  timetables: Record<number, TTimetable>
  getWeekFromIndex: (index: number) => {
    weekNumber: number;
    dayNumber: number;
  }
  loadTimetableWeek: (weekNumber: number) => Promise<void>
  currentPageIndex: number
}) => (
  <View>
    <Page
      index={index}
      timetables={timetables}
      getWeekFromIndex={getWeekFromIndex}
      loadTimetableWeek={loadTimetableWeek}
      current={Platform.OS === "ios" ? currentPageIndex === index : true}
    />
  </View>
);

const Timetable: Screen<"Lessons"> = ({ navigation }) => {
  const { colors } = useTheme();
  const account = useCurrentAccount(store => store.account!);
  const timetables = useTimetableStore(store => store.timetables);

  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  let loadedWeeks = useRef<Set<number>>(new Set());
  let currentlyLoadingWeeks = useRef<Set<number>>(new Set());

  // Too hard to type, please send help :D
  const PagerRef = useRef<any>(null);

  const today = useMemo(() => new Date(), []);
  const defaultDate = useMemo(() => new Date(today), [today]);

  const [firstDate, setFirstDate] = useState(new Date("2023-09-01"));

  useEffect(() => {
    if (account.instance) {
      if (account.service === AccountService.Pronote) {
        setFirstDate(new Date(account.instance.instance.firstDate));
      }
    }
  }, [account]);

  const getDateFromIndex = useCallback((index: number) => {
    const date = new Date(defaultDate);
    date.setDate(date.getDate() + index);
    return date;
  }, [defaultDate]);

  const getWeekFromIndex = (index: number) => {
    const date = getDateFromIndex(index);
    const firstDayOfYear = new Date(firstDate);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const dayNumber = date.getDay();
    return { weekNumber, dayNumber };
  };

  const loadTimetableWeek = async (weekNumber: number, force = false) => {
    if (currentlyLoadingWeeks.current.has(weekNumber)) return;
    if (loadedWeeks.current.has(weekNumber) && !force) return;
    currentlyLoadingWeeks.current.add(weekNumber);

    try {
      await updateTimetableForWeekInCache(account, weekNumber);
      loadedWeeks.current.add(weekNumber);
    } catch (error) {
      console.error(error);
    } finally {
      currentlyLoadingWeeks.current.delete(weekNumber);
    }
  };

  useEffect(() => {
    for (const key of Object.keys(timetables)) {
      loadedWeeks.current.add(Number(key));
    }
  }, [timetables]);

  useEffect(() => {
    const { weekNumber } = getWeekFromIndex(currentPageIndex);
    loadTimetableWeek(weekNumber);
  }, [currentPageIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderCalendar
          index={currentPageIndex}
          changeIndex={(index) => PagerRef.current?.setPage(index)}
          getDateFromIndex={getDateFromIndex}
          showPicker={() => setShowDatePicker(true)}
        />
      ),
    });
  }, [navigation, currentPageIndex]);

  return (
    <View style={{ backgroundColor: colors.background }}>
      {showDatePicker && (
        <LessonsDateModal
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          currentPageIndex={currentPageIndex}
          defaultDate={defaultDate}
          PagerRef={PagerRef}
          getDateFromIndex={getDateFromIndex}
        />
      )}

      <InfinitePager
        onPageChange={setCurrentPageIndex}
        ref={PagerRef}
        minIndex={1}
        renderPage={({ index }) => <RenderPage
          index={index}
          timetables={timetables}
          getWeekFromIndex={getWeekFromIndex}
          loadTimetableWeek={loadTimetableWeek}
          currentPageIndex={currentPageIndex}
        />}
        style={{ height: "100%" }}
      />
    </View>
  );
};

export default Timetable;
