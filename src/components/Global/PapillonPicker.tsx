import React, { useEffect, useState } from "react";
import { View, Platform, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { PapillonContextEnter, PapillonContextExit } from "@/utils/ui/animations";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Reanimated, { type AnimatedStyle } from "react-native-reanimated";
import { NativeText } from "./NativeComponents";

import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";

interface PapillonPickerProps {
  children: React.ReactNode
  data: string[]
  selected: string
  contentContainerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
  delay?: number
  onSelectionChange?: (item: string) => unknown
}

const PapillonPicker: React.FC<PapillonPickerProps> = ({
  children,
  data,
  selected,
  contentContainerStyle,
  delay,
  onSelectionChange,
}) => {
  const theme = useTheme();
  const [contentHeight, setContentHeight] = useState(0);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    Haptics.selectionAsync();
  }, [opened]);

  const handleSelectionChange = (item: string) => {
    if (onSelectionChange) {
      setTimeout(() => {
        onSelectionChange(item);
      }, delay ?? 0);
    }
  };

  return (
    <Reanimated.View style={[styles.container, contentContainerStyle]}>
      <TouchableOpacity
        onPress={() => setOpened(!opened)}
      >
        <Reanimated.View
          style={styles.children}
          onLayout={(event)=> {
            const height = event.nativeEvent.layout.height;
            setContentHeight(height);
          }}
        >
          {children}
        </Reanimated.View>
      </TouchableOpacity>

      {opened && (
        <Reanimated.View
          style={[
            styles.picker,
            {
              backgroundColor: Platform.OS === "ios" ? theme.colors.card + 50 : theme.colors.card,
              borderColor: theme.colors.text + "35",
              top: contentHeight + 10,
            }
          ]}
          entering={PapillonContextEnter}
          exiting={PapillonContextExit}
        >
          <BlurView
            intensity={70}
            style={{
              flex: 1,
              borderRadius: 12,
              borderCurve: "continuous",
              overflow: "hidden",
            }}
            tint={theme.dark ? "dark" : "light"}
          >
            {data.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setOpened(false);
                    handleSelectionChange(item);
                  }}
                  style={[
                    styles.item
                  ]}
                >
                  <NativeText>{item}</NativeText>

                  {item === selected && (
                    <Check
                      size={20}
                      strokeWidth={2.5}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>

                {index === data.length - 1 ? null : (
                  <View
                    style={{
                      height: 1,
                      borderBottomColor: theme.colors.text + "25",
                      borderBottomWidth: 0.5,
                      marginLeft: 14,
                    }}
                  />
                )}
              </View>
            ))}
          </BlurView>
        </Reanimated.View>
      )}
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  children: {

  },
  picker: {
    position: "absolute",
    top: 0,
    right: 0,
    borderWidth: 0.5,
    zIndex: 10000000000,

    minWidth: 200,

    borderRadius: 12,
    borderCurve: "continuous",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2,
  },
  item: {
    paddingVertical: 12,
    paddingRight: 14,
    marginLeft: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PapillonPicker;
