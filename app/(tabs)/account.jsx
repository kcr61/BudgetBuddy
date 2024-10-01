import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, Pressable } from 'react-native';

const Account = () => {
  // Emergency Fund Tracker
  const [goal, setGoal] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [progress, setProgress] = useState(0);

  // Investment Tracker
  const [investmentName, setInvestmentName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investments, setInvestments] = useState([]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);

  const handleCalculateProgress = () => {
    const goalValue = parseFloat(goal);
    const currentSavingsValue = parseFloat(currentSavings);

    // Validate input values
    if (isNaN(goalValue) || isNaN(currentSavingsValue)) {
      console.error('Please enter valid numbers for goal and current savings.');
      return;
    }

    if (goalValue > 0) {
      const calculatedProgress = ((currentSavingsValue / goalValue) * 100).toFixed(2);
      setProgress(calculatedProgress);
    } else {
      console.error('Goal must be greater than zero.');
      setProgress(0);
    }
  };

  const handleAddInvestment = () => {
    const amount = parseFloat(investmentAmount);

    if (investmentName && !isNaN(amount)) {
      const newInvestment = { id: Date.now().toString(), name: investmentName, amount };
      setInvestments((prevInvestments) => [...prevInvestments, newInvestment]);
      setInvestmentName('');
      setInvestmentAmount('');
    } else {
      console.error('Please enter a valid investment name and amount.');
    }
  };

  const openDeleteModal = (id) => {
    setSelectedInvestmentId(id);
    setModalVisible(true);
  };

  const deleteInvestment = () => {
    const updatedInvestments = investments.filter((investment) => investment.id !== selectedInvestmentId);
    setInvestments(updatedInvestments);
    setModalVisible(false);
    setSelectedInvestmentId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Fund Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your goal amount"
        keyboardType="numeric"
        value={goal}
        onChangeText={setGoal}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter current savings"
        keyboardType="numeric"
        value={currentSavings}
        onChangeText={setCurrentSavings}
      />
      <Button title="Calculate Progress" onPress={handleCalculateProgress} />
      <Text style={styles.result}>
        Progress towards goal: {progress}%
      </Text>

      <Text style={styles.title}>Investment Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter investment name"
        value={investmentName}
        onChangeText={setInvestmentName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter investment amount"
        keyboardType="numeric"
        value={investmentAmount}
        onChangeText={setInvestmentAmount}
      />
      <Button title="Add Investment" onPress={handleAddInvestment} />

      <FlatList
        data={investments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.investmentItem}>
            <Text>{item.name}: ${item.amount.toFixed(2)}</Text>
            <Button
              title="Delete"
              onPress={() => openDeleteModal(item.id)}
              color="red" 
            />
          </View>
        )}
      />

      {/* Modal for Delete Button */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this investment?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButtonYes} onPress={deleteInvestment}>
                <Text style={styles.modalButtonText}>Yes, Delete</Text>
              </Pressable>
              <Pressable style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
  investmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonYes: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtonCancel: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Account;
