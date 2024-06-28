import React, { useState, useContext } from 'react';
import { auth } from '../../config/firebaseConfig';
import { ImageBackground, SafeAreaView, ScrollView, View, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { loginStyles } from './login.screenstyle';
import { AuthContext } from '../../authentication/authContext';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      signIn(); // Call your signIn function from AuthContext if needed
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
