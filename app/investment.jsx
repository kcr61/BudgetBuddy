import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  KeyboardAvoidingView, 
  Platform, 
  Dimensions,
  Keyboard,
  Modal,
  TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Investment = () => {
  const [investmentName, setInvestmentName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState('');
  const [investments, setInvestments] = useState([]);
  const [uniqueInvestments, setUniqueInvestments] = useState(new Set());
  const [investmentModalVisible, setInvestmentModalVisible] = useState(false);
  const [chartInvestmentModalVisible, setChartInvestmentModalVisible] = useState(false);
  const [selectedChartInvestment, setSelectedChartInvestment] = useState('all');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);

  useEffect(() => {
    const names = new Set(investments.map(inv => inv.name));
    setUniqueInvestments(names);
  }, [investments]);

  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const getInvestmentTotal = (investmentName) => {
    return investments
      .filter(inv => inv.name === investmentName)
      .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  };

  const getTotalValue = () => {
    return investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  };

  const getChartData = () => {
    if (investments.length === 0) return {
      labels: [],
      datasets: [{ data: [0] }]
    };

    let filteredInvestments = [...investments];
    if (selectedChartInvestment !== 'all') {
      filteredInvestments = filteredInvestments.filter(inv => inv.name === selectedChartInvestment);
    }

    filteredInvestments.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningTotal = 0;
    const data = filteredInvestments.map(inv => {
      runningTotal += parseFloat(inv.amount);
      return runningTotal;
    });

    const labels = filteredInvestments.map(inv => {
      const date = new Date(inv.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    return {
      labels,
      datasets: [{ data }]
    };
  };

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  const handleAddInvestment = async(e) => {
    e.preventDefault();
    dismissKeyboard();
    
    const amount = parseFloat(investmentAmount);
    
    if (!investmentName && !selectedInvestment) {
      alert('Please enter or select an investment name');
      return;
    }

    if (isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const name = selectedInvestment || investmentName;

    const newInvestment = { 
      id: Date.now().toString(), 
      name: name,
      amount: amount,
      date: new Date().toISOString().split('T')[0]
    };

    setInvestments(prev => [...prev, newInvestment]);
    setInvestmentName('');
    setInvestmentAmount('');
    setSelectedInvestment('');

    try {
      const response = await fetch("http://172.20.10.3:3000/api/account/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newInvestment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error recording investment update:", error);
      alert("There was an error recording the investment update.");
    }
  };

  const deleteInvestment = (id) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
    setDeleteModalVisible(false);
    setSelectedInvestmentId(null);
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#025703',
    backgroundGradientTo: '#025703',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#fff'
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.mainContainer}
    >
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Stock Investment Tracker</Text>
          
          <View style={styles.chartContainer}>
            <Text style={styles.totalValue}>
              Total Portfolio Value: {formatCurrency(getTotalValue())}
            </Text>

            <TouchableOpacity 
              style={styles.pickerContainer}
              onPress={() => setChartInvestmentModalVisible(true)}
            >
              <Text style={styles.textWhite}>
                {selectedChartInvestment === 'all' ? 'All Investments' : selectedChartInvestment}
              </Text>
            </TouchableOpacity>

            {investments.length > 0 ? (
              <LineChart
                data={getChartData()}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withVerticalLines={true}
                withHorizontalLines={true}
                formatYLabel={(value) => `$${value}`}
              />
            ) : (
              <Text style={styles.noDataText}>Add investments to see value chart</Text>
            )}
          </View>

          <View style={styles.formContainer}>
            {uniqueInvestments.size > 0 && (
              <TouchableOpacity 
                style={styles.pickerContainer}
                onPress={() => setInvestmentModalVisible(true)}
              >
                <Text style={styles.textWhite}>
                  {selectedInvestment || 'Select existing investment'}
                </Text>
              </TouchableOpacity>
            )}

            {!selectedInvestment && (
              <TextInput
                style={styles.input}
                placeholder="Enter new investment name"
                placeholderTextColor="#999"
                value={investmentName}
                onChangeText={setInvestmentName}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter value change (+ for gain, - for loss)"
              placeholderTextColor="#999"
              value={investmentAmount}
              onChangeText={setInvestmentAmount}
            />
            
            <Pressable style={styles.button} onPress={handleAddInvestment}>
              <Text style={styles.buttonText}>Record Value Change</Text>
            </Pressable>
          </View>

          <View style={styles.investmentList}>
            <Text style={styles.historyTitle}>Investment History</Text>
            {[...uniqueInvestments].map(name => (
              <View key={name} style={styles.investmentGroup}>
                <Text style={styles.groupHeader}>
                  {name} - Total: {formatCurrency(getInvestmentTotal(name))}
                </Text>
                {investments
                  .filter(inv => inv.name === name)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((item) => (
                    <View key={item.id} style={styles.investmentItem}>
                      <Text style={styles.investmentDate}>{item.date}</Text>
                      <Text style={[
                        styles.investmentAmount,
                        { color: item.amount >= 0 ? '#4CAF50' : '#FF4444' }
                      ]}>
                        {formatCurrency(item.amount)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedInvestmentId(item.id);
                          setDeleteModalVisible(true);
                        }}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Investment Selection Modal */}
      <Modal visible={investmentModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {[...uniqueInvestments].map((investment) => (
              <Pressable
                key={investment}
                onPress={() => {
                  setSelectedInvestment(investment);
                  setInvestmentModalVisible(false);
                }}
                style={styles.option}
              >
                <Text style={styles.textWhite}>{investment}</Text>
              </Pressable>
            ))}
            <Pressable 
              style={styles.modalButton} 
              onPress={() => setInvestmentModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Chart Filter Modal */}
      <Modal visible={chartInvestmentModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable
              onPress={() => {
                setSelectedChartInvestment('all');
                setChartInvestmentModalVisible(false);
              }}
              style={styles.option}
            >
              <Text style={styles.textWhite}>All Investments</Text>
            </Pressable>
            {[...uniqueInvestments].map((investment) => (
              <Pressable
                key={investment}
                onPress={() => {
                  setSelectedChartInvestment(investment);
                  setChartInvestmentModalVisible(false);
                }}
                style={styles.option}
              >
                <Text style={styles.textWhite}>{investment}</Text>
              </Pressable>
            ))}
            <Pressable 
              style={styles.modalButton} 
              onPress={() => setChartInvestmentModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this investment?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => deleteInvestment(selectedInvestmentId)}
              >
                <Text style={styles.modalButtonText}>Yes, Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#036704',
  },
  scrollViewContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  chartContainer: {
    backgroundColor: '#025703',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  textWhite: {
    color: 'white',
  },
  option: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... (previous styles remain the same)
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 5,
  },
  investmentList: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  investmentGroup: {
    marginBottom: 16,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#025703',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  investmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  investmentDate: {
    fontSize: 16,
    color: '#666',
  },
  investmentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  deleteText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default Investment;