import React from "react";
import { View } from "react-native";
import { NativeText } from "../Global/NativeComponents";

const InitialIndicator = ({ initial, color }: { initial: string, color: string }) => {

  return (
    <View style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: -1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: color,
    }}>
      <NativeText variant="title" style={{
        color: "white",
      }}>
        {initial.substr(0, 2).toUpperCase()}
      </NativeText>
    </View>
  );
};

export default InitialIndicator;