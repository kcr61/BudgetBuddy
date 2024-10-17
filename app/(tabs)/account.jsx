import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, Pressable, Keyboard } from 'react-native';

const Account = () => {
  //Emergency Fund Tracker
  const [goal, setGoal] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [progress, setProgress] = useState(0);
//Investment Tracker
  const [investmentName, setInvestmentName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investments, setInvestments] = useState([]);
//Yearly Report
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [yearlyExpenses, setYearlyExpenses] = useState('');
  const [yearlyReport, setYearlyReport] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);

  const handleCalculateProgress = () => {
    const goalValue = parseFloat(goal);
    const currentSavingsValue = parseFloat(currentSavings);
//Validate input values
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

  const handleCalculateYearlyReport = () => {
    const income = parseFloat(yearlyIncome);
    const expenses = parseFloat(yearlyExpenses);

    if (!isNaN(income) && !isNaN(expenses)) {
      const report = income - expenses;
      setYearlyReport(`Net savings for the year: $${report.toFixed(2)}`);
    } else {
      console.error('Please enter valid yearly income and expenses.');
      setYearlyReport('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Fund Tracker</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Goal"
          keyboardType="numeric"
          value={goal}
          onChangeText={setGoal}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Current"
          keyboardType="numeric"
          value={currentSavings}
          onChangeText={setCurrentSavings}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Pressable style={styles.smallButton} onPress={handleCalculateProgress}>
          <Text style={styles.smallButtonText}>Calc</Text>
        </Pressable>
      </View>
      <Text style={styles.result}>Progress: {progress}%</Text>

      <Text style={styles.title}>Investment Tracker</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Investment"
          value={investmentName}
          onChangeText={setInvestmentName}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Amount"
          keyboardType="numeric"
          value={investmentAmount}
          onChangeText={setInvestmentAmount}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Pressable style={styles.smallButton} onPress={handleAddInvestment}>
          <Text style={styles.smallButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={investments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.investmentItem}>
            <Text>{item.name}: ${item.amount.toFixed(2)}</Text>
            <Button title="X" onPress={() => openDeleteModal(item.id)} color="red" />
          </View>
        )}
        style={{ maxHeight: 100 }} // Limit height to avoid scrolling
      />

      <Text style={styles.title}>Yearly Report</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Income"
          keyboardType="numeric"
          value={yearlyIncome}
          onChangeText={setYearlyIncome}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Expenses"
          keyboardType="numeric"
          value={yearlyExpenses}
          onChangeText={setYearlyExpenses}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Pressable style={styles.smallButton} onPress={handleCalculateYearlyReport}>
          <Text style={styles.smallButtonText}>Calc</Text>
        </Pressable>
      </View>
      <Text style={styles.result}>{yearlyReport}</Text>

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
                <Text style={styles.modalButtonText}>Yes</Text>
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
    flex: 1,
    padding: 10,
    backgroundColor: '#036704',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginRight: 5,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  smallButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  result: {
    marginVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  investmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonYes: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#5bc0de',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Account;
