import React, { useState, useEffect } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { Divider } from "@rneui/themed";

const LoadingHomeScreen = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolate the animated value into a color range
  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#EEEEEE", "#DEDEDE"],
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: interpolatedColor }]}
    >
      <Animated.View
        style={[styles.topView, { backgroundColor: interpolatedColor }]}
      >
        <View style={styles.nextTripView}></View>
        <View style={styles.dateTextView}></View>
        <Divider color={"black"} width={1} style={styles.divider} />
        <View style={styles.rideInfoView}></View>
      </Animated.View>
      <Animated.View
        style={[styles.pulsatingView, { backgroundColor: interpolatedColor }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 80,
    gap: 10,
  },
  divider: {
    alignSelf: "left",
    marginLeft: "5%",
    borderRadius: 5,
    margin: 10,
    width: "80%",
  },
  nextTripView: {
    marginLeft: "5%",
    paddingTop: 10,
    backgroundColor: "#BFBFBF",
    width: "30%",
    height: 20,
    borderRadius: 10,
  },
  dateTextView: {
    marginLeft: "5%",
    backgroundColor: "#959595",
    width: "70%",
    height: 20,
    borderRadius: 10,
  },
  rideInfoView: {
    marginLeft: "5%",
    backgroundColor: "#959595",
    width: "90%",
    height: 20,
    borderRadius: 10,
  },
  pulsatingView: {
    paddingTop: 20,
    width: "100%",
    height: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "light-gray",
    borderBottomColor: "light-gray",
  },
  topView: {
    width: "100%",
    height: 96,
    display: "flex",
    alignItems: "left",
    justifyContent: "center",
    gap: 8,
    padding: 10,
  },
});

export default LoadingHomeScreen;
