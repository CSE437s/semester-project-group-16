import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet} from 'react-native';

const Post = ({data}) => {
  return (
    <View style={styles.container}>
      <Text>This will be a post!</Text>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        width: '80%',
        borderColor: 'black',
        height: 160,
        borderWidth: 1,
        borderRadius: 5,
        padding:5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',

    }
});
export default Post;