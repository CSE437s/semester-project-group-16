import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import MapComponent from "../components/MapComponent";
import ManageCarpool from "../components/ManageCarpool";
import {
  getUserRides,
  timestampToDate,
  timestampToWrittenDate,
  getUserWithUserId,
  checkUserExists,
  userHasSufficientInfo,
} from "../Utils";
import { FIREBASE_AUTH } from "../components/FirebaseConfig";
import { Divider } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";
import UserInfoForm from "../components/UserInfoForm";
import BackArrow from "../components/BackArrow";
import Inbox from "../components/Inbox";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingHomeScreen from "../components/LoadingHomeScreen";

const HomeScreen = () => {
  const [userRides, setUserRides] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [myCarpoolsVisible, setMyCarpoolsVisible] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [showUserInfoForm, setShowUserInfoForm] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setDataLoaded(false);
      const fetchData = async () => {
        try {
          const user = checkUserExists();
          const userFromDb = await getUserWithUserId(user.uid);
          setShowUserInfoForm(!userHasSufficientInfo(userFromDb));

          // Use let if you plan to reassign rides. Otherwise, directly chain the methods without reassignment.
          let rides = await getUserRides("false"); // Fetch rides, assuming this returns an array of TripClass instances

          // Directly filter and sort without reassigning to rides
          rides = rides
            .filter((trip) => !trip.isPast())
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          if (rides.length > 0) {
            setUserRides(rides);
          }
        } catch (error) {
          console.error(error);
        }
        setDataLoaded(true);
      };
      fetchData();
    }, [])
  );

  //TODO you can view an upcoming map from this, else remove
  const onDatePress = () => {
    console.log("Date is pressed!");
  };

  const toggleShowUserInfoForm = () => {
    setShowUserInfoForm(!showUserInfoForm);
  };

  const startRide = () => {
    let start = userRides[selectedIndex].route.originAddress;
    let destination = userRides[selectedIndex].route.destinationAddress;
    let stops = userRides[selectedIndex].stops;

    console.log('Stops:', stops);
    let stopCoords = [];
    stops.forEach(stop => {
        const latitude = stop.stopCoordinates.latitude;
        const longitude = stop.stopCoordinates.longitude;

        stopCoords.push({ lat: latitude, lng: longitude });
    
        console.log('Stop Coordinates:', latitude, longitude);
    });

    let url='';
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?saddr=${start}&daddr=${destination}`;

      stopCoords.forEach((stop, index) => {
        if (index === 0) {
            url += `&daddr=${stop.lat},${stop.lng}`;
        } else {
            url += `+to:${stop.lat},${stop.lng}`; 
        }
    });
      } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${destination}`;

      stopCoords.forEach(stop => {
        url += `&waypoints=${stop.lat},${stop.lng}`;
      });
  }
    console.log(url);
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const onInboxPress = () => {
    setShowInbox(true);
  };
  const onInboxClose = () => {
    setShowInbox(false);
  };
  const onManageCarpoolsPress = () => {
    setMyCarpoolsVisible(true);
  };
  const onManageCarpoolsClose = () => {
    setMyCarpoolsVisible(false);
  };

  function getSecondsFromRouteTime(routeTimeStr) {
    return parseInt(routeTimeStr.slice(0, -1), 10); //removes 's' from the routes API routeTime
  }

  function formatLeaveByTime(timestampStr, routeTimeStr) {
    const routeTimeInSeconds = getSecondsFromRouteTime(routeTimeStr);
    const routeTimeInMilliseconds = routeTimeInSeconds * 1000;
    const departureTimestamp = new Date(
      new Date(timestampStr).getTime() - routeTimeInMilliseconds
    );
    return departureTimestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // if(myCarpoolsVisible == true) {
  //   return (<ManageCarpool userRides={userRides} onClose={onManageCarpoolsClose}/>);
  // }

  // if (!dataLoaded) {
  //   // return <LoadingHomeScreen />;
  //   return null;
  // }

  if (showInbox) {
    return <Inbox onClose={onInboxClose} />;
  }

  if (!userRides) {
    <ActivityIndicator />;
  }

  if (showUserInfoForm) {
    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoFlexContainer}>
          <BackArrow onClose={toggleShowUserInfoForm} />
          <View style={styles.tripInfoTextContainer}>
            <Text
              style={styles.tripInfoText}
              width={"92%"}
              marginLeft={-25}
              marginTop={8}
            >
              Welcome to Ride Along! To use our services we need to know more
              about you.{" "}
            </Text>
          </View>
        </View>
        <UserInfoForm onClose={toggleShowUserInfoForm} bottomHeight={115}/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userRides.length - 1 >= selectedIndex ? (
        <>
          <View style={styles.homeHeader}>
            <View style={[{}, styles.tripInfo]}>
              <Text
                style={[
                  { fontSize: 14, color: "gray" },
                  styles.tripInfoText,
                  styles.tripInfoText2,
                ]}
              >
                Your Next Trip
              </Text>
              <TouchableOpacity onPress={onDatePress}>
                <Text
                  style={[
                    { fontSize: 18 },
                    styles.tripInfoText,
                    styles.tripInfoText2,
                  ]}
                >
                  {timestampToWrittenDate(userRides[selectedIndex].timestamp)}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onInboxPress}
              style={[{}, (style = styles.planeIcon)]}
            >
              <Icon name={"paper-plane-outline"} size={32} />
            </TouchableOpacity>
          </View>

          <Divider color={"black"} width={1} style={styles.divider} />

          <View style={styles.moreTripInfo}>
            <Icon name={"people-circle-outline"} size={22} />
            <Text>{userRides[selectedIndex].stops.length} Stops </Text>
            <Icon name={"time-outline"} size={22} />
            <Text>
              Driver Leaves By{" "}
              {formatLeaveByTime(
                userRides[selectedIndex].timestamp,
                userRides[selectedIndex].route.routeTime
              )}
            </Text>
          </View>

          <MapComponent ride={userRides[selectedIndex]} mapHeight={535} />
          <CustomButton title="Start Ride" onPress={startRide} buttonStyle={{borderRadius: 0, width: '100%', marginTop: 0}}></CustomButton>
          {/* <CustomButton onPress={onManageCarpoolsPress} title={"My Carpools"} iconName={"car-outline"}/> */}

          {/* <ManageCarpool userRides={userRides}/> */}
        </>
      ) : (
        <>
          <View style={styles.homeHeader}>
            <View
              style={[
                styles.tripInfoTextContainer,
                styles.tripInfoTextContainer2,
              ]}
            >
              <View style={[{}, styles.tripInfo]}>
                <Text style={[{ fontSize: 20 }, styles.tripInfoText3]}>
                  {" "}
                  You have no upcoming trips!{" "}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onInboxPress}
                style={[{}, (style = styles.planeIcon2)]}
              >
                <Icon name={"paper-plane-outline"} size={32} />
              </TouchableOpacity>
            </View>
          </View>
          <MapComponent />
          {/* <ManageCarpool userRides={userRides}/> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 80,
  },
  moreTripInfo: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginRight: "10%",
    gap: 10,
    marginBottom: 15,
    marginTop: 5,
    marginLeft: -18,
  },
  homeHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    //backgroundColor: 'blue',
  },
  userInfoContainer: {
    paddingTop: 80,
  },
  divider: {
    alignSelf: "left",
    marginLeft: "5%",
    borderRadius: 5,
    margin: 10,
    width: "80%",
  },
  tripInfo: {
    alignSelf: "left",
    //marginLeft:'5%',
    flexDirection: "column",
    //alignItems:'left',
    justifyContent: "flex-start",
    width: "80%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tripInfoText: {
    fontFamily: "Poppins-SemiBold",
    height: 50,
    width: "100%",
    marginLeft: -10,
  },
  tripInfoText2: {
    marginLeft: 0,
    marginBottom: -25,
  },
  tripInfoText3: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    height: "fit",
    width: "100%",
    marginLeft: 15,
    marginBottom: -10,
  },
  planeIcon: {
    //backgroundColor: 'red',
    justifyContent: "center",
    width: "auto",
  },
  planeIcon2: {
    //backgroundColor: 'aqua',
    justifyContent: "center",
    width: "auto",
    marginLeft: 20,
    marginBottom: 5,
  },
  tripInfoTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userInfoFlexContainer: {
    flexDirection: "row",
  },
  tripInfoTextContainer2: {
    //backgroundColor: 'pink',
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
});

export default HomeScreen;
