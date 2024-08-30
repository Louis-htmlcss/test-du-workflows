import React from "react";
import { View, Image, type ViewStyle } from "react-native";

interface ColorIndicatorProps {
  style?: ViewStyle
  color: string
}

const ColorIndicator: React.FC<ColorIndicatorProps> = ({ color, style }) => {
  return (
    <View style={{ flex: style?.flex || 1, justifyContent: "center", alignItems: "center", ...style }}>
      <View
        style={{
          backgroundColor: color + "88",
          width: 10,
          flex: 1,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Image
          source={require("../../../assets/images/mask_lesson.png")}
          resizeMode="cover"
          style={{ width: "100%", height: "100%", tintColor: color }}
        />
      </View>
    </View>
  );
};

export default React.memo(ColorIndicator);
