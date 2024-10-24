import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  StyleSheet, 
  Modal, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard
} from 'react-native';

const Account = () => {
  const [goal, setGoal] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [progress, setProgress] = useState(0);
  const [investmentName, setInvestmentName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investments, setInvestments] = useState([]);
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [yearlyExpenses, setYearlyExpenses] = useState('');
  const [yearlyReport, setYearlyReport] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  const handleInputSubmit = (nextInput = null) => {
    if (Platform.OS !== 'web') {
      dismissKeyboard();
    }
    if (nextInput) {
      nextInput.current?.focus();
    }
  };

  // TODO(For John) -- The EF, It, and YR save under seperate users in the database, fix that

  // NOTE -- Function called for calculating emergency fund progress
  const handleCalculateProgress = async(e) => {
    e.preventDefault();

    dismissKeyboard();
    const goalValue = parseFloat(goal);
    const currentSavingsValue = parseFloat(currentSavings);
  
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

    const emergencyFund = { 
      goal,
      currentSavings
    };

    try {
      const response = await fetch("http://localhost:3000/api/account/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emergencyFund),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Emergency Fund Updated");
    alert("Emergency Fund successfully updated!");

    } catch (error) {
    console.error("Error updating Emergency Fund:", error);
    alert("There was an error updating the emergency fund.");
    }
  };

  // NOTE -- Function called for adding investment
  const handleAddInvestment = async(e) => {
    e.preventDefault();

    dismissKeyboard();
    const amount = parseFloat(investmentAmount);
  
    if (investmentName && !isNaN(amount)) {
      const newInvestment = { id: Date.now().toString(), name: investmentName, amount };
      setInvestments((prevInvestments) => [...prevInvestments, newInvestment]);
      setInvestmentName('');
      setInvestmentAmount('');
    } else {
      console.error('Please enter a valid investment name and amount.');
    }

    const investment = { 
      investmentName,
      investmentAmount
    };

    try {
      const response = await fetch("http://localhost:3000/api/account/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(investment),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Investment Tracker Updated");
    alert("Investment Tracker successfully updated!");

    } catch (error) {
    console.error("Error updating Investment Tracker:", error);
    alert("There was an error updating the investment tracker.");
    }
  };

  const openDeleteModal = (id) => {
    dismissKeyboard();
    setSelectedInvestmentId(id);
    setModalVisible(true);
  };

  const deleteInvestment = () => {
    const updatedInvestments = investments.filter((investment) => investment.id !== selectedInvestmentId);
    setInvestments(updatedInvestments);
    setModalVisible(false);
    setSelectedInvestmentId(null);
  };
  // NOTE -- Function called for the Yearly Report Button
  const handleCalculateYearlyReport = async(e) => {
    e.preventDefault();

    dismissKeyboard();
    const income = parseFloat(yearlyIncome);
    const expenses = parseFloat(yearlyExpenses);
  
    if (!isNaN(income) && !isNaN(expenses)) {
      const report = income - expenses;
      setYearlyReport(`Your net savings for the year: $${report.toFixed(2)}`);
    } else {
      console.error('Please enter valid yearly income and expenses.');
      setYearlyReport('');
    }

    const yearlyReports = { 
      yearlyIncome,
      yearlyExpenses
    };

    try {
      const response = await fetch("http://localhost:3000/api/account/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(yearlyReports),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Yearly Report Updated");
    alert("Yearly Report successfully updated!");

    } catch (error) {
    console.error("Error updating Yearly Report:", error);
    alert("There was an error updating the yearly report.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Emergency Fund Tracker</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your goal amount"
            keyboardType={Platform.OS === 'web' ? 'numeric' : 'decimal-pad'}
            value={goal}
            onChangeText={setGoal}
            returnKeyType="done"
            onSubmitEditing={() => handleInputSubmit()}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter current savings"
            keyboardType={Platform.OS === 'web' ? 'numeric' : 'decimal-pad'}
            value={currentSavings}
            onChangeText={setCurrentSavings}
            returnKeyType="done"
            onSubmitEditing={() => handleInputSubmit()}
          />
          {/* NOTE -- Emergency Fund button */}
          <Pressable style={styles.button} onPress={handleCalculateProgress}>
            <Text style={styles.buttonText}>Calculate Progress</Text>
          </Pressable>
          <Text style={styles.result}>
            Progress towards goal: {progress}%
          </Text>
      
          <Text style={styles.title}>Investment Tracker</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter investment name"
            value={investmentName}
            onChangeText={setInvestmentName}
            returnKeyType="done"
            onSubmitEditing={() => handleInputSubmit()}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter investment amount"
            keyboardType={Platform.OS === 'web' ? 'numeric' : 'decimal-pad'}
            value={investmentAmount}
            onChangeText={setInvestmentAmount}
            returnKeyType="done"
            onSubmitEditing={() => handleInputSubmit()}
          />
          {/* NOTE -- The Add Investment button */}
          <Pressable style={styles.button} onPress={handleAddInvestment}>
            <Text style={styles.buttonText}>Add Investment</Text>
          </Pressable>

          {investments.map((item) => (
            <View key={item.id} style={styles.investmentItem}>
              <Text>{item.name}: ${item.amount.toFixed(2)}</Text>
              <Button
                title="Delete"
                onPress={() => openDeleteModal(item.id)}
                color="red"
              />
            </View>
          ))}

          <Text style={styles.title}>Yearly Report</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter yearly income"
            keyboardType={Platform.OS === 'web' ? 'numeric' : 'decimal-pad'}
            value={yearlyIncome}
            onChangeText={setYearlyIncome}
            returnKeyType="done"
            onSubmitEditing={() => handleInputSubmit()}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter yearly expenses"
            keyboardType={Platform.OS === 'web' ? 'numeric' : 'decimal-pad'}
            value={yearlyExpenses}
            onChangeText={setYearlyExpenses}
            returnKeyType="done"
            onSubmitEditing={() => handleInputSubmit()}
          />
          {/* NOTE -- Calculating the yearly report button */}
          <Pressable style={styles.button} onPress={handleCalculateYearlyReport}>
            <Text style={styles.buttonText}>Calculate Yearly Report</Text>
          </Pressable>
          <Text style={styles.result}>
            {yearlyReport}
          </Text>
        </View>
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#036704',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
  investmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Account;