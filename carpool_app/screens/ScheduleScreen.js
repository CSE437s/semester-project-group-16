import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getUserRides } from "../Utils"; // Ensure this is correctly imported
import ManageCarpool from "../components/ManageCarpool";

const ScheduleScreen = () => {
  const [scheduledRides, setScheduledRides] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchRides = async () => {
        try {
          const rides = await getUserRides(false); // Assuming false fetches the correct data
          setScheduledRides(rides);
        } catch (error) {
          console.error("Failed to fetch scheduled rides:", error);
        }
      };

      fetchRides();
    }, [])
  );

  return (
    <ManageCarpool
      userRides={scheduledRides}
      setUserRides={setScheduledRides}
    />
  );
};

export default ScheduleScreen;
