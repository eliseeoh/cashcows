import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, Pressable, TouchableOpacity, ActivityIndicator} from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { groupStyle, friendStyle } from './settings.screenstyle';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';

export const GroupDetails = ({ route }) => {
    const { groupId } = route.params;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [canAnnounceWinner, setCanAnnounceWinner] = useState(true);
    const navigation = useNavigation();

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

    const fetchGroupDetails = useCallback(async () => {
        try {
            const groupDoc = await getDoc(doc(db, 'groups', groupId));
            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                setGroup(groupData);

                const memberDetails = await fetchMemberDetails(groupData.members);
                setMembers(memberDetails);

                const currentDate = new Date();
                const lastAnnouncement = groupData.lastAnnouncement ? groupData.lastAnnouncement.toDate() : null;
                if (lastAnnouncement) {
                    const lastMonth = lastAnnouncement.getMonth();
                    const lastYear = lastAnnouncement.getFullYear();
                    if (currentDate.getMonth() === lastMonth && currentDate.getFullYear() === lastYear) {
                        setCanAnnounceWinner(false);
                    } else {
                        setCanAnnounceWinner(true);
                    }
                } else {
                    setCanAnnounceWinner(true);
                }
            } else {
                Alert.alert('Error', 'Group not found.');
            }
        } catch (error) {
            console.error('Error fetching group details:', error);
            Alert.alert('Error', 'Failed to fetch group details. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useFocusEffect(
        useCallback(() => {
            fetchGroupDetails();
        }, [fetchGroupDetails])
    );

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied to Clipboard!');
      };

    const getWinner = async () => {
        try {
            const winner = members.reduce((prev, curr) => (prev.totalExpense < curr.totalExpense ? prev : curr), members[0]);
            const groupRef = doc(db, 'groups', groupId);
            const groupDoc = await getDoc(groupRef);
            const bet = groupDoc.data().topBet.description;

            // Get the current month and year
            const currentDate = new Date();
            const month = currentDate.toLocaleString('default', { month: 'long' });
            const year = currentDate.getFullYear();
            await updateDoc(groupRef, {
                winners: arrayUnion({
                    name: winner.name,
                    id: winner.id,
                    totalExpense: winner.totalExpense,
                    month,
                    year,
                    bet: bet
                }),
                lastAnnouncement: currentDate,
            });

            Alert.alert('Winner', `${winner.name} with the lowest total expense of $${winner.totalExpense.toFixed(2)}`);
            fetchGroupDetails();
        } catch (error) {
            console.error('Error determining the winner:', error);
            Alert.alert('Error', 'Failed to determine the winner. Please try again later.');
        }
    }
    if (loading) {
        return (
            <SafeAreaView style={groupStyle.container}>
                <View style={groupStyle.loadingContainer}>
                    <ActivityIndicator size="large" color="#000000" />
                    <Text style={groupStyle.loadingText}>Loading...</Text>
                </View>
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
                <View style={groupStyle.groupId}>
                    <Text style={groupStyle.subtitle}>Group ID: {groupId}</Text>
                    <TouchableOpacity onPress={()=> copyToClipboard(groupId)}>
                            <MaterialCommunityIcons name="content-copy" size={22} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={groupStyle.subtitle}>Members:</Text>
                {members.map((member, index) => (
                    <View key={index} style={groupStyle.memberContainer}>
                        <Text style={groupStyle.memberText}>{member.name}</Text>
                    </View>
                ))}
                <Text style={groupStyle.subtitle}>Highest Bet:</Text>
                {group.topBet ? (
                    <View style={groupStyle.betCont}>
                        <Text style={groupStyle.betText}>{group.topBet.description}</Text>
                        <Text style={groupStyle.betText}>Votes: {group.topBet.votes}</Text>
                    </View>
                ) : (
                    <Text style={groupStyle.betText}>No bets placed yet.</Text>
                )}
                <View style={groupStyle.buttonContainer}>
                    <Pressable style={friendStyle.button} onPress={() => navigation.navigate('Bets', { groupId, fetchGroupDetails })}>
                        <Text style={friendStyle.buttonText}>Vote/Place bets</Text>
                    </Pressable>
                    <Pressable style={[friendStyle.button, !canAnnounceWinner && { backgroundColor: 'grey' }]} 
                            onPress={canAnnounceWinner ? getWinner : null}>
                        <Text style={friendStyle.buttonText}>Announce Current Month's Winner</Text>
                    </Pressable>
                    <Pressable style={friendStyle.button} onPress={() => navigation.navigate('WinnerLog', {groupId})}>
                        <Text style={friendStyle.buttonText}>Winner History</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
