import React, { useState, useContext, useEffect } from 'react';
import { Text, Button, SafeAreaView, ScrollView, View, Alert, TextInput, Modal, Pressable, TouchableOpacity } from "react-native";
import { AuthContext } from '../../authentication/authContext'; 
import { firestore } from '../../config/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, setDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { friendStyle } from './settings.screenstyle';

export const Friends = () => {
    const { state } = useContext(AuthContext); 
    const { user } = state;
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);;
    const [inputText, setInputText] = useState('');
    const [groupName, setGroupName] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    useEffect(() => {
        // Fetch user's groups from Firestore
        const fetchGroups = async () => {
            try {
                const q = query(collection(firestore, 'groups'), where('members', 'array-contains', user.uid));
                const groupsSnapshot = await getDocs(q);
                
                const fetchedGroups = groupsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setGroups(fetchedGroups);
            } catch (error) {
                console.error('Error fetching user groups:', error);
                Alert.alert('Error', 'Failed to fetch groups. Please try again later.');
            }
        };

        if (user) {
            fetchGroups();
        }
    }, [user]); // Fetch groups whenever user context changes

    const joinGroup = async (groupId: string) => {
        if (!inputText) {
            Alert.alert('Error', 'Please enter a group ID.');
            return;
        }

        try {
            const groupRef = doc(firestore, 'groups', inputText);
            await updateDoc(groupRef, {
                members: FieldValue.arrayUnion(user.uid)
            });

            Alert.alert('Success', 'You have joined the group successfully.');
            setInputText('');
            setModalVisible(false);
            // Optionally, update state to reflect the new group membership without re-fetching
        } catch (error) {
            console.error('Error joining group:', error);
            Alert.alert('Error', 'Failed to join the group. Please try again later.');
        }
    };

    const createGroup = async () => {
        if (!groupName) {
            Alert.alert('Error', 'Please enter a group name.');
            return;
        }

        try {
            const groupRef = doc(collection(firestore, 'groups'));
            await setDoc(groupRef, {
                name: groupName,
                members: [user.uid],
                createdAt: serverTimestamp(),
            });

            const newGroup = {
                id: groupRef.id,
                name: groupName,
                members: [user.uid],
                createdAt: new Date(), // Use local timestamp or serverTimestamp() if preferred
            };
    
            // Update local state to include the newly created group
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

    return (
        <SafeAreaView style={friendStyle.container}>
            <ScrollView>
            <Text>Your Groups:</Text>
                {groups.map(group => (
                    <TouchableOpacity key={group.id} onPress={() => handleGroupPress(group.id)}>
                        <View style={friendStyle.groupContainer}>
                            <Text style={friendStyle.groupText}>{group.name}</Text>
                            <Text style={friendStyle.groupText}>{group.id}</Text>
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
                            <Button
                                title="Join"
                                onPress={joinGroup}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setModalVisible(false)
                                    setInputText('')
                                    }
                                }
                                color="red"
                            />    
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
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                                onChangeText={setGroupName}
                                value={groupName}
                                placeholder="Group Name"
                            />
                            <Button
                                title="Create"
                                onPress={createGroup}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => setCreateModalVisible(false)}
                                color="red"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};
