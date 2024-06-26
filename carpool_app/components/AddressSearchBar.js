import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { REACT_APP_MAPBOX_API_KEY } from "@env";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Test that api is called, that form updates, that session is managed
const AddressSearchBar = ({ handleTextChange, defaultText = "" }) => {
  const [input, setInput] = useState(defaultText);
  const [address, setAddress] = useState(defaultText);
  const [suggestions, setSuggestions] = useState([]);
  const [prevInputLength, setPrevInputLength] = useState(input.length);
  const SESSION_METADATA_KEY = "MAPBOX_SESSION_METADATA";

  const fetchAddressSuggestions = async () => {
    const sessionToken = await getSessionToken();
    const apiUrl = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
      input
    )}&access_token=${REACT_APP_MAPBOX_API_KEY}&session_token=${sessionToken}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.suggestions;
    } else {
      throw new Error("Failed to fetch address suggestions");
    }
  };

  const generateNewSessionMetadata = () => ({
    token: uuidv4(),
    createdAt: Date.now(),
    requestCount: 0,
  });

  const displayNameAndAddress = (item) => {
    if (item.name == item.address) {
      return item.full_address;
    }
    return `${item.name.toUpperCase()} ${item.full_address}`;
  };

  const getSessionToken = async () => {
    const metadataString = await AsyncStorage.getItem(SESSION_METADATA_KEY);
    let metadata = metadataString ? JSON.parse(metadataString) : null;

    if (
      metadata &&
      Date.now() - metadata.createdAt < 3600000 &&
      metadata.requestCount < 50
    ) {
      metadata.requestCount += 1;
      await AsyncStorage.setItem(
        SESSION_METADATA_KEY,
        JSON.stringify(metadata)
      );
      return metadata.token;
    } else {
      console.log("Creating new mapbox api session!");
      metadata = generateNewSessionMetadata();
      await AsyncStorage.setItem(
        SESSION_METADATA_KEY,
        JSON.stringify(metadata)
      );
      return metadata.token;
    }
  };

  useEffect(() => {
    if (
      input.length > 5 &&
      prevInputLength < input.length &&
      input != defaultText
    ) {
      fetchAddressSuggestions().then(setSuggestions).catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [input, prevInputLength]);

  const handleInputChange = (userInput) => {
    setPrevInputLength(input.length);
    setInput(userInput);
  };

  const handleAddressPress = (item) => {
    setInput(displayNameAndAddress(item));
    handleTextChange(item.full_address);
    setPrevInputLength(1000); //So that it no longer calls the autofill
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        testID="addressTextInput"
        value={input}
        onChangeText={handleInputChange}
        placeholder="Start typing an address..."
        style={styles.textInput}
      />
      <FlatList
        data={suggestions}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.mapbox_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleAddressPress(item)}
          >
            <Text style={styles.listItemText}>
              {displayNameAndAddress(item)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});

export default AddressSearchBar;
