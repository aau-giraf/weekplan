import React, { useState } from "react";
import {
  ListRenderItem,
  Platform,
  FlatListProps,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable, {
  SwipeableMethods,
  SwipeableProps,
} from "./ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";
import { colors, ScaleSize, SharedStyles } from "../utils/SharedStyles";

type Action = {
  icon: keyof typeof Ionicons.glyphMap;
  color: `#${string}`;
  callBack: () => void;
};

type SwipeableListProps<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  reanimatedSwipeableProps?: SwipeableProps &
    React.RefAttributes<SwipeableMethods>;
  flatListProps?: FlatListProps<T>;
  leftActions?: Action[];
  rightActions?: Action[];
};

const SwipeableList = <T,>({
  items,
  keyExtractor,
  renderItem: defaultRender,
  reanimatedSwipeableProps,
  flatListProps,
  leftActions,
  rightActions,
}: SwipeableListProps<T>) => {
  const [itemDimensions, setItemHeight] = useState<number | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight(height);
  };

  const renderItem: ListRenderItem<T> = (info) => (
    <ReanimatedSwipeable
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={(prog, drag) => {
        if (!itemDimensions || !leftActions || leftActions?.length === 0)
          return null;
        return SwipeAction(prog, drag, itemDimensions, leftActions, "left");
      }}
      renderRightActions={(prog, drag) => {
        if (!itemDimensions || !rightActions || rightActions?.length === 0)
          return null;
        return SwipeAction(prog, drag, itemDimensions, rightActions, "right");
      }}
      {...reanimatedSwipeableProps}>
      {/* This View will capture the item height once */}
      <View onLayout={handleLayout}>{defaultRender(info)}</View>
    </ReanimatedSwipeable>
  );

  return (
    <Animated.FlatList
      data={items}
      itemLayoutAnimation={
        Platform.OS === "android" ? undefined : LinearTransition
      }
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...flatListProps}
    />
  );
};

function SwipeAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  action_dimensions: number,
  action: Action[],
  swipeDirection: "left" | "right"
) {
  const direction = swipeDirection === "left" ? -1 : 1;
  const styleAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: drag.value + action_dimensions * action.length * direction,
      },
    ],
  }));

  return (
    <Animated.View style={[styleAnimation, { flexDirection: "row" }]}>
      {action.map((act) => (
        <TouchableOpacity
          key={act.icon}
          onPress={act.callBack}
          style={[
            SharedStyles.trueCenter,
            { backgroundColor: act.color },
            { width: action_dimensions },
          ]}>
          <Ionicons name={act.icon} size={ScaleSize(48)} color={colors.white} />
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

export default SwipeableList;
