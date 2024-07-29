import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Alert, Image, ActivityIndicator, Pressable } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { winnerLog } from './settings.screenstyle';

export const WinnerLog = ({ route }) => {
    const { groupId } = route.params;
    const [winners, setWinners] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchingImages, setFetchingImages] = useState(false);

    useEffect(() => {
        const fetchWinners = async () => {
            setFetchingImages(true);
            try {
                const groupRef = doc(db, 'groups', groupId);
                const groupDoc = await getDoc(groupRef);

                if (groupDoc.exists()) {
                    const groupData = groupDoc.data();
                    const winnersList = groupData.winners || [];
                    setWinners(winnersList);
                } else {
                    Alert.alert('Error', 'Group not found.');
                }
            } catch (error) {
                console.error('Error fetching winners:', error);
                Alert.alert('Error', 'Failed to fetch winners. Please try again later.');
            } finally {
                setLoading(false); 
                setFetchingImages(false);
            }
        };

        fetchWinners();
    }, [groupId]);

    if (loading) {
        return (
            <View style={winnerLog.container}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={winnerLog.text}>Loading...</Text>
            </View>
        );
    }

    const uploadProof = async (winnerId) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setUploading(true);
                const uri = result.assets[0].uri;

                // Resize the image
                const resizedImage = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 800 } }], // Resize to width 800, height will be adjusted to maintain aspect ratio
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70% quality
                );

                const response = await fetch(resizedImage.uri);
                const blob = await response.blob();

                // Upload the image to Firebase Storage
                const storageRef = ref(storage, `proofs/${winnerId}`);
                const snapshot = await uploadBytes(storageRef, blob);
                const proofImageUrl = await getDownloadURL(snapshot.ref);

                // Update Firestore with the proof image URL
                const groupRef = doc(db, 'groups', groupId);
                const groupDoc = await getDoc(groupRef);
                const winnersList = groupDoc.data().winners;

                await updateDoc(groupRef, {
                    winners: winnersList.map(winner =>
                        winner.id === winnerId ? { ...winner, proofImageUrl } : winner
                    )
                });

                setWinners(winnersList.map(winner =>
                    winner.id === winnerId ? { ...winner, proofImageUrl } : winner
                ));
                Alert.alert('Success', 'Proof uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading proof:', error);
            Alert.alert('Error', 'Failed to upload proof. Please try again later.');
        } finally {
            setUploading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={winnerLog.bigContainer}>
            <View style={winnerLog.textContainer}>
                <View>
                    <Text style={winnerLog.itemText}>{item.month} {item.year}</Text>
                    <Text style={winnerLog.itemText}>{item.name}</Text>
                    <Text style={winnerLog.itemDescription}>Prize: {item.bet}</Text>
                </View>
                <Pressable style={winnerLog.button} onPress={() => uploadProof(item.id)} disabled={uploading}>
                    <Text style={winnerLog.buttonText}>{item.proofImageUrl ? 'Edit Photo' : 'Bet executed!'}</Text>
                </Pressable>
            </View>
            {item.proofImageUrl && (
                <Image source={{ uri: item.proofImageUrl }} style={winnerLog.image} resizeMode='contain' />
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {uploading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Uploading...</Text>
                </View>
            ) : fetchingImages ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Fetching Images...</Text>
                </View>
            ) : (
                <FlatList
                    data={winners}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={{ padding: 20, textAlign: 'center' }}>No winners found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};
