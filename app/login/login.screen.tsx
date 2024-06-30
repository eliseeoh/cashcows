import React, { useState, useContext } from 'react';
import { auth } from '../../config/firebaseConfig';
import { ImageBackground, SafeAreaView, ScrollView, View, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';
import { AuthContext } from '../../authentication/authContext';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      await signIn(email, password); // Call signIn from AuthContext
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert("Error", "Failed to sign in. Please try again.");
    }
  };

  return (
    <SafeAreaView style={loginStyles.appContainer}>
      <ImageBackground style={loginStyles.image} source={require('../../assets/images/login/background.png')}>
        <ScrollView contentContainerStyle={loginStyles.scrollV}>
          <View style={loginStyles.viewReg}>
            <Card>
              <Card.Title title="Log in" titleStyle={loginStyles.centerT} />
              <Card.Content>
                <TextInput 
                  label="Email"
                  autoCapitalize="none"
                  onChangeText={setEmail}
                />
                <TextInput 
                  label="Password"
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={setPassword}
                />
                <Button uppercase={false}>Forgot password?</Button>
                <Button mode="contained" onPress={handleLogin}>Sign in</Button>
                <Button onPress={() => navigation.navigate("Register")}>Register now!</Button>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
