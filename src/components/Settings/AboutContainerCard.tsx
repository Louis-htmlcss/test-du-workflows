import React, { useState, useEffect } from "react";
import type { Screen } from "@/router/helpers/types";

import { ScrollView, Image, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { NativeItem, NativeList, NativeText } from "../Global/NativeComponents";

const AboutContainerCard = ({ theme }: { theme: any }) => {
  const { colors } = theme;

  return (
    <NativeList>
      <View style={{
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: colors.primary + "22",
      }}>
        <Image
          source={require("@/../assets/images/settings/about_papillon.png")}
          style={{
            width: "90%",
            height: "90%",
            resizeMode: "contain",
            marginTop: 30,
          }}
        />
      </View>
      <NativeItem>
        <NativeText variant="title">
          Derrière Papillon
        </NativeText>
        <NativeText variant="subtitle">
          Papillon est maintenu par des étudiants 100% bénévoles.
        </NativeText>
      </NativeItem>
    </NativeList>
  );
};

export default AboutContainerCard;