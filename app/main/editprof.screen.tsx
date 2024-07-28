import React, { useState, useContext } from 'react';
import { View, Alert, Image, Text, ActivityIndicator, Pressable } from 'react-native';
import { AuthContext } from '../../authentication/authContext';
import { settStyle } from './settings.screenstyle';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebaseConfig';

export const Edit = ({ navigation }) => {
  const { state, updateProfilePicture } = useContext(AuthContext);
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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
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
        const manipResult = await ImageManipulator.manipulateAsync(
          image,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const storageRef = ref(storage, `profilePictures/${state.userId}`);
        const response = await fetch(manipResult.uri);
        const blob = await response.blob();
        const snapshot = await uploadBytes(storageRef, blob);
        updatedPhotoURL = await getDownloadURL(snapshot.ref);

        const userRef = doc(db, 'users', state.userId);
        await updateDoc(userRef, { photoURL: updatedPhotoURL });

        // Immediately update the local state
        setPhotoURL(updatedPhotoURL);
        updateProfilePicture(state.userId, updatedPhotoURL); // Update profile picture in context
        setImage(null); // Clear the image selection
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
    <View style={[settStyle.view]}>
      <Image source={{ uri: image || photoURL }} style={settStyle.image} />
      <Pressable style={settStyle.profButton} onPress={handleChoosePhoto}>
        <Text style={settStyle.buttonText}>Choose Picture</Text>
      </Pressable>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Pressable style={settStyle.profButton} onPress={handleSave}>
          <Text style={settStyle.buttonText}>Save</Text>
        </Pressable>
      )}
    </View>
  );
};
