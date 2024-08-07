import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, Button, ScrollView, View, Pressable } from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { settStyle, friendStyle } from './settings.screenstyle';

export const Settings = ({ navigation }) => {
  const { state, signOut } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.user) {
      setUser({
        username: state.user.username || "User",
        img: state.user.photoURL || "https://example.com/default-avatar.png",
        email: state.user.email,
      });
    }
    setLoading(false);
  }, [state.user]); // Ensure the component re-renders when state.user changes

  const handleLogout = () => {
    signOut();
  };

  if (loading) {
    return <Text>Loading...</Text>; // Show loading indicator while fetching user data
  }

  if (!user) {
    return (
      <View style={settStyle.view}>
        <Text>No user data available.</Text>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={settStyle.view}>
      <Image source={{ uri: user.img }} style={settStyle.image} />
      <Text style={settStyle.text}>{user.username}</Text>
      <View style={settStyle.buttView}>
        <Pressable style={settStyle.button} onPress={() => navigation.navigate("Edit Profile")}>
          <Text style={settStyle.buttonText}>Edit Profile</Text>
        </Pressable>
        <Pressable style={settStyle.button} onPress={handleLogout}>
          <Text style={settStyle.buttonText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
