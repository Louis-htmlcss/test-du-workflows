import { View, Animated, Easing, type ViewStyle, type StyleProp } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";

import Reanimated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { PressableScale } from "react-native-pressable-scale";
import { Svg, Circle, G } from "react-native-svg";
import { Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const LoaderSpinner = ({ size = 50, color = "#000000", strokeWidth = 4 }) => {
  const animatedValue = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue.current, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const spin = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

interface CheckboxProps {
  checked?: boolean
  loading?: boolean
  onPress: () => unknown
  style?: StyleProp<ViewStyle>
  color?: string
  loaded?: boolean
}

const PapillonCheckbox: React.FC<CheckboxProps> = ({
  checked,
  loading,
  onPress,
  style,
  color,
  loaded = true
}) => {
  const theme = useTheme();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
  }, []);

  const [hasPressed, setHasPressed] = useState(false);

  const pressAction = () => {
    onPress();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHasPressed(true);
  };

  // on checked change
  useEffect(() => {
    if (checked && hasPressed && loaded) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [checked, hasPressed]);

  return (
    <PressableScale
      style={[{
        width: 26,
        height: 26,
        borderRadius: 300,
        backgroundColor: theme.colors.text + "00",
        justifyContent: "center",
        alignItems: "center",
      }, style]}
      onPress={pressAction}
      activeScale={0.8}
      weight="light"
    >
      <Reanimated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: 300,
          borderColor: theme.colors.text + "22",
          borderWidth: 2,
        }}
      />

      {loading && !checked && (
        <Reanimated.View
          entering={ZoomIn.springify().mass(1).damping(20).stiffness(300).delay(100)}
          exiting={ZoomOut.duration(100)}
        >
          <LoaderSpinner size={26} strokeWidth={4} color={color} />
        </Reanimated.View>
      )}

      {checked && (
        <Reanimated.View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 300,
            backgroundColor: color || theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}

          entering={loaded ?
            ZoomIn
              .springify()
              .mass(1)
              .damping(20)
              .stiffness(300)
            : void 0}

          exiting={ZoomOut.duration(100)}
        >
          {checked && (
            <Reanimated.View
              entering={loaded ?
                ZoomIn
                  .springify()
                  .mass(1)
                  .damping(20)
                  .stiffness(300)
                  .delay(100)
                : void 0}
            >
              <Check
                size={18}
                strokeWidth={3.5}
                color="#fff"
              />
            </Reanimated.View>
          )}
        </Reanimated.View>
      )}
    </PressableScale>
  );
};

export default PapillonCheckbox;