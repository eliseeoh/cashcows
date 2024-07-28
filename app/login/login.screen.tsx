import React, { useState, useContext } from 'react';
import { Image, SafeAreaView, ScrollView, View, Alert, TextInput, Text, Pressable, ActivityIndicator} from 'react-native';
import { loginStyles } from './login.screenstyle';
import { AuthContext } from '../../authentication/authContext';
import loginImage from '../../assets/images/cashciws.png'

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('handleLogin called');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password); // Call signIn from AuthContext

    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert("Error", "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
        <SafeAreaView style={loginStyles.appContainer}>
            <View style={loginStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={loginStyles.loadingText}>Logging in...</Text>
            </View>
        </SafeAreaView>
    );
}
  return (
    <SafeAreaView style={loginStyles.appContainer}>
      <ScrollView contentContainerStyle={loginStyles.scrollV}>
        <View style={loginStyles.viewReg}>
          <Image 
            source={loginImage} 
            style={loginStyles.image} 
          />
          <View style={loginStyles.inputCont}>
            <Text style={loginStyles.title}>Log in</Text>
            <TextInput 
              placeholder="Email"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={setEmail}
              style={loginStyles.textInput}
            />
            <TextInput 
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
              onChangeText={setPassword}
              style={[loginStyles.textInput, loginStyles.passwordInput]}
            />
            <Pressable onPress={handleLogin} style={loginStyles.button}>
              <Text style={loginStyles.buttonText}>Sign In</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Register")} style={loginStyles.registerButton}>
              <Text style={loginStyles.registerButtonText}>Register now!</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};