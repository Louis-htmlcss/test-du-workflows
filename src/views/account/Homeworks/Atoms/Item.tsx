import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import parse_homeworks from "@/utils/format/format_pronote_homeworks";
import { getSubjectData } from "@/services/shared/Subject";
import { useTheme } from "@react-navigation/native";
import type { Homework } from "@/services/shared/Homework";
import { NativeItem, NativeText } from "@/components/Global/NativeComponents";
import PapillonCheckbox from "@/components/Global/PapillonCheckbox";

const HomeworkItem = React.memo(({ homework, onDonePressHandler, index, total }: {
  homework: Homework,
  onDonePressHandler: () => unknown,
  index: number,
  total: number
}) => {
  const theme = useTheme();
  const [subjectData, setSubjectData] = useState({ color: "#888888", pretty: "Matière inconnue" });

  useEffect(() => {
    const data = getSubjectData(homework.subject);
    setSubjectData(data);
  }, [homework.subject]);

  const [isLoading, setIsLoading] = useState(false);

  const handlePress = useCallback(() => {
    setIsLoading(true);
    onDonePressHandler();
  }, [onDonePressHandler]);

  const [mainLoaded, setMainLoaded] = useState(false);

  // on done change
  useEffect(() => {
    setIsLoading(false);
    setMainLoaded(true);
  }, [homework.done]);

  const parsedContent = useMemo(() => parse_homeworks(homework.content), [homework.content]);

  return (
    <NativeItem
      separator={index !== total - 1}
      leading={
        <PapillonCheckbox
          checked={homework.done}
          loading={isLoading}
          onPress={handlePress}
          style={{ marginRight: 1 }}
          color={subjectData.color}
          loaded={mainLoaded}
        />
      }
    >
      <NativeText variant="overtitle" style={{ color: subjectData.color }} numberOfLines={1}>
        {subjectData.pretty}
      </NativeText>
      <NativeText variant="default" numberOfLines={3}>
        {parsedContent}
      </NativeText>
    </NativeItem>
  );
});

export default HomeworkItem;