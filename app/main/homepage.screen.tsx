import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Exp} from './expense.screen'
import {Settings} from './settings.screen'
import {Friends} from './friends.screen'
import {Analytics} from './analytics.screen'

const Tab = createBottomTabNavigator();

export const Homepage = () => {

    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Expenses') {
                            iconName = focused ? 'cash-multiple': 'cash';
                        } else if (route.name === 'Friends') {
                            iconName = focused ? 'account-group' : 'account-group-outline';
                        } else if (route.name === 'Analytics') {
                            iconName = focused ? 'chart-line' : 'chart-line-variant';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'account' : 'account-outline';
                        }

                    // You can return any component that you like here!
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
            })}
            >
                <Tab.Screen name="Expenses" component={Exp}/>
                <Tab.Screen name="Friends" component={Friends}/> 
                <Tab.Screen name="Analytics" component={Analytics}/>
                <Tab.Screen name="Profile" component={Settings}/>
            </Tab.Navigator>
    )
}