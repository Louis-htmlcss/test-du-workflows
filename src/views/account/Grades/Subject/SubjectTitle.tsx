import AnimatedNumber from "@/components/Global/AnimatedNumber";
import { NativeText } from "@/components/Global/NativeComponents";
import { getCourseSpeciality } from "@/utils/format/format_cours_name";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const SubjectTitle = ({ navigation, subject, subjectData, allGrades }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: subjectData.color + "11",
      }}
      onPress={() => {
        navigation.navigate("GradeSubject", { subject, allGrades });
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <NativeText
          style={{
            fontSize: 18,
            lineHeight: 24,
          }}
        >
          {subjectData.emoji}
        </NativeText>
        <NativeText
          style={{
            flex: 1,
          }}
          numberOfLines={1}
          variant="overtitle"
        >
          {subjectData.pretty}
        </NativeText>

        {getCourseSpeciality(subject.average.subjectName) && (
          <NativeText
            style={{
              textAlign: "right",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderColor: theme.colors.text + "55",
              borderWidth: 1,
              borderRadius: 8,
              borderCurve: "continuous",
              maxWidth: 120,
            }}
            numberOfLines={1}
            variant="subtitle"
          >
            {getCourseSpeciality(subject.average.subjectName)}
          </NativeText>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        <AnimatedNumber
          value={typeof subject.average.average.value === "number" ? subject.average.average.value.toFixed(2) : "N. not"}
          style={{
            fontSize: 18,
            lineHeight: 20,
            fontFamily: "semibold",
          }}
          contentContainerStyle={null}
        />
        <NativeText
          style={{
            fontSize: 15,
            lineHeight: 15,
            opacity: 0.6,
          }}
        >
          /{subject.average.outOf.value}
        </NativeText>
      </View>
    </TouchableOpacity>
  );
};

export default SubjectTitle;