import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChooseDate = ({ setSelectedDate }) => {
  const [date, setDate] = useState(new Date());

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (selectedTime) {
      const updatedDateTime = new Date(date);
      updatedDateTime.setHours(selectedTime.getHours());
      updatedDateTime.setMinutes(selectedTime.getMinutes());
      setDate(updatedDateTime);
      setSelectedDate(updatedDateTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date</Text>
      <DateTimePicker
        testID="datePicker"
        value={date}
        mode="date"
        display="default"
        onChange={onChangeDate}
        style={styles.datePicker}
      />

      <Text style={styles.label}>Select Time</Text>
      <DateTimePicker
        testID="timePicker"
        value={date}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onChangeTime}
        style={styles.datePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
  },
});

export default ChooseDate;