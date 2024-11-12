import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Pressable,
  Alert 
} from 'react-native';

class BudgetScreen extends React.Component {
  constructor(props) {
    super(props);
    // Pre-seeded categories with initial budgets and spent amounts
    this.state = {
      budgetCategories: {
        'Bills & Utilities': {
          amount: 1000,
          spent: 0,
          subcategories: ['Rent', 'Electricity', 'Water', 'Internet', 'Phone']
        },
        'Food & Dining': {
          amount: 500,
          spent: 0,
          subcategories: ['Groceries', 'Restaurants', 'Coffee Shops']
        },
        'Transportation': {
          amount: 300,
          spent: 0,
          subcategories: ['Gas', 'Public Transit', 'Car Maintenance']
        },
        'Shopping': {
          amount: 200,
          spent: 0,
          subcategories: ['Clothing', 'Electronics', 'Household']
        },
        'Entertainment': {
          amount: 150,
          spent: 0,
          subcategories: ['Movies', 'Games', 'Hobbies']
        },
        'Healthcare': {
          amount: 200,
          spent: 0,
          subcategories: ['Medicine', 'Doctor Visits', 'Insurance']
        }
      },
      editingCategory: null,
      editAmount: '',
      showAddModal: false,
      newCategoryName: '',
      newCategoryAmount: '',
      editModalVisible: false,
      deleteModalVisible: false,
      selectedCategory: null,
      showSubcategories: false,
      editingSubcategories: '',
      selectedCategoryData: null
    };
  }

  addCategory = () => {
    const { newCategoryName, newCategoryAmount, budgetCategories } = this.state;
    
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (budgetCategories[newCategoryName]) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    const amount = parseFloat(newCategoryAmount);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    this.setState(prevState => ({
      budgetCategories: {
        ...prevState.budgetCategories,
        [newCategoryName]: {
          amount: amount,
          spent: 0,
          subcategories: []
        }
      },
      showAddModal: false,
      newCategoryName: '',
      newCategoryAmount: ''
    }));
  };

