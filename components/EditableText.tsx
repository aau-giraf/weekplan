import { useRef, useState, useEffect } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SharedStyles } from "../utils/SharedStyles";

type EditableTextProps = {
  initialText: string;
  callback: (submitted: string) => any;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  iconProps?: {
    style: StyleProp<ViewStyle>;
    size: number;
  };
};

export const EditableText = ({
  initialText,
  callback,
  style,
  textStyle,
  iconProps,
}: EditableTextProps) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const focusTextInput = () => {
    if (textInputRef.current) textInputRef.current.focus();
  };

  console.log(initialText);
  return (
    <View
      style={[
        style,
        SharedStyles.trueCenter,
        { display: "flex", flexDirection: "row" },
      ]}
    >
      {isEditing ? (
        <TextInput
          style={textStyle}
          ref={textInputRef}
          onChangeText={setText}
          value={text}
          onBlur={() => {
            setIsEditing(false);
            callback(text);
          }}
          onSubmitEditing={() => {
            setIsEditing(false);
            callback(text);
          }}
        />
      ) : (
        <Text style={textStyle}>{text}</Text>
      )}
      <TouchableOpacity
        onPress={() => {
          if (!isEditing) {
            setIsEditing(true);
            setTimeout(() => focusTextInput(), 0);
          } else {
            setIsEditing(false);
            callback(text);
          }
        }}
      >
        <Ionicons
          style={iconProps?.style}
          name="pencil-outline"
          size={iconProps?.size ?? 24}
          color="grey"
        />
      </TouchableOpacity>
    </View>
  );
};
