import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { colors, ScaleSize, SharedStyles } from "../../utils/SharedStyles";
import { SwipeableMethods } from "../ReanimatedSwipeable";
import { Action } from "./SwipeableList";
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

export function SwipeAction<T>(
  drag: SharedValue<number>,
  actionDimensions: number,
  actions: Action<T>[],
  swipeDirection: "left" | "right",
  item: T,
  ref: React.RefObject<SwipeableMethods> | undefined
) {
  const swipeDirectionValue = swipeDirection === "left" ? -1 : 1;
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: drag.value + actionDimensions * actions.length * swipeDirectionValue,
        },
      ],
    };
  });
  return (
    <Reanimated.View style={[styleAnimation, { flexDirection: "row" }]}>
      {actions.map((act, index) => (
        <TouchableOpacity
          key={act.icon}
          onPress={() => {
            setTimeout(() => {
              ref?.current?.close();
            }, act.closeDelay ?? 0);
            act.onPress(item);
          }}
          testID={`${swipeDirection}-action-${index}`}
          style={[SharedStyles.trueCenter, { backgroundColor: act.color }, { width: actionDimensions }]}>
          <Ionicons
            name={act.icon}
            size={ScaleSize(48)}
            color={colors.white}
            testID={swipeDirection === "left" ? "left-action-icon" : "right-action-icon"}
          />
        </TouchableOpacity>
      ))}
    </Reanimated.View>
  );
}
