import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { timestampToWrittenDate } from "../Utils";

const InboxItem = ({ item, index, setSelectedIndex }) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setSelectedIndex(index)}
    >
      <Text style={styles.itemText}>Request sent by {item.userFullName}</Text>
      <View
        style={[
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
          },
          styles.addressInfo,
        ]}
      >
        <Icon name={"alarm-outline"} size={16} />
        <Text style={styles.itemText}>
          {timestampToWrittenDate(item.timestamp)}
        </Text>
      </View>
      <View
        style={[
          {
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
            margin: 8,
          },
        ]}
      >
        <Icon name={"business-outline"} size={16} />
        <Text style={styles.itemText}>{item.originAddress}</Text>
      </View>
      <View
        style={[
          {
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
            margin: 8,
          },
        ]}
      >
        <Icon name={"flag-outline"} size={16} />
        <Text style={styles.itemText}>{item.destinationAddress}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
  },
  itemText: {
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
  },
});

export default InboxItem;
