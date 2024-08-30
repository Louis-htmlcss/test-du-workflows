import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, StatusBar, TouchableOpacity, Platform } from "react-native";

import { defaultTabs } from "@/views/settings/SettingsTabs";
import LottieView from "lottie-react-native";
import { X } from "lucide-react-native";
import MissingItem from "@/components/Global/MissingItem";

const PlaceholderScreen = ({ route, navigation }) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    if(route.params?.outsideNav) {
      navigation.setOptions({
        headerTitle: () => (
          <View />
        ),
        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <LottieView
              source={defaultTabs.find(t => t.tab === route.name)?.icon}
              autoPlay
              loop={false}
              style={{
                width: 26,
                height: 26,
              }}
            />

            <Text
              style={{
                fontFamily: "semibold",
                fontSize: 17.5,
                color: theme.colors.text,
              }}
            >
              {defaultTabs.find(t => t.tab === route.name)?.label}
            </Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{
              padding: 6,
              backgroundColor: theme.colors.text + "30",
              borderRadius: 18,
              opacity: 0.6,
            }}
            onPress={() => navigation.goBack()}
          >
            <X size={20} strokeWidth={3} color={theme.colors.text} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, route.params]);

  const [isFocused, setIsFocused] = React.useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsFocused(true);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
      }}
    >
      <MissingItem
        emoji={"🚧"}
        title={"Fonctionnalité en construction"}
        description={"Cette page est en cours de développement, revenez plus tard."}
      />
    </View>
  );
};

export default PlaceholderScreen;