import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, Button } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { groupStyle } from './settings.screenstyle';

export const GroupDetails = ({ route, navigation }) => {
    const { groupId } = route.params;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const groupDoc = await getDoc(doc(db, 'groups', groupId));
                if (groupDoc.exists()) {
                    setGroup(groupDoc.data());
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

        fetchGroupDetails();
    }, [groupId]);

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
                <Text style={groupStyle.subtitle}>Group ID: {groupId}</Text>
                <Text style={groupStyle.subtitle}>Members:</Text>
                {group.members.map((member, index) => (
                    <View key={index} style={groupStyle.memberContainer}>
                        <Text style={groupStyle.memberText}>{member}</Text>
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
            </ScrollView>
        </SafeAreaView>
    );
};
