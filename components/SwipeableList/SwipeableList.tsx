import { SwipeableMethods, SwipeableProps } from "../ReanimatedSwipeable";
import { SwipeableItem } from "./SwipeableItem";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Reanimated, { AnimatedStyle, LinearTransition } from "react-native-reanimated";
import {
  FlatListProps,
  LayoutChangeEvent,
  ListRenderItem,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";

export type Action<T> = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: (item: T) => void;
  closeDelay?: number;
};

type SwipeableListProps<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  reanimatedSwipeableProps?: (item: T) => SwipeableProps & React.RefAttributes<SwipeableMethods>;
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
  renderItem,
  reanimatedSwipeableProps,
  flatListProps,
  leftActions,
  rightActions,
  style,
}: SwipeableListProps<T>) => {
  const [itemDimensions, setItemHeight] = useState<number>(50);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height !== itemDimensions) setItemHeight(height);
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
