import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BackArrow from "./BackArrow";
import { getUserWithUserId, timestampToDate } from "../Utils";
import Icon from "react-native-vector-icons/Ionicons";
import UploadPFP from "./UploadPFP";
import { REACT_APP_LOCAL_SERVER, REACT_APP_REMOTE_SERVER } from "@env";

const ViewProfile = ({ userId, onClose }) => {
  const [userDict, setUserDict] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserWithUserId(userId);
        console.log(JSON.stringify(response));
        setUserDict(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.backArrow}>
        <BackArrow onClose={onClose} />
      </View>

      <Text style={styles.userInfoTitle}>{userDict.full_name}'s Profile</Text>
      {userDict.pfpPath ? (
        <Image
          source={{ uri: REACT_APP_REMOTE_SERVER + userDict.pfpPath }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={{
            uri: "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
          }}
          style={styles.profileImage}
        />
      )}
      <Text style={styles.title}>Email</Text>
      <Text style={styles.data}>{userDict.email}</Text>

      <Text style={styles.title}>Student ID</Text>
      <Text style={styles.data}>{userDict.student_id}</Text>

      <Text style={styles.title}>Date of Birth</Text>
      <Text style={styles.data}>{timestampToDate(userDict.dob)}</Text>

      <Text style={styles.title}>Phone Number</Text>
      <Text style={styles.data}>{userDict.phone_number}</Text>

      <Text style={styles.title}>Home Address</Text>
      <Text style={styles.data}>{userDict.home_address}</Text>
      <Text style={styles.title}>License Plate</Text>
      <Text style={styles.data}>{userDict.license_plate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    padding: 20,
  },
  backArrow: {
    alignSelf: "left",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  data: {
    fontSize: 15,
    marginBottom: 5,
    color: "#666", // Data color
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 10,
  },
});

export default ViewProfile;
