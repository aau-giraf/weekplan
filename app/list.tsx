import { ListRenderItemInfo, Text, View } from "react-native";
import SwipeableList from "../components/SwipeableList";

const SwipeableListPage: React.FC = () => {
  const mock = [
    {
      id: "1",
      title: "Item 1",
      description: "Description 1",
    },
    {
      id: "2",
      title: "Item 2",
      description: "Description 2",
    },
    {
      id: "3",
      title: "Item 3",
      description: "Description 3",
    },
  ];

  const renderItem = ({ item }: ListRenderItemInfo<(typeof mock)[0]>) => (
    <View style={{ padding: 20, backgroundColor: "blue" }}>
      <Text>
        {item.title} - {item.description}
      </Text>
    </View>
  );

  return (
    <SwipeableList
      items={mock}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      leftActions={[
        {
          icon: "trash",
          color: "#FF0000",
          callBack: () => console.log("Delete"),
        },
      ]}
    />
  );
};

export default SwipeableListPage;
