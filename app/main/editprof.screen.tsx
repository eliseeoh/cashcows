import React, {useState} from 'react';
import { Text, Button, SafeAreaView, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import ImagePicker from 'react-native-image-picker';
import { TextInput } from 'react-native-paper';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

export const Edit = () => {
	const [image, setImage] = useState(null); 
	const [username, setUsername] = useState(''); 

	const handleChooseImage = () => {
		const options = {
		title: 'Select Profile Picture',
		storageOptions: {
			skipBackup: true,
			path: 'images',
		},
		};

		ImagePicker.launchImageLibrary(options, response => {
			if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = { uri: response.uri };
                setImage(source);
                // Handle uploading the image to Firebase Storage or your backend
            }
		});
	};

	const handleSave = async () => {
		// Ensure username and image are selected
		if (!image) {
		  Alert.alert('Error', 'Username and Profile Picture are required.');
		  return;
		}
		try {
			// Upload image to Firebase Storage (example implementation)
			const imageUrl = await uploadImageToFirebase(image.uri);
	  
			// Update user profile with username and image URL (example implementation)
			const user = auth.currentUser;

			await updateProfile(user, {
				photoURL: imageUrl,
			});
	  
			// Optionally, navigate to profile screen or display success message
			Alert.alert('Success', 'Profile updated successfully.');
		  } catch (error) {
			Alert.alert('Error', `Failed to update profile: ${error.message}`);
		  }
	}

	return (
		<View>
			<Button title="Choose Profile Picture" onPress={handleChooseImage} />
			{image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
			<Button title="Save" onPress={handleSave} />
		</View>
    );
}