  updateCategoryAmount = () => {
    const { editingCategory, editAmount, budgetCategories } = this.state;
    const amount = parseFloat(editAmount);

    if (isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    this.setState(prevState => ({
      budgetCategories: {
        ...prevState.budgetCategories,
        [editingCategory]: {
          ...prevState.budgetCategories[editingCategory],
          amount: amount
        }
      },
      editingCategory: null,
      editModalVisible: false
    }));
  };

  updateSpentAmount = (category) => {
    const amount = parseFloat(this.state.editAmount);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    this.setState(prevState => ({
      budgetCategories: {
        ...prevState.budgetCategories,
        [category]: {
          ...prevState.budgetCategories[category],
          spent: amount
        }
      },
      editModalVisible: false,
      selectedCategory: null,
      editAmount: ''
    }));
  };

  deleteCategory = () => {
    const { selectedCategory } = this.state;
    this.setState(prevState => {
      const newCategories = { ...prevState.budgetCategories };
      delete newCategories[selectedCategory];
      return {
        budgetCategories: newCategories,
        deleteModalVisible: false,
        selectedCategory: null
      };
    });
  };

  editSubcategories = () => {
    const { selectedCategory, editingSubcategories, budgetCategories } = this.state;
    const subcategories = editingSubcategories
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    this.setState(prevState => ({
      budgetCategories: {
        ...prevState.budgetCategories,
        [selectedCategory]: {
          ...prevState.budgetCategories[selectedCategory],
          subcategories: subcategories
        }
      },
      showSubcategories: false,
      selectedCategory: null,
      editingSubcategories: ''
    }));
  };

  renderBudgetCategoryItem = ({ item }) => {
    const [category, data] = item;
    const percentage = (data.spent / data.amount) * 100;
    const remaining = data.amount - data.spent;

    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => this.setState({ 
                editingCategory: category, 
                editAmount: data.amount.toString(),
                editModalVisible: true 
              })}
            >
              <Text style={styles.buttonText}>Edit Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.spentButton}
              onPress={() => this.setState({
                selectedCategory: category,
                editAmount: data.spent.toString(),
                editModalVisible: true
              })}
            >
              <Text style={styles.buttonText}>Update Spent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => this.setState({
                selectedCategory: category,
                editingSubcategories: data.subcategories.join(', '),
                showSubcategories: true
              })}
            >
              <Text style={styles.buttonText}>Edit Items</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.budgetInfo}>
          <Text style={styles.budgetText}>Budget: ${data.amount.toFixed(2)}</Text>
          <Text style={styles.budgetText}>Spent: ${data.spent.toFixed(2)}</Text>
          <Text style={[styles.budgetText, remaining < 0 ? styles.overBudget : styles.underBudget]}>
            Remaining: ${remaining.toFixed(2)}
          </Text>
          {data.subcategories.length > 0 && (
            <Text style={styles.subcategoriesText}>
              Items: {data.subcategories.join(', ')}
            </Text>
          )}
        </View>

        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 100 ? '#FF4444' : '#4CAF50'
              }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>{percentage.toFixed(1)}% Used</Text>
      </View>
    );
  };

  render() {
    const { budgetCategories } = this.state;
    const totalBudget = Object.values(budgetCategories).reduce((total, cat) => total + cat.amount, 0);
    const totalSpent = Object.values(budgetCategories).reduce((total, cat) => total + cat.spent, 0);
    const totalRemaining = totalBudget - totalSpent;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Budget Overview</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Budget</Text>
              <Text style={styles.summaryValue}>${totalBudget.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, totalRemaining < 0 ? styles.negative : styles.positive]}>
              ${totalRemaining.toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => this.setState({ showAddModal: true })}
        >
          <Text style={styles.addButtonText}>Add New Category</Text>
        </TouchableOpacity>

        <FlatList
          data={Object.entries(budgetCategories)}
          keyExtractor={(item) => item[0]}
          renderItem={this.renderBudgetCategoryItem}
          style={styles.categoryList}
        />

        {/* Add Category Modal */}
        <Modal
          transparent={true}
          visible={this.state.showAddModal}
          onRequestClose={() => this.setState({ showAddModal: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Category Name"
                value={this.state.newCategoryName}
                onChangeText={(text) => this.setState({ newCategoryName: text })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Budget Amount"
                keyboardType="numeric"
                value={this.state.newCategoryAmount}
                onChangeText={(text) => this.setState({ newCategoryAmount: text })}
              />
              <View style={styles.modalButtons}>
                <Pressable style={[styles.modalButton, styles.saveButton]} onPress={this.addCategory}>
                  <Text style={styles.buttonText}>Add</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => this.setState({ showAddModal: false })}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Amount Modal */}
        <Modal
          transparent={true}
          visible={this.state.editModalVisible}
          onRequestClose={() => this.setState({ editModalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {this.state.selectedCategory ? 'Update Spent Amount' : 'Edit Budget Amount'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={this.state.editAmount}
                onChangeText={(text) => this.setState({ editAmount: text })}
              />
              <View style={styles.modalButtons}>
                <Pressable 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={() => {
                    if (this.state.selectedCategory) {
                      this.updateSpentAmount(this.state.selectedCategory);
                    } else {
                      this.updateCategoryAmount();
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => this.setState({ 
                    editModalVisible: false, 
                    selectedCategory: null 
                  })}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Subcategories Modal */}
        <Modal
          transparent={true}
          visible={this.state.showSubcategories}
          onRequestClose={() => this.setState({ showSubcategories: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Category Items</Text>
              <TextInput
                style={[styles.modalInput, styles.multilineInput]}
                placeholder="Enter items (comma-separated)"
                value={this.state.editingSubcategories}
                onChangeText={(text) => this.setState({ editingSubcategories: text })}
                multiline
              />
              <View style={styles.modalButtons}>
                <Pressable style={[styles.modalButton, styles.saveButton]} onPress={this.editSubcategories}>
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => this.setState({ 
                    showSubcategories: false,
                    selectedCategory: null
                  })}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#036704',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#025703',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryTotal: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#FF4444',
  },
  categoryList: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: '#025703',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  categoryHeader: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#0056b3',
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
  },
  spentButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  budgetInfo: {
    marginBottom: 10,
  },
  budgetText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 3,
  },
  overBudget: {
    color: '#FF4444',
  },
  underBudget: {
    color: '#4CAF50',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BudgetScreen;