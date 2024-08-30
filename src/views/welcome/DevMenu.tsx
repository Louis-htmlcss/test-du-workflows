import { useTheme } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Button } from "react-native";
import type { Screen } from "@/router/helpers/types";

const DevMenu: Screen<"DevMenu"> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;

  // add button to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AccountSelector");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 0,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontFamily: "medium",
              fontSize: 17.5,
            }}
          >
            Appli
          </Text>

          <ChevronRight
            size={32}
            color={colors.primary}
            style={{ marginLeft: 0, marginRight: -8 }}
          />
        </TouchableOpacity>
      ),
      headerLargeTitle: true,
    });
  }, [navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        style={{
          backgroundColor: colors.text + "16",
          margin: 16,
          borderRadius: 10,
          borderCurve: "continuous",
          padding: 16,
          gap: 4,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontFamily: "bold",
          }}
        >
          Menu pour les développeurs
        </Text>


        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            lineHeight: 20,
            fontFamily: "medium",
            opacity: 0.7,
          }}
        >
          Intégrez vos options et paramètres de développement ici.
        </Text>
      </View>

      <Button
        title="Go to Account Selector"
        onPress={() => navigation.navigate("AccountSelector")}
      />

      <Button
        title="NoteReaction"
        onPress={() => navigation.navigate("NoteReaction")}
      />

      <Button
        title="ColorSelector"
        onPress={() => navigation.navigate("ColorSelector")}
      />

      <Button
        title="AccountCreated"
        onPress={() => navigation.navigate("AccountCreated")}
      />
    </ScrollView>
  );
};

export default DevMenu;