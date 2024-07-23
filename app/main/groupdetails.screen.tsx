import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, Button, TouchableOpacity} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { groupStyle } from './settings.screenstyle';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';

export const GroupDetails = ({ route, navigation }) => {
    const { groupId } = route.params;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);

    const fetchMemberDetails = async (memberIds) => {
        try {
            const memberDetails = await Promise.all(
                memberIds.map(async (id) => {
                    const userDoc = await getDoc(doc(db, 'users', id));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        return { id, name: userData.username || 'Unknown User', totalExpense: userData.totalExpense || 0 };
                    } else {
                        return { id, name: 'Unknown User', totalExpense: 0 };
                    }
                })
            );
            return memberDetails;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return memberIds.map(id => ({ id, name: 'Unknown User', totalExpense: 0 }));
        }
    };

    const fetchGroupDetails = async () => {
        try {
            const groupDoc = await getDoc(doc(db, 'groups', groupId));
            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                setGroup(groupData);

                const memberDetails = await fetchMemberDetails(groupData.members);
                setMembers(memberDetails);
            } else {
                Alert.alert('Error', 'Group not found.');
            }
        } catch (error) {
            console.error('Error fetching group details:', error);
            Alert.alert('Error', 'Failed to fetch group details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchGroupDetails();
        }, [groupId])
    );

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied to Clipboard!');
      };

    const getWinner = async () => {
        try {
            const winner = members.reduce((prev, curr) => (prev.totalExpense < curr.totalExpense ? prev : curr), members[0]);
            Alert.alert('Winner', `${winner.name} with the lowest total expense of $${winner.totalExpense.toFixed(2)}`);
        } catch (error) {
            console.error('Error determining the winner:', error);
            Alert.alert('Error', 'Failed to determine the winner. Please try again later.');
        }
    }
    if (loading) {
        return (
            <SafeAreaView style={groupStyle.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!group) {
        return (
            <SafeAreaView style={groupStyle.container}>
                <Text>No group details available.</Text>
            </SafeAreaView>
        );
    }

    
    return (
        <SafeAreaView style={groupStyle.container}>
            <ScrollView>
                <Text style={groupStyle.title}>{group.name}</Text>
                <View>
                    <Text style={groupStyle.subtitle}>Group ID: {groupId}</Text>
                    <TouchableOpacity onPress={()=> copyToClipboard(groupId)}>
                            <MaterialCommunityIcons name="content-copy" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={groupStyle.subtitle}>Members:</Text>
                {members.map((member, index) => (
                    <View key={index} style={groupStyle.memberContainer}>
                        <Text style={groupStyle.memberText}>{member.name}</Text>
                    </View>
                ))}
                <Text style={groupStyle.subtitle}>Highest Scoring Bet:</Text>
                {group.topBet ? (
                    <Text style={groupStyle.betText}>{group.topBet.description} (Votes: {group.topBet.votes})</Text>
                ) : (
                    <Text style={groupStyle.betText}>No bets placed yet.</Text>
                )}
                <Button
                    title="Vote/Place bets"
                    onPress={() => navigation.navigate('Bets', { groupId })}
                />
                <Button 
                    title="Consolidate expenses"
                    onPress={() => getWinner()}/>
            </ScrollView>
        </SafeAreaView>
    );
};
