import React, { useState } from "react";
import { checkUserExists } from "../Utils";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { REACT_APP_REMOTE_SERVER } from "@env";
import axios from "axios";
import AddressSearchBar from "./AddressSearchBar";
import BackArrow from "./BackArrow";
import CustomButton from "./CustomButton";

const StopCreation = ({ onClose, trip }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    const userObj = checkUserExists();
    const userId = userObj.uid;
    const idToken = await userObj.getIdToken(true);

    try {
      const response = await axios.post(
        `${REACT_APP_REMOTE_SERVER}/stops`,
        {
          userId: userId,
          routeId: trip.route.RouteId,
          tripId: trip.tripId,
          stopAddress: address,
          incomingUserId: trip.tripUserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
            userid: userId,
          },
        }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        console.log("Post created successfully!");
        onClose();
      } else {
        console.error("Failed to submit post:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={[{}, styles.container]}>
      <View style={[{}, styles.arrowContainer]}>
        <BackArrow onClose={onClose} />
        <View style={[{}, styles.textContainer]}>
          <Text style={styles.headerText}>Pickup Location</Text>
        </View>
      </View>
      <View style={[{}, styles.searchBarContainer]}>
        <AddressSearchBar
          handleTextChange={setAddress}
          style={[{}, styles.searchBarContainer]}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    marginBottom: 10,
    //backgroundColor: 'green',
    width: "fit",
    height: "fit",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    fontFamily: "Poppins-Black",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    //backgroundColor: 'pink'
  },
  arrowContainer: {
    //backgroundColor: 'cyan',
    width: "90%",
    //marginTop: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: -20,
  },
  textContainer: {
    //backgroundColor: 'cyan',
    width: "fit",
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    marginTop: 60,
    height: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor:'blue',
  },
  buttonContainer: {
    width: "90%",
    marginTop: -30,
    //backgroundColor: 'pink',
  },
  searchBarContainer: {
    //backgroundColor: 'purple',
    width: "90%",
    margin: 10,
    height: "fit",
  },
});
export default StopCreation;
