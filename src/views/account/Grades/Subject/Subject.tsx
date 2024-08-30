import type { RouteParameters } from "@/router/helpers/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Grade, GradesPerSubject } from "@/services/shared/Grade";
import { NativeListHeader } from "@/components/Global/NativeComponents";
import { animPapillon } from "@/utils/ui/animations";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import SubjectItem from "./SubjectList";

interface SubjectProps {
  allGrades: Grade[]
  gradesPerSubject: GradesPerSubject[]
  navigation: NativeStackNavigationProp<RouteParameters, keyof RouteParameters>
}

const Subject: React.FC<SubjectProps> = ({
  gradesPerSubject,
  navigation,
  allGrades
}) => {
  return (
    <Reanimated.View
      layout={animPapillon(LinearTransition)}
    >
      <NativeListHeader label="Mes notes" />

      {gradesPerSubject.map((subject, index) => (
        <SubjectItem
          key={subject.average.subjectName + index}
          subject={subject}
          navigation={navigation}
          allGrades={allGrades}
        />
      ))}
    </Reanimated.View>
  );
};

export default Subject;