import { useTheme } from "@react-navigation/native";
import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Calendar } from "lucide-react-native";
import Reanimated, {
  Easing,
  LinearTransition,
  ZoomIn,
  ZoomOut
} from "react-native-reanimated";

const HeaderCalendar: React.FC<{ weekNumber: number, oldPageIndex: number, showPicker: () => void, changeIndex: (index: number) => void }> = ({ weekNumber, oldPageIndex, showPicker, changeIndex }) => {
  const { colors } = useTheme();

  const dims = Dimensions.get("window");
  const tablet = dims.width > 600;

  const index = oldPageIndex + weekNumber;

  return (
    <Reanimated.View
      style={{
        width: Dimensions.get("window").width - 50 - (tablet ? 400 : 0),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Reanimated.View
        style={{
          width: 1000,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {weekNumber > 0 ?
          <HeaderWeekComponent
            weekNumber={weekNumber - 2}
            active={false}
            key={index - 2}
            location="left"
            onPress={() => changeIndex(weekNumber - 2)}
          />
          : <View style={{ width: 120 }} />}
        {weekNumber > 0 ?
          <HeaderWeekComponent
            weekNumber={weekNumber - 1}
            active={false}
            key={index - 1}
            location="left"
            onPress={() => changeIndex(weekNumber - 1)}
          />
          : <View style={{ width: 120 }} />}
        <HeaderWeekComponent
          weekNumber={weekNumber}
          active={true}
          key={index}
          onPress={showPicker}
        />
        <HeaderWeekComponent
          weekNumber={weekNumber + 1}
          active={false}
          key={index + 1}
          location="right"
          onPress={() => changeIndex(weekNumber + 1)}
        />
        <HeaderWeekComponent
          weekNumber={weekNumber + 2}
          active={false}
          key={index + 2}
          location="right"
          onPress={() => changeIndex(weekNumber + 2)}
        />
      </Reanimated.View>
    </Reanimated.View>
  );
};

const HeaderWeekComponent: React.FC<{ weekNumber: number, active: boolean, location?: string, onPress?: () => void }> = ({ weekNumber, active, location, onPress }) => {
  const { colors } = useTheme();

  return (
    <Reanimated.View
      layout={LinearTransition.duration(300).easing(Easing.bezier(0.5, 0, 0, 1).factory())}
    >
      <TouchableOpacity onPress={onPress}>
        <Reanimated.View
          style={[
            {
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingVertical: 6,
              borderRadius: 10,
              borderCurve: "continuous",
              flexDirection: "row",
              paddingHorizontal: 10,
              overflow: "hidden",
            },
            active ? {} : {
              width: 120,
              opacity: 0.4,
            },
          ]}
        >
          {active &&
            <Reanimated.View
              layout={LinearTransition.springify().mass(1).damping(20).stiffness(300)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.primary + "21",
              }}
              entering={ZoomIn.springify().mass(1).damping(20).stiffness(300)}
              exiting={ZoomOut.springify().mass(1).damping(20).stiffness(300)}
            />
          }

          {active &&
            <Reanimated.View
              layout={LinearTransition.springify().mass(1).damping(20).stiffness(300)}
              entering={ZoomIn.duration(200)}
              exiting={ZoomOut.duration(200)}
            >
              <Calendar
                size={20}
                color={colors.primary}
              />
            </Reanimated.View>
          }

          <Reanimated.Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontFamily: "medium",
              color: !active ? colors.text : colors.primary,
            }}
            layout={LinearTransition.duration(200)}
          >
            Semaine {weekNumber}
          </Reanimated.Text>
        </Reanimated.View>
      </TouchableOpacity>
    </Reanimated.View>
  );
};

export { HeaderCalendar };