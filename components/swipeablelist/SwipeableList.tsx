import { SwipeableItem } from "./SwipeableItem";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Reanimated, {
  AnimatedStyle,
  FlatListPropsWithLayout,
  LinearTransition,
} from "react-native-reanimated";
import { LayoutChangeEvent, ListRenderItem, Platform, StyleProp, ViewStyle } from "react-native";
import { SwipeableMethods, SwipeableProps } from "react-native-gesture-handler/ReanimatedSwipeable";

export type Action<T> = {
  icon: keyof typeof Ionicons.glyphMap | ((item: T) => keyof typeof Ionicons.glyphMap);
  color: string;
  onPress: (item: T) => void;
  closeDelay?: number;
};

type SwipeableListProps<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  reanimatedSwipeableProps?: (item: T) => SwipeableProps & React.RefAttributes<SwipeableMethods>;
  flatListProps?: Omit<FlatListPropsWithLayout<T>, "data" | "renderItem" | "style">;
  leftActions?: Action<T>[];
  rightActions?: Action<T>[];
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

function isWithinRange(number: number, target: number, range: number) {
  return Math.abs(number - target) <= range;
}

/**
 * `swipeablelist` is a reusable component that displays a list of items with swipeable actions.
 * Each item in the list can reveal actions when swiped left or right, such as edit or delete options.
 * @example
 * ```tsx *
 * const MyComponent = () => {
 *   return (
 *     <swipeablelist
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
  renderItem,
  reanimatedSwipeableProps,
  flatListProps,
  leftActions,
  rightActions,
  style,
}: SwipeableListProps<T>) => {
  const [itemDimensions, setItemHeight] = useState<number>(2);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    /*
    I admit this is iffy, but it's the best I could come up with.
    I noticed a big performance decrease with larger lists. 
    After some testing, I narrowed the issue to a small unnoticeeable difference in height between items.
    This caused a rerender for every item in the list, which was very slow. 🤮🎪🤡🐡
    */
    if (!isWithinRange(height, itemDimensions, 1)) {
      setItemHeight(height);
    }
  };

  return (
    <Reanimated.FlatList
      {...flatListProps}
      style={style}
      data={items}
      keyExtractor={keyExtractor}
      itemLayoutAnimation={Platform.OS === "android" ? undefined : LinearTransition}
      renderItem={(info) => {
        const swipeableProps = reanimatedSwipeableProps?.(info.item);
        return (
          <SwipeableItem
            renderItem={renderItem}
            itemDimensions={itemDimensions}
            leftActions={leftActions}
            rightActions={rightActions}
            handleLayout={handleLayout}
            swipeableProps={swipeableProps}
            info={info}
          />
        );
      }}
    />
  );
};

export default SwipeableList;
