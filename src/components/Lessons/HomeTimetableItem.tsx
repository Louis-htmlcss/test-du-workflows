import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const HomeTimetableItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text>HomeTimetableItem</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
});