import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    Modal,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const BarGraph = () => {
    const [monthlyData, setMonthlyData] = useState(
        Array(12).fill({ currentSavings: 0 })
    );
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [globalGoal, setGlobalGoal] = useState(0);
    const [goal, setGoal] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');
    const [monthModalVisible, setMonthModalVisible] = useState(false);
    const [isInitialGoalSet, setIsInitialGoalSet] = useState(false);

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const handleUpdateMonth = () => {
        const goalValue = parseFloat(goal);
        const currentSavingsValue = parseFloat(currentSavings);

        if (!isInitialGoalSet && (isNaN(goalValue) || goalValue <= 0)) {
            alert('Please set a valid goal amount first!');
            return;
        }

        if (isNaN(currentSavingsValue)) {
            alert('Please enter a valid savings amount!');
            return;
        }

        if (!isInitialGoalSet) {
            setGlobalGoal(goalValue);
            setIsInitialGoalSet(true);
        }

        const updatedData = [...monthlyData];
        updatedData[selectedMonth] = { 
            currentSavings: currentSavingsValue
        };

        setMonthlyData(updatedData);
        setCurrentSavings('');
        
        if (!isInitialGoalSet) {
            setGoal('');
        }
        
        Keyboard.dismiss();
    };

    const getChartData = () => {
        return {
            labels: monthNames,
            datasets: [
                {
                    data: monthlyData.map(month => month.currentSavings || 0),
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                },
                {
                    data: Array(12).fill(globalGoal),
                    color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
                },
            ],
        };
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.text}>Emergency Fund Tracker</Text>

                <TouchableOpacity 
                    style={styles.pickerContainer} 
                    onPress={() => setMonthModalVisible(true)}
                >
                    <Text style={styles.textWhite}>{monthNames[selectedMonth]}</Text>
                </TouchableOpacity>

                {!isInitialGoalSet ? (
                    <TextInput
                        style={styles.input}
                        placeholder="Set Your Goal Amount"
                        keyboardType="decimal-pad"
                        value={goal}
                        onChangeText={setGoal}
                    />
                ) : (
                    <View style={styles.goalDisplay}>
                        <Text style={styles.goalText}>Goal Amount: ${globalGoal.toFixed(2)}</Text>
                    </View>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Enter Current Savings"
                    keyboardType="decimal-pad"
                    value={currentSavings}
                    onChangeText={setCurrentSavings}
                />

                <TouchableOpacity style={styles.button} onPress={handleUpdateMonth}>
                    <Text style={styles.buttonText}>
                        {isInitialGoalSet 
                            ? `Update ${monthNames[selectedMonth]} Savings`
                            : 'Set Goal and Savings'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.chartTitle}>Monthly Progress</Text>
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: 'rgb(0, 128, 255)' }]} />
                        <Text style={styles.legendText}>Goal</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: 'rgb(0, 255, 0)' }]} />
                        <Text style={styles.legendText}>Savings</Text>
                    </View>
                </View>

                <BarChart
                    data={getChartData()}
                    width={Dimensions.get('window').width - 10}
                    height={300}
                    yAxisLabel="$"
                    chartConfig={{
                        backgroundColor: '#036704',
                        backgroundGradientFrom: '#036704',
                        backgroundGradientTo: '#036704',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        propsForVerticalLabels: {
                            fontSize: 13, 
                            translateX: -1, 
                        },
                        propsForHorizontalLabels: {
                            fontSize: 12, 
                            translateX: -6, 
                        },
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.5,
                    }}
                    
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    style={{
                        marginVertical: 10,
                        borderRadius: 16,
                    }}
                />

                <Modal visible={monthModalVisible} transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {monthNames.map((month, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setSelectedMonth(index);
                                        setMonthModalVisible(false);
                                    }}
                                    style={styles.option}
                                >
                                    <Text style={styles.textWhite}>{month}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity 
                                style={styles.modalButton} 
                                onPress={() => setMonthModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#036704',
        padding: 20,
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    chartTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 5,
    },
    legendText: {
        color: '#fff',
        fontSize: 14,
    },
    pickerContainer: {
        padding: 10,
        backgroundColor: '#555',
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        width: '80%',
        fontSize: 16,
        marginBottom: 15,
    },
    goalDisplay: {
        backgroundColor: '#025703',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        marginBottom: 15,
    },
    goalText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default BarGraph;