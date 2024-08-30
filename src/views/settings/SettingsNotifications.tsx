import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, StyleSheet, Image, Switch } from "react-native";
import type { Screen } from "@/router/helpers/types";
import { useTheme } from "@react-navigation/native";
import { Bell, ChevronLeft, MegaphoneOff, CalendarCheck, BookCheck, TrendingUp, Backpack, ChefHat } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming, LinearTransition } from "react-native-reanimated";
import { NativeIcon, NativeItem, NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import NotificationContainerCard from "@/components/Settings/NotificationContainerCard";
import { requestNotificationPermission } from "@/background/Notifications";
import { alertExpoGo, isExpoGo } from "@/utils/native/expoGoAlert";

const SettingsNotifications: Screen<"SettingsNotifications"> = () => {
  const theme = useTheme();
  const [enabled, setEnabled] = useState(false);

  // Animation states
  const opacity = useSharedValue(0);
  const borderRadius = useSharedValue(20);
  const width = useSharedValue("90%");
  const marginBottom = useSharedValue(0);

  // New shared value for inverted opacity
  const invertedOpacity = useSharedValue(1);

  // Animation effects
  useEffect(() => {
    opacity.value = withTiming(enabled ? 1 : 0, { duration: 200 });
    invertedOpacity.value = withTiming(enabled ? 0 : 1, { duration: 200 });
    borderRadius.value = withTiming(enabled ? 20 : 13, { duration: 200 });
    width.value = withTiming(enabled ? "90%" : "80%", { duration: 300 });
    marginBottom.value = withTiming(enabled ? 0 : -10, { duration: 200 });
  }, [enabled]);

  const askEnabled = async (enabled: boolean) => {
    if (isExpoGo()) {
      alertExpoGo();
      return;
    }

    if (enabled) {
      await requestNotificationPermission();
    }

    setEnabled(enabled);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingTop: 0,
      }}
    >
      <NotificationContainerCard
        theme={theme}
        isEnable={enabled}
        setEnabled={askEnabled}
      />

      {/*
      <NativeList>
        <NativeItem
          leading={<NativeIcon icon={<CalendarCheck />} color={colors.primary} />}
          trailing={
            <Switch
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              style={{
                marginRight: 10,
              }}
            />
          }
        >
          <NativeText variant="title">Modification de cours</NativeText>
          <NativeText
            style={{
              color: colors.text + "80",
            }}
          >Cours de mathématiques annulé dans 10 minutes</NativeText>
        </NativeItem>

        <NativeItem
          leading={<NativeIcon icon={<BookCheck />} color={colors.primary} />}
          trailing={
            <Switch
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              style={{
                marginRight: 10,
              }}
            />
          }
        >
          <NativeText variant="title" >Travail à faire pour demain</NativeText>
          <NativeText
            style={{
              color: colors.text + "80",
            }}
          >N’oublie pas de terminer ton devoir de français pour demain</NativeText>
        </NativeItem>

        <NativeItem
          leading={<NativeIcon icon={<TrendingUp />} color={colors.primary} />}
          trailing={
            <Switch
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              style={{
                marginRight: 10,
              }}
            />
          }
        >
          <NativeText variant="title" >Nouvelle note</NativeText>
          <NativeText
            style={{
              color: colors.text + "80",
            }}
          >Nouvelle note disponible : 18/20 en histoire</NativeText>
        </NativeItem>
      </NativeList>

      <NativeList>
        <NativeItem
          leading={<NativeIcon icon={<Backpack />} color={colors.primary} />}
          trailing={
            <Switch
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              style={{
                marginRight: 10,
              }}
            />
          }
        >
          <NativeText variant="title">Faire son sac</NativeText>
          <NativeText
            style={{
              color: colors.text + "80",
            }}
          >N’oublie pas de préparer ton sac pour les cours de demain</NativeText>
        </NativeItem>

        <NativeItem
          leading={<NativeIcon icon={<ChefHat />} color={colors.primary} />}
          trailing={
            <Switch
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              style={{
                marginRight: 10,
              }}
            />
          }
        >
          <NativeText variant="title">Réserver le self</NativeText>
          <NativeText
            style={{
              color: colors.text + "80",
            }}
          >Pense à réserver ton repas pour demain, journée de cours prévue</NativeText>
        </NativeItem>
      </NativeList>
      */}

    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  title: {
    color: "#222222",
    fontSize: 15,
  },
  time: {
    color: "#3F3F3F",
    opacity: 0.5,
    textAlign: "right",
    fontSize: 13,
    marginRight: 10,
  },
  message: {
    color: "#3F3F3F",
    fontSize: 14,
    maxWidth: "85%",
    minWidth: "85%",
    lineHeight: 15,
    letterSpacing: -0.4,
  },

  overlay: {
    backgroundColor: "#EEF5F5",
    borderWidth: 1,
    borderColor: "#00000030",
    borderRadius: 20,
    height: 25,
    padding: 9,
    marginHorizontal: 20,
  },
});

export default SettingsNotifications;
