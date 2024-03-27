import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { timestampToDate } from "../Utils";
import Post from "./Post";
import { useFocusEffect } from "@react-navigation/native";

const ManageCarpool = ({ userRides, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      const markedDatesFromTrips = userRides.reduce((acc, trip) => {
        const dateKey = timestampToDate(trip.timestamp);
        const color = trip.isPast() ? "#d3d3d3" : "#022940";

        acc[dateKey] = {
          marked: true,
          selected: true,
          selectedColor: color,
        };
        return acc;
      }, {});

      setMarkedDates(markedDatesFromTrips);
    }, [userRides])
  );

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };
  const getRidesForSelectedDate = () => {
    return userRides.filter((ride) => {
      const rideDate = timestampToDate(ride.timestamp);
      return rideDate === selectedDate;
    });
  };
  const formattedSelectedDate = (selectedDate) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1); // Add one day to fix calendar one-off error
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.headerText}>My Carpools</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
          }}
          markedDates={markedDates}
          onDayPress={onDayPress}
        />
      </View>
      <Text style={styles.infoText}>
        {formattedSelectedDate(selectedDate)}{" "}
      </Text>
      <ScrollView>
        {getRidesForSelectedDate().length == 0 && (
          <Text style={styles.infoText2}>You have no trips on this date!</Text>
        )}
        {selectedDate &&
          getRidesForSelectedDate().map((ride, index) => (
            <Post key={index} trip={ride} fromManageCarpools={true} />
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: "center",
    fontFamily: "Poppins-Black",
    fontSize: 20,
  },
  topView: {
    marginTop: 50,
    marginBottom: 0,
  },
  infoText: {
    alignSelf: "center",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    marginTop: -5,
  },
  infoText2: {
    alignSelf: "center",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    marginTop: -5,
    color: "gray",
  },
  container: {
    marginTop: 0,
    paddingTop: 10,
    flex: 1,
    backgroundColor: "white",
  },
  calendarContainer: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 30,
  },
});
export default ManageCarpool;
