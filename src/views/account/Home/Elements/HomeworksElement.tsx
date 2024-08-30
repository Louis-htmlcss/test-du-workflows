import { NativeItem, NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import { useCurrentAccount } from "@/stores/account";
import { AccountService } from "@/stores/account/types";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHomeworkStore } from "@/stores/homework";
import { toggleHomeworkState, updateHomeworkForWeekInCache } from "@/services/homework";
import HomeworkItem from "../../Homeworks/Atoms/Item";
import { Homework } from "@/services/shared/Homework";
import { debounce } from "lodash";
import { PapillonNavigation } from "@/router/refs";
import RedirectButton from "@/components/Home/RedirectButton";

const HomeworksElement = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const account = useCurrentAccount(store => store.account!);
  const homeworks = useHomeworkStore(store => store.homeworks);

  const [currentWeek, setCurrentWeek] = useState(0);

  const currentDay = new Date(/* "2024-05-27" */);
  const [firstDate, setFirstDate] = useState(new Date("2023-09-01"));

  const [hwList, setHwList] = useState([]);

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

  const updateHomeworks = useCallback(async () => {
    await updateHomeworkForWeekInCache(account, currentWeek);
  }, [account, currentWeek]);

  const debouncedUpdateHomeworks = useMemo(() => debounce(updateHomeworks, 500), [updateHomeworks]);

  useEffect(() => {
    debouncedUpdateHomeworks();
  }, [account.instance, currentWeek]);


  useEffect(() => {
    setCurrentWeek(getWeekNumber(currentDay));
  }, [currentDay, currentlyUpdating]);

  const handleDonePress = useCallback(
    async (homework: Homework) => {
      await toggleHomeworkState(account, homework);
      await updateHomeworks();
    },
    [account, updateHomeworks]
  );

  if (!homeworks[currentWeek] || homeworks[currentWeek]?.filter(hw => new Date(hw.due).getDate() === currentDay.getDate()).length === 0) {
    return null;
  }

  return (
    <>
      <NativeListHeader animated label="Travail à faire"
        trailing={(
          <RedirectButton navigation={PapillonNavigation.current} redirect="Homeworks" />
        )}
      />
      <NativeList>
        {homeworks[currentWeek]?.filter(hw => new Date(hw.due).getDate() === currentDay.getDate()).map((hw, index) => (
          <HomeworkItem
            homework={hw}
            key={index}
            index={index}
            total={homeworks[currentWeek].length}
            onDonePressHandler={() => {
              handleDonePress(hw);
            }}
          />
        ))}
      </NativeList>
    </>
  );
};

export default HomeworksElement;