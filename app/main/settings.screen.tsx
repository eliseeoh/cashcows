import React, {useContext, useEffect, useState} from 'react';
import { auth } from '../../config/firebaseConfig';
import { Text, Image, Button, SafeAreaView, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { settStyle } from './settings.screenstyle';

export const Settings = ({navigation}) => {
    const{signOut} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log(currentUser.displayName);
            setUser({
                username: currentUser.displayName || "User",
                img: currentUser.photoURL || "https://example.com/default-avatar.png",
                email: currentUser.email,
            });
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        signOut();
    }
    
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
            <Image source ={{uri: user.img}} style={settStyle.image}/>
            <Text style={settStyle.text}>{user.username}</Text>
            <Button title="Edit Profile" onPress={() => navigation.navigate("Edit Profile")}/>
            <Button title="Log Out" onPress={handleLogout} />
        </ScrollView>
    )
}