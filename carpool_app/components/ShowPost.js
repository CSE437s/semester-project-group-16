import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MapComponent from "./MapComponent";
import StopCreation from "./StopCreation";
import BackArrow from "./BackArrow";
import {
  timestampToWrittenDate,
  checkUserExists,
  deleteStop,
  deleteTrip,
} from "../Utils";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";

const formatRouteTime = (routeTimeInSeconds) => {
  const minutes = Math.floor(parseInt(routeTimeInSeconds, 10) / 60);
  return `${minutes} minute`;
};

const ShowPost = ({ trip, onClose, fromManageCarpools = false }) => {
  console.log(JSON.stringify(trip));
  const [showApply, setShowApply] = useState(false);
  const [isYourPost, setIsYourPost] = useState(false);

  useEffect(() => {
    const checkIfUserCreatedPost = async () => {
      console.log("CALL---------");
      const user = await checkUserExists();
      const result = user.uid === trip.tripUserId;
      console.log(user.uid);
      console.log(trip.tripUserId);
      setIsYourPost(result);
    };
    checkIfUserCreatedPost();
  }, []);

  const handleClose = () => {
    setShowApply(false);
  };

  const handleDeletePost = async () => {
    try {
      await deleteTrip(trip.tripId);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteStop = async () => {
    try {
      const user = checkUserExists();
      const stopId = trip.getStopIdWithUserId(user.uid);
      await deleteStop(stopId);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const routeTimeFormatted = formatRouteTime(trip.route.routeTime);

  return (
    <View style={styles.container}>
      <View style={[{}, styles.arrowContainer]}>
        <BackArrow onClose={onClose} />
        <View style={[{}, styles.textContainer]}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[{}, styles.email]}
          >
            {trip.tripUserEmail}'s Trip
          </Text>
        </View>
      </View>

      <MapComponent ride={trip} mapHeight={375} />

      <View style={styles.tripDetails}>
        <Text style={styles.timestamp}>
          {timestampToWrittenDate(trip.timestamp)}
        </Text>
        <View
          style={[
            { display: "flex", flexDirection: "row", gap: 5 },
            styles.addressInfo,
          ]}
        >
          <Icon name={"business-outline"} size={16} />
          <Text style={styles.address}> {trip.route.originAddress}</Text>
        </View>
        <View
          style={[
            { display: "flex", flexDirection: "row", gap: 5, marginBottom: 10 },
            styles.addressInfo,
          ]}
        >
          <Icon name={"flag-outline"} size={16} />
          <Text style={styles.address}> {trip.route.destinationAddress}</Text>
        </View>
        <View style={[{}, styles.detailsContainer]}>
          <Text style={styles.detailText}>{routeTimeFormatted} trip</Text>
          <Text style={styles.detailText}>{trip.category}</Text>
          <Text style={styles.detailText}>{trip.stops.length} Passengers</Text>
        </View>
      </View>

      {fromManageCarpools == true ? (
        <>
          {isYourPost == true ? (
            <CustomButton
              onPress={() => handleDeletePost()}
              title="Delete post"
              buttonStyle={{ backgroundColor: "#fc5159", width: "90%" }}
            />
          ) : (
            <CustomButton
              onPress={() => handleDeleteStop()}
              title="Cancel my stop"
              buttonStyle={{ backgroundColor: "#fc5159", width: "90%" }}
            />
          )}
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <CustomButton onPress={() => setShowApply(true)} title="Apply" />
        </View>
      )}

      <Modal visible={showApply} animationType="slide">
        <StopCreation onClose={handleClose} trip={trip} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    //padding: 20,
    marginTop: 60,
    height: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor: 'purple',
    //height: 100,
  },
  tripDetails: {
    marginBottom: 20,
    width: "90%",
    //backgroundColor: 'green',
    height: "fit",
  },
  detailsContainer: {
    justifyContent: "space-between",
    width: "97%",
    //backgroundColor: 'gray',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    width: "fill",
  },
  applyButton: {
    backgroundColor: "#007bff",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  email: {
    fontSize: 16,
    fontFamily: "Poppins-Black",
    margin: 8,
  },
  textContainer: {
    //backgroundColor: 'pink',
    width: "fit",
    flexDirection: "column",
    justifyContent: "center",
  },
  timestamp: {
    fontSize: 22,
    fontFamily: "Poppins-Black",
    padding: 16,
  },
  address: {
    width: "93%",
    //backgroundColor:'pink'
  },
  addressInfo: {
    marginTop: 5,
    marginBottom: 5,
    //marginLeft: 5
    height: "fit",
    width: "90%",
    //backgroundColor: 'cyan',
    justifyContent: "flex-start",
  },
  arrowContainer: {
    //backgroundColor: 'cyan',
    width: "100%",
    //marginTop: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    //marginLeft: -20,
  },
  buttonContainer: {
    width: "90%",
    marginTop: -30,
    //backgroundColor: 'pink',
  },
});

export default ShowPost;
