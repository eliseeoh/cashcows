import React, { useState, useContext } from 'react';
import { View, Alert, SafeAreaView, Image, ScrollView, Pressable, Text} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { AuthContext } from '../../authentication/authContext';
import { loginStyles } from './login.screenstyle';
import loginImage from '../../assets/images/cashciws.png'

export const RegisterScn = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      await signUp(email, password, username);
      Alert.alert("Success", "Registration successful. You can now log in.");
      navigation.navigate('Log in');
    } catch (error) {
      if (error.message === 'auth/username-already-in-use') {
        Alert.alert("Error", "This username is already in use.");
      } else if (error.code === 'auth/missing-password') {
        Alert.alert("Error", "Password is required.");
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "This email address is already in use.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "The email address is not valid.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Error", "The password is too weak.");
      } else {
        Alert.alert("Error", `Failed to register: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={loginStyles.regAC}>
      <ScrollView contentContainerStyle={loginStyles.scrollV}>
      <View style={loginStyles.viewReg}>
          <Image 
            source={loginImage} 
            style={loginStyles.image} 
          />
          <View style={loginStyles.inputCont}>
            <Text style={loginStyles.title}>Register!</Text>
            <TextInput 
              placeholder="Username"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={setUsername}
              style={loginStyles.regTI}
            />
            <TextInput 
              placeholder="Email"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
              onChangeText={setEmail}
              style={loginStyles.regTI}
            />
            <TextInput 
              placeholder="Password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={setPassword}
              style={[loginStyles.regTI, loginStyles.passwordInput]}
            />
            <Pressable onPress={handleRegister} style={loginStyles.button}>
              <Text style={loginStyles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

