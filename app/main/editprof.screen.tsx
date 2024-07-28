import React, { useState, useContext } from 'react';
import { View, Alert, Image, Button, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../authentication/authContext';
import { settStyle } from './settings.screenstyle';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebaseConfig';

export const Edit = ({ navigation }) => {
  const { state, updateProfilePicture } = useContext(AuthContext); // Add updateProfilePicture to context
  const [photoURL, setPhotoURL] = useState(state.user.photoURL);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChoosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        console.log('Image URI set:', result.assets[0].uri);
      } else {
        Alert.alert("Error", "No image selected or operation canceled.");
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      Alert.alert('Error', 'Failed to choose photo.');
    }
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      let updatedPhotoURL = photoURL;
      if (image) {
        console.log('Uploading image:', image);

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `profilePictures/${state.userId}`);
        const response = await fetch(image);
        const blob = await response.blob();
        const snapshot = await uploadBytes(storageRef, blob);
        updatedPhotoURL = await getDownloadURL(snapshot.ref);

        console.log('Updated photo URL:', updatedPhotoURL);

        // Update Firestore with the photo URL
        const userRef = doc(db, 'users', state.userId);
        await updateDoc(userRef, { photoURL: updatedPhotoURL });

        setPhotoURL(updatedPhotoURL);
        updateProfilePicture(state.userId, updatedPhotoURL); // Update profile picture in context
      }

      Alert.alert("Success", "Profile updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[settStyle.view, { backgroundColor: 'white' }]}>
      <Image source={{ uri: image || photoURL }} style={settStyle.image} />
      <Button title="Choose Profile Picture" onPress={handleChoosePhoto} />
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Save" onPress={handleSave} />
      )}
    </View>
  );
};
