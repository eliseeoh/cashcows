import React, { useState, useContext } from 'react';
import { View, Alert, Image, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { settStyle } from './settings.screenstyle';
import * as ImagePicker from 'react-native-image-picker';

export const Edit = ({ navigation }) => {
  const { state, uploadProfilePicture, updateUserProfile } = useContext(AuthContext);
  const [photoURL, setPhotoURL] = useState(state.user.photoURL);
  const [image, setImage] = useState(null);

  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const handleSave = async () => {
    try {
      if (image) {
        const photoURL = await uploadProfilePicture(state.userId, image.uri);
        setPhotoURL(photoURL);
        await updateUserProfile(state.userId, { photoURL });
      }

      Alert.alert("Success", "Profile updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  return (
    <View style={settStyle.view}>
      <Image source={image || { uri: photoURL }} style={settStyle.image} />
      <Button title="Choose Profile Picture" onPress={handleChoosePhoto} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};
