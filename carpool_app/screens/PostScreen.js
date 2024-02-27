import React from 'react';
import { View, Text, Button, Modal } from 'react-native';
import Post from '../components/Post';
import PostCreation from '../components/PostCreation';
import {useState, useEffect} from 'react';
import { StyleSheet} from 'react-native';
import axios from 'axios';
import { BASE_URL} from '@env';


const PostScreen = () => {

  const [showPostCreation, setShowPostCreation] = useState(false);

  const fetchData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/postsTest`); // adjust with actual url on live
        console.log(response.data); 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  const openPostCreation = () => {
    setShowPostCreation(true);
  };

  const closePostCreation = () => {
    setShowPostCreation(false);
  };

  return (
    <View style={styles.container}>

      <Button title="Fetch Data" onPress={fetchData} />

      <View>
        <Button title="Create Post" onPress={openPostCreation} />
        <Modal visible={showPostCreation} animationType="slide">
          <PostCreation onClose={closePostCreation} />
        </Modal>

      </View>

    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent: 'center',
  },
  postContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
  }
});

export default PostScreen;

//   useEffect(() => {
//     setPosts(Array.from({length:15 })); //Todo fetch from db instead!
//   }, []);

//   return (
//     <View>
//       <Text>This is the posts screen!</Text>
//       <View>
//         {posts.map((_, index) => (
//           <Post key={index} />
//         ))}
//       </View>
//     </View>
//   );
// };