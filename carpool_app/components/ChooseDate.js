import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, ScrollView, View, Button} from 'react-native';


const ChooseDate = ({setSelectedDate}) => {
  const [date, setDate] = useState(new Date());

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (selectedTime) {
      const updatedDateTime = new Date(date.setHours(selectedTime.getHours(), selectedTime.getMinutes()));
      setDate(updatedDateTime);
      setSelectedDate(updatedDateTime); 
    }
  };

  return (
    <View>
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
        <DateTimePicker
          testID="timePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />

    </View>
  );
};

export default ChooseDate;