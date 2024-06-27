import React, {useContext} from 'react';
import { Text, Image, Button, SafeAreaView, ScrollView, View, Alert} from "react-native";
import { AuthContext } from '../../authentication/authContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { settStyle } from './settings.screenstyle';

const profile = {
    username: "Elise",
    img: require("../../assets/images/react-logo.png")
}

export const Settings = ({navigation}) => {
    const{signOut} = useContext(AuthContext);

    const handleLogout = () => {
        signOut();
    }
    
    return (
        <ScrollView contentContainerStyle={settStyle.view}>
            <Image source ={profile.img} style={settStyle.image}/>
            <Text style={settStyle.text}>{profile.username}</Text>
            <Button title="Edit Profile" onPress={() => navigation.navigate("Edit Profile")}/>
            <Button title="Log Out" onPress={handleLogout} />
        </ScrollView>
    )
}