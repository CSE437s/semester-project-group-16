import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { REACT_APP_LOCAL_SERVER, REACT_APP_REMOTE_SERVER } from "@env";
import { checkUserExists, getUserWithUserId } from "../Utils";


const UploadPFP = () => {
    const defSrc = 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
    let [image, setImage] = useState(defSrc);

    useEffect(() => {
        async function getUserInfo() {
            const user = checkUserExists();
            const userObj = await getUserWithUserId(user.uid);

            if(userObj.pfpPath != null){
                let tempPath = `${REACT_APP_REMOTE_SERVER}${userObj.pfpPath}`;
                setImage(tempPath || defSrc);
            }
        }
        getUserInfo();
        console.log(image);
    }, []);

    const addImage = async () => {
        //console.log(REACT_APP_REMOTE_SERVER);
        console.log(REACT_APP_REMOTE_SERVER);
        let imgObject = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!imgObject.canceled) {
            try {
                console.log(imgObject);
                const base64Image = await convertImageToBase64(imgObject.assets[0].uri);
                const response = await uploadPFPImage(base64Image);

                // let tempPath = `${REACT_APP_REMOTE_SERVER}${response.imageUrl}`;
                // setImage(tempPath || "");

                setImage(imgObject.assets[0].uri);

            } catch (error) {
                console.error('Error executing upload image function:', error);
            }
        }
    };

    async function uploadPFPImage(image) {
        const user = checkUserExists();
        const idToken = await user.getIdToken(true);
        const apiUrl = `${REACT_APP_REMOTE_SERVER}/uploadPFPImage/`;
        //console.log("SENDING IMAGE TO: " + apiUrl);

        const userId = user.uid;
        const email = user.email;
        
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('email', email);
        formData.append('base64Img', image);

        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: idToken,
                    userid: userId,
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };


    const convertImageToBase64 = async (imageURI) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(imageURI, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };


    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                {/* {image && <Image source={imgSrc} style={{ width: 200, height: 200 }} />} */}
                <Image source={{ uri: image || defSrc}} style={{ width: 200, height: 200 }} />

                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={addImage} style={styles.icon} >
                        <AntDesign name="camera" size={40} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        //backgroundColor: 'pink',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    container: {
        elevation: 2,
        height: 200,
        width: 200,
        backgroundColor: '#efefef',
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
    },
    iconContainer: {
        opacity: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'gray',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    icon: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center',
        opacity: 0.8,
        height: '100%'

    },
})

export default UploadPFP;
