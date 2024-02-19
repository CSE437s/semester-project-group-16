import React from 'react';
import { View, Text } from 'react-native';
import Post from '../components/Post';
import {useState, useEffect} from 'react';
import { StyleSheet} from 'react-native';

const PostScreen = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setPosts(Array.from({length:15 })); //Todo fetch from db instead!
  }, []);

  return (
    <View>
      <Text>This is the posts screen!</Text>
      <View>
        {posts.map((_, index) => (
          <Post key={index} />
        ))}
      </View>
    </View>
  );
};

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