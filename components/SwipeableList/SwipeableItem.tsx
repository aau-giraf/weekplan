import { useRef } from "react";
import { SwipeAction } from "./SwipeAction";
import { Action } from "./SwipeableList";
import { LayoutChangeEvent, ListRenderItem, ListRenderItemInfo, View } from "react-native";
import ReanimatedSwipeable, { SwipeableMethods, SwipeableProps } from "../ReanimatedSwipeable";

type SwipeableItemProps<T> = {
  renderItem: ListRenderItem<T>;
  itemDimensions: number;
  leftActions?: Action<T>[];
  rightActions?: Action<T>[];
  handleLayout: (event: LayoutChangeEvent) => void;
  swipeableProps?: SwipeableProps;
  info: ListRenderItemInfo<T>;
};

export const SwipeableItem = <T,>({
  renderItem,
  itemDimensions,
  leftActions,
  rightActions,
  handleLayout,
  swipeableProps,
  info,
}: SwipeableItemProps<T>) => {
  const swipeableRef = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      {...swipeableProps}
      friction={1.5}
      overshootFriction={10}
      overshootLeft={false}
      overshootRight={false}
      {...(leftActions?.length && {
        renderLeftActions: (_prog, drag) =>
          SwipeAction(drag, itemDimensions, leftActions, "left", info.item, swipeableRef),
      })}
      {...(rightActions?.length && {
        renderRightActions: (_prog, drag) =>
          SwipeAction(drag, itemDimensions, rightActions, "right", info.item, swipeableRef),
      })}>
      <View onLayout={handleLayout}>{renderItem && renderItem(info)}</View>
    </ReanimatedSwipeable>
  );
};
