import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, SafeAreaView, Alert } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { betStyle } from './settings.screenstyle';

interface Bet {
  id: string;
  description: string;
  votes: number;
}

export const BetScreen = ({ route }) => {
  const { groupId } = route.params;
  const [bets, setBets] = useState<Bet[]>([]);
  const [newBet, setNewBet] = useState('');

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const q = query(collection(db, 'bets'), where('groupId', '==', groupId));
        const querySnapshot = await getDocs(q);
        const fetchedBets = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          votes: doc.data().votes || 0 
        } as Bet));
        setBets(fetchedBets);
      } catch (error) {
        console.error('Error fetching bets:', error);
        Alert.alert('Error', 'Failed to fetch bets. Please try again later.');
      }
    };

    fetchBets();
  }, [groupId]);

  const addBet = async () => {
    if (!newBet.trim()) {
      Alert.alert('Error', 'Please enter a bet description.');
      return;
    }

    try {
      const betDoc = await addDoc(collection(db, 'bets'), {
        groupId,
        description: newBet,
        createdAt: new Date(),
        votes: 0
      });
      setBets([...bets, { id: betDoc.id, description: newBet, votes: 0 }]);
      setNewBet('');
    } catch (error) {
      console.error('Error adding bet:', error);
      Alert.alert('Error', 'Failed to add bet. Please try again later.');
    }
  };

  const voteForBet = async (betId: string) => {
    console.log('Vote button pressed for bet:', betId);
    try {
      const betRef = doc(db, 'bets', betId);
      await updateDoc(betRef, {
        votes: increment(1) // Increment votes by 1
      });
      console.log('Vote updated in Firestore for bet:', betId); // Log successful update

      // Update local state to reflect the new number of votes
      setBets(prevBets => {
        return prevBets.map(bet => {
          if (bet.id === betId) {
            return {
              ...bet,
              votes: bet.votes + 1 // Update local state with incremented votes
            };
          }
          return bet;
        });
      });
    } catch (error) {
      console.error('Error voting for bet:', error);
      Alert.alert('Error', 'Failed to vote for the bet. Please try again later.');
    }
  };

  const placeBets = async () => {
    try {
      // Get the highest scoring bet
      const highestBet = bets.reduce((max, bet) => (bet.votes > max.votes ? bet : max), bets[0]);

      // Save the highest scoring bet to the group document
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, { 
        topBet: highestBet 
      });

      // Reset all bets to 0 using a batch update
      const batch = writeBatch(db);
      bets.forEach(bet => {
        const betRef = doc(db, 'bets', bet.id);
        batch.delete(betRef);
      });
      await batch.commit();

      // Update local state to reset votes
      setBets([]);

      Alert.alert('Success', 'Bets have been placed and votes reset.');
    } catch (error) {
      console.error('Error placing bets:', error);
      Alert.alert('Error', 'Failed to place bets. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={betStyle.container}>
      <FlatList
        data={bets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={betStyle.betContainer}>
            <Text style={betStyle.betText}>{item.description}</Text>
            <Text style={betStyle.voteText}>Votes: {item.votes}</Text>
            <Button title="Vote" onPress={() => voteForBet(item.id)} />
          </View>
        )}
      />
      <TextInput
        style={betStyle.input}
        value={newBet}
        onChangeText={setNewBet}
        placeholder="Suggest a new bet"
      />
      <Button title="Add Bet" onPress={addBet} />
      <Button title="Place Bets" onPress={placeBets} />
    </SafeAreaView>
  );
};

