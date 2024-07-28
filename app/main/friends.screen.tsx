import React, { useState, useContext, useEffect } from 'react';
import { Text, Button, SafeAreaView, ScrollView, View, Alert, TextInput, Modal, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { AuthContext } from '../../authentication/authContext'; 
import { db } from '../../config/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { friendStyle, groupStyle } from './settings.screenstyle';

export const Friends = ({ navigation }) => {
    const { state } = useContext(AuthContext); 
    const { user } = state;
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [groupName, setGroupName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        try {
            const q = query(collection(db, 'groups'), where('members', 'array-contains', user.uid));
            const groupsSnapshot = await getDocs(q);
            
            const fetchedGroups = groupsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    ...data,
                };
            });

            setGroups(fetchedGroups);
        } catch (error) {
            console.error('Error fetching user groups:', error);
            Alert.alert('Error', 'Failed to fetch groups. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (user) {
            fetchGroups();
        }
    }, [user]);

    if (loading) {
        return (
            <SafeAreaView style={friendStyle.container}>
                <View style={groupStyle.loadingContainer}>
                    <ActivityIndicator size="large" color="#000000" />
                    <Text style={groupStyle.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const joinGroup = async () => {
        if (!user) {
            Alert.alert('Error', 'User is not logged in.');
            return;
        }

        if (!inputText) {
            Alert.alert('Error', 'Please enter a group ID.');
            return;
        }

        try {
            const groupRef = doc(db, 'groups', inputText);
            const groupDoc = await getDoc(groupRef);

            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                if (groupData.members.includes(user.uid)) {
                    Alert.alert('Info', 'You are already a member of this group.');
                    return;
                }
            }

            await updateDoc(groupRef, {
                members: arrayUnion(user.uid)
            });

            fetchGroups();

            Alert.alert('Success', 'You have joined the group successfully.');
            setInputText('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error joining group:', error);
            Alert.alert('Error', 'Failed to join the group. Please try again later.');
        }
    };

    const createGroup = async () => {
        if (!user) {
            Alert.alert('Error', 'User is not logged in.');
            return;
        }

        if (!groupName) {
            Alert.alert('Error', 'Please enter a group name.');
            return;
        }

        try {
            const groupRef = doc(collection(db, 'groups'));
            await setDoc(groupRef, {
                name: groupName,
                members: [user.uid],
                createdAt: serverTimestamp(),
            });

            const newGroup = {
                id: groupRef.id,
                name: groupName,
                members: [user.uid],
                createdAt: new Date(),
            };
        
            setGroups(prevGroups => [...prevGroups, newGroup]);
            Alert.alert('Success', `Group "${groupName}" created with ID: ${groupRef.id}`);
            setGroupName('');
            setCreateModalVisible(false);
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Error', 'Failed to create the group. Please try again later.');
        }
    };

    const handleJoinButtonPress = () => {
        setModalVisible(true);
    };

    const handleGroupPress = (groupId) => {
        console.log('Navigating to group details for group:', groupId);
        navigation.navigate('GroupDetails', { groupId });
    };

    return (
        <SafeAreaView style={friendStyle.container}>
            <ScrollView>
                <Text>Your Groups:</Text>
                {groups.map(group => (
                    <TouchableOpacity key={group.id} onPress={() => handleGroupPress(group.id)}>
                        <View style={friendStyle.groupContainer}>
                            <Text style={friendStyle.groupText}>{group.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                <Pressable style={friendStyle.button} onPress={handleJoinButtonPress}>
                    <Text style={friendStyle.buttonText}>Join Group</Text>
                </Pressable>
                <Pressable style={friendStyle.button} onPress={() => setCreateModalVisible(true)}>
                    <Text style={friendStyle.buttonText}>Create Group</Text>
                </Pressable>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={friendStyle.modalContainer}>
                        <View style={friendStyle.modalContent}>
                            <Text>Enter Group ID:</Text>
                            <TextInput
                                style={friendStyle.input}
                                onChangeText={setInputText}
                                value={inputText}
                                placeholder="Group ID"
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Pressable style={friendStyle.cancelButton} onPress={joinGroup}>
                                    <Text style={friendStyle.cancelText}>Join</Text>
                                </Pressable>
                                <Pressable style= {friendStyle.cancelButton} onPress={() => { 
                                        setModalVisible(false)
                                        setInputText('')
                                    }}>
                                    <Text style={friendStyle.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={createModalVisible}
                    onRequestClose={() => setCreateModalVisible(false)}
                >
                    <View style={friendStyle.modalContainer}>
                        <View style={friendStyle.modalContent}>
                            <Text>Enter Group Name:</Text>
                            <TextInput
                                style={friendStyle.input}
                                onChangeText={setGroupName}
                                value={groupName}
                                placeholder="Group Name"
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Pressable style={friendStyle.cancelButton} onPress={createGroup}>
                                    <Text style={friendStyle.cancelText}>Create</Text>
                                </Pressable>
                                <Pressable style= {friendStyle.cancelButton} onPress={() => { 
                                        setCreateModalVisible(false)
                                        setInputText('')
                                    }}>
                                    <Text style={friendStyle.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

