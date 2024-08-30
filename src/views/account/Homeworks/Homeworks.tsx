import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { Screen } from "@/router/helpers/types";
import { toggleHomeworkState, updateHomeworkForWeekInCache } from "@/services/homework";
import { useHomeworkStore } from "@/stores/homework";
import { useCurrentAccount } from "@/stores/account";
import { HeaderCalendar } from "./HomeworksHeader";
import HomeworkItem from "./Atoms/Item";
import { RefreshControl } from "react-native-gesture-handler";
import HomeworksNoHomeworksItem from "./Atoms/NoHomeworks";
import { Homework } from "@/services/shared/Homework";
import InfinitePager from "react-native-infinite-pager";
import PagerView from "react-native-pager-view";
import { NativeList, NativeListHeader } from "@/components/Global/NativeComponents";
import { Account, AccountService } from "@/stores/account/types";
import { debounce } from "lodash";

// Types pour les props du composant HomeworkList
type HomeworkListProps = {
  groupedHomework: Record<string, Homework[]>;
  loading: boolean;
  onDonePressHandler: (homework: Homework) => void;
};

const formatDate = (date: string | number | Date): string => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long"
  });
};

const HomeworkList: React.FC<HomeworkListProps> = React.memo(({ groupedHomework, loading, onDonePressHandler }) => {
  if (!loading && Object.keys(groupedHomework).length === 0) {
    return <HomeworksNoHomeworksItem />;
  }

  return (
    <>
      {Object.keys(groupedHomework).map((day, index) => (
        <View key={index}>
          <NativeListHeader label={day} />
          <NativeList>
            {groupedHomework[day].map((homework, idx) => (
              <HomeworkItem
                key={homework.id}
                index={idx}
                total={groupedHomework[day].length}
                homework={homework}
                onDonePressHandler={async () => onDonePressHandler(homework)}
              />
            ))}
          </NativeList>
        </View>
      ))}
    </>
  );
});

// Types pour les props du composant HomeworksPage
type HomeworksPageProps = {
  index: number;
  isActive: boolean;
  loaded: boolean;
  homeworks: Record<number, Homework[]>;
  account: Account;
  updateHomeworks: () => Promise<void>;
  loading: boolean;
  getDayName: (date: string | number | Date) => string;
};

const HomeworksPage: React.FC<HomeworksPageProps> = React.memo(({ index, isActive, loaded, homeworks, account, updateHomeworks, loading, getDayName }) => {
  if (!loaded) {
    return null;
  }

  const homeworksInWeek = homeworks[index] ?? [];
  const sortedHomework = useMemo(
    () => homeworksInWeek.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()),
    [homeworksInWeek]
  );

  const groupedHomework = useMemo(
    () =>
      sortedHomework.reduce((acc, curr) => {
        const dayName = getDayName(curr.due);
        const formattedDate = formatDate(curr.due);
        const day = `${dayName} ${formattedDate}`;

        if (!acc[day]) {
          acc[day] = [curr];
        } else {
          acc[day].push(curr);
        }

        return acc;
      }, {} as Record<string, Homework[]>),
    [sortedHomework]
  );

  const handleDonePress = useCallback(
    async (homework: Homework) => {
      await toggleHomeworkState(account, homework);
      await updateHomeworks();
    },
    [account, updateHomeworks]
  );

  const [refreshing, setRefreshing] = useState(false);

  const refreshAction = useCallback(async () => {
    setRefreshing(true);
    await updateHomeworks();
    setRefreshing(false);
  }, [updateHomeworks]);

  return (
    <ScrollView
      style={{ flex: 1, padding: 16, paddingTop: 0 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshAction}
        />
      }
    >
      <HomeworkList
        groupedHomework={groupedHomework}
        loading={loading}
        onDonePressHandler={handleDonePress}
      />

      <View style={{ height: 16 }} />
    </ScrollView>
  );
});

const HomeworksScreen: Screen<"Homeworks"> = ({ navigation }) => {
  const theme = useTheme();
  const account = useCurrentAccount(store => store.account!);
  const homeworks = useHomeworkStore(store => store.homeworks);

  // NOTE: PagerRef is a pain to type, please help me...
  const PagerRef = useRef<any>(null);

  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    console.log("[Homeworks]: account instance changed");
    if (account.instance) {
      const firstDate = account.service === AccountService.Pronote ? account.instance.instance.firstDate : new Date("2023-09-01");
      const today = new Date();

      // get week number
      const diff = today.getTime() - firstDate.getTime();
      const oneWeek = 1000 * 60 * 60 * 24 * 7;
      let weekNumber = Math.floor(diff / oneWeek);

      if(weekNumber <= 0) weekNumber = 1;
      if(weekNumber >= 54) weekNumber = 53;

      console.log("[Homeworks]: setting week number to", weekNumber);
      setWeekNumber(weekNumber);

      manuallyChangeWeek(weekNumber);
    }
  }, [account.instance]);

  const manuallyChangeWeek = (index: number) => {
    PagerRef.current?.setPage(index);
  };

  const MemoizedHeaderCalendar = useMemo(
    () => (
      <HeaderCalendar
        weekNumber={weekNumber}
        oldPageIndex={0}
        showPicker={() => {
          /* Implement date picker logic here */
        }}
        changeIndex={(index: number) => manuallyChangeWeek(index)}
      />
    ),
    [weekNumber, manuallyChangeWeek]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => MemoizedHeaderCalendar,
    });
  }, [navigation, weekNumber]);

  const homeworkInCurrentWeek = useMemo(() => homeworks[weekNumber] ?? [], [homeworks, weekNumber]);

  const updateHomeworks = useCallback(async () => {
    if (weekNumber < 0 || weekNumber > 53) return;
    setLoading(true);
    console.log("[Homeworks]: updating cache...");
    await updateHomeworkForWeekInCache(account, weekNumber);
    console.log("[Homeworks]: updated cache !");
    setLoading(false);
  }, [account, weekNumber]);

  const debouncedUpdateHomeworks = useMemo(() => debounce(updateHomeworks, 500), [updateHomeworks]);

  const getDayName = (date: string | number | Date): string => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[new Date(date).getDay()];
  };

  useEffect(() => {
    debouncedUpdateHomeworks();
  }, [navigation, account.instance, weekNumber]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {account.instance && (
        <PagerView
          ref={PagerRef}
          initialPage={1}
          style={{ flex: 1 }}
          onPageScroll={({ nativeEvent }) => {
            if (nativeEvent.offset >= 0.5)
              setWeekNumber(nativeEvent.position + 1);
            else if (nativeEvent.offset <= -0.5)
              setWeekNumber(nativeEvent.position - 1);
            else {
              setWeekNumber(nativeEvent.position);
            }
          }}
        >
          {Array.from({ length: 54 }, (_, i) => i).map((_, index) => (
            <HomeworksPage
              key={index}
              index={index}
              isActive={index === weekNumber}
              loaded={index > weekNumber - 2 && index < weekNumber + 2}
              homeworks={homeworks}
              account={account}
              updateHomeworks={updateHomeworks}
              loading={loading}
              getDayName={getDayName}
            />
          ))}
        </PagerView>
      )}
    </View>
  );
};

export default HomeworksScreen;
