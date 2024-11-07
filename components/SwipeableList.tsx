import { useCallback, useState } from "react";
import {
  ListRenderItem,
  FlatListProps,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import Reanimated, {
  AnimatedStyle,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable, {
  SwipeableMethods,
  SwipeableProps,
} from "./ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";
import { colors, ScaleSize, SharedStyles } from "../utils/SharedStyles";

export type Action<T> = {
  icon: keyof typeof Ionicons.glyphMap;
  color: `#${string}`;
  onPress: (item: T) => void;
};

type SwipeableListProps<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  reanimatedSwipeableProps?: (
    item: T
  ) => SwipeableProps & React.RefAttributes<SwipeableMethods>;
  flatListProps?: Omit<FlatListProps<T>, "data" | "renderItem" | "style">;
  leftActions?: Action<T>[];
  rightActions?: Action<T>[];
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

/**
 * `SwipeableList` is a reusable component that displays a list of items with swipeable actions.
 * Each item in the list can reveal actions when swiped left or right, such as edit or delete options.
 * @example
 * ```tsx *
 * const MyComponent = () => {
 *   return (
 *     <SwipeableList
 *       items={mockData}
 *       renderItem={renderItem}
 *       keyExtractor={(item) => item.id}
 *       leftActions={[
 *         {
 *           icon: "pencil",
 *           color: "#FFA500",
 *           onPress: (item) => console.log("Edit", item),
 *         },
 *       ]}
 *       rightActions={[
 *         {
 *           icon: "trash",
 *           color: "#FF0000",
 *           onPress: (item) => console.log("Delete", item),
 *         },
 *       ]}
 *     />
 *   );
 * };
 * ```
 */
const SwipeableList = <T,>({
  items,
  keyExtractor,
  renderItem: defaultRender,
  reanimatedSwipeableProps,
  flatListProps,
  leftActions,
  rightActions,
  style,
}: SwipeableListProps<T>) => {
  const [itemDimensions, setItemHeight] = useState<number>(50);

  //This View will capture the item height which will be used as the action width/height
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height !== itemDimensions) setItemHeight(height);
    },
    [itemDimensions]
  );

  const renderItem = useCallback<ListRenderItem<T>>(
    (info) => {
      //Bind the item to the swipeable props, such that it is avalible in callbacks
      const swipeableProps = reanimatedSwipeableProps?.(info.item);
      return (
        <ReanimatedSwipeable
          {...swipeableProps}
          friction={1.5}
          overshootFriction={10}
          overshootLeft={false}
          overshootRight={false}
          {...(leftActions?.length && {
            renderLeftActions: (_prog, drag) =>
              SwipeAction(drag, itemDimensions, leftActions, "left", info.item),
          })}
          {...(rightActions?.length && {
            renderRightActions: (_prog, drag) =>
              SwipeAction(
                drag,
                itemDimensions,
                rightActions,
                "right",
                info.item
              ),
          })}>
          <View onLayout={handleLayout}>{defaultRender(info)}</View>
        </ReanimatedSwipeable>
      );
    },
    [
      reanimatedSwipeableProps,
      handleLayout,
      defaultRender,
      leftActions,
      itemDimensions,
      rightActions,
    ]
  );

  return (
    <Reanimated.FlatList
      style={style}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...flatListProps}
    />
  );
};

function SwipeAction<T>(
  drag: SharedValue<number>,
  actionDimensions: number,
  actions: Action<T>[],
  swipeDirection: "left" | "right",
  item: T
) {
  // This will determine the direction of the swipe based on the swipeDirection prop
  const swipeDirectionValue = swipeDirection === "left" ? -1 : 1;
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            drag.value +
            actionDimensions * actions.length * swipeDirectionValue,
        },
      ],
    };
  });
  return (
    <Reanimated.View style={[styleAnimation, { flexDirection: "row" }]}>
      {actions.map((act) => (
        <TouchableOpacity
          key={act.icon}
          onPress={() => act.onPress(item)}
          style={[
            SharedStyles.trueCenter,
            { backgroundColor: act.color },
            { width: actionDimensions },
          ]}>
          <Ionicons
            name={act.icon}
            size={ScaleSize(48)}
            color={colors.white}
            testID={
              swipeDirection === "left"
                ? "left-action-icon"
                : "right-action-icon"
            }
          />
        </TouchableOpacity>
      ))}
    </Reanimated.View>
  );
}

export default SwipeableList;
