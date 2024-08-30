import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DeviceMotion } from "expo-sensors";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import * as Brightness from "expo-brightness";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { X } from "lucide-react-native";
import ScanIcon from "@/components/Restaurant/ScanIcon";
import type { Screen } from "@/router/helpers/types";

const BETA_THRESHOLD_LOW = -0.2;
const BETA_THRESHOLD_HIGH = -0.15;
const ANIMATION_DURATION = 500;

const RestaurantQrCode: Screen<"RestaurantQrCode"> = ({ navigation }) => {
  const [currentState, setCurrentState] = useState<
    "neutral" | "tiltedUp" | "tiltedDown"
  >("neutral");
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const theme = useTheme();
  const { colors } = theme;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={navigation.goBack}
          style={[styles.headerButton, { backgroundColor: "#ffffff30" }]}
        >
          <X size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    Brightness.setBrightnessAsync(1);
    return () => {
      Brightness.setBrightnessAsync(0.5);
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      let newState: "neutral" | "tiltedUp" | "tiltedDown" = "neutral";

      if (rotation.beta < BETA_THRESHOLD_LOW) {
        newState = "tiltedDown";
      } else if (rotation.beta > BETA_THRESHOLD_HIGH) {
        newState = "tiltedUp";
      }

      if (newState !== currentState) {
        setCurrentState(newState);
        const finalRotation = newState === "tiltedDown" ? 180 : 0;

        opacity.value = withTiming(0, {
          duration: ANIMATION_DURATION / 2,
          easing: Easing.out(Easing.ease),
        }, () => {
          rotate.value = withTiming(finalRotation, {
            duration: ANIMATION_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          }, () => {
            opacity.value = withTiming(1, {
              duration: ANIMATION_DURATION / 2,
              easing: Easing.in(Easing.ease),
            });
          });
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [currentState, opacity, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCodeInnerContainer}>
          <QRCode
            value="6485903894359088983725987349"
            size={170}
            color="#000000"
            backgroundColor="#FFFFFF"
          />
        </View>
      </View>
      <Animated.View style={[styles.instructionContainer, animatedStyle]}>
        <ScanIcon color={colors.primary} />
        <Text style={styles.instructionText}>
          Orientez le code QR vers le scanner de la borne
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    backgroundColor: "black",
  },
  headerButton: {
    padding: 8,
    borderRadius: 50,
    margin: 5,
  },
  qrCodeContainer: {
    height: 200,
    width: 200,
    borderRadius: 15,
    marginTop: 75,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  qrCodeInnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionContainer: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: 200,
  },
});

export default RestaurantQrCode;
