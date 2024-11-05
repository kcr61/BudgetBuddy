// app/(tabs)/budget.jsx

import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity,
    Modal,
    Pressable,
    Alert,
    FlatList
} from 'react-native';
import useBudgetStore from '../budgetState';

const BudgetScreen = () => {
    // State declarations
    const [editingCategory, setEditingCategory] = useState(null);
    const [tempBudgetAmount, setTempBudgetAmount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategoryModal, setNewCategoryModal] = useState(false);
    const [editCategoryModal, setEditCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubcategories, setNewSubcategories] = useState('');
    const [tempNewBudget, setTempNewBudget] = useState('');

    // Get store data and actions
    const expenses = useBudgetStore((state) => state.expenses);
    const budgetCategories = useBudgetStore((state) => state.budgetCategories);
    const updateBudgetCategory = useBudgetStore((state) => state.updateBudgetCategory);
    const addNewCategory = useBudgetStore((state) => state.addNewCategory);
    const deleteCategory = useBudgetStore((state) => state.deleteCategory);
    const updateCategoryName = useBudgetStore((state) => state.updateCategoryName);
    const updateSubcategories = useBudgetStore((state) => state.updateSubcategories);
    const canDeleteCategory = useBudgetStore((state) => state.canDeleteCategory);

    // Calculate spent amount for a category
    const calculateSpentAmount = useCallback((category) => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
    }, [expenses]);

    // Handle editing budget
    const handleEditBudget = useCallback((category) => {
        setEditingCategory(category);
        setTempBudgetAmount(budgetCategories[category].budget.toString());
        setModalVisible(true);
    }, [budgetCategories]);

    // Handle saving budget
    const handleSaveBudget = useCallback(() => {
        if (!tempBudgetAmount || isNaN(tempBudgetAmount) || parseFloat(tempBudgetAmount) < 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid budget amount');
            return;
        }

        updateBudgetCategory(editingCategory, parseFloat(tempBudgetAmount));
        setModalVisible(false);
        setEditingCategory(null);
        setTempBudgetAmount('');
    }, [tempBudgetAmount, editingCategory, updateBudgetCategory]);

    // Handle adding new category
    const handleAddNewCategory = useCallback(() => {
        if (!newCategoryName.trim()) {
            Alert.alert('Invalid Category', 'Please enter a category name');
            return;
        }

        if (budgetCategories[newCategoryName]) {
            Alert.alert('Invalid Category', 'This category already exists');
            return;
        }

        const budget = parseFloat(tempNewBudget) || 0;
        const subcategories = newSubcategories.split(',').map(s => s.trim()).filter(s => s);

        addNewCategory(newCategoryName, budget, subcategories);
        setNewCategoryModal(false);
        resetNewCategoryForm();
    }, [newCategoryName, tempNewBudget, newSubcategories, budgetCategories, addNewCategory]);

    // Handle editing category
    const handleEditCategory = useCallback((category) => {
        setEditingCategory(category);
        setNewCategoryName(category);
        setNewSubcategories(budgetCategories[category].subcategories.join(', '));
        setEditCategoryModal(true);
    }, [budgetCategories]);

    // Handle updating category
    const handleUpdateCategory = useCallback(() => {
        if (!newCategoryName.trim()) {
            Alert.alert('Invalid Category', 'Please enter a category name');
            return;
        }

        const subcategories = newSubcategories.split(',').map(s => s.trim()).filter(s => s);
        
        if (newCategoryName !== editingCategory) {
            updateCategoryName(editingCategory, newCategoryName);
        }
        
        updateSubcategories(newCategoryName, subcategories);
        setEditCategoryModal(false);
        resetNewCategoryForm();
    }, [newCategoryName, newSubcategories, editingCategory, updateCategoryName, updateSubcategories]);

    // Handle deleting category
    const handleDeleteCategory = useCallback((category) => {
        if (!canDeleteCategory(category)) {
            Alert.alert(
                'Cannot Delete Category',
                'This category has associated expenses. Please delete or reassign all expenses before deleting the category.',
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete ${category}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        try {
                            deleteCategory(category);
                            Alert.alert('Success', 'Category deleted successfully');
                        } catch (error) {
                            console.error('Error deleting category:', error);
                            Alert.alert('Error', 'Failed to delete category');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    }, [deleteCategory, canDeleteCategory]);

    // Reset form
    const resetNewCategoryForm = useCallback(() => {
        setNewCategoryName('');
        setNewSubcategories('');
        setTempNewBudget('');
        setEditingCategory(null);
    }, []);

    // Render budget category
    const renderBudgetCategory = useCallback(({ item: category }) => {
        const categoryData = budgetCategories[category];
        if (!categoryData) return null;

        const spentAmount = calculateSpentAmount(category);
        const remainingAmount = categoryData.budget - spentAmount;
        const percentageUsed = categoryData.budget > 0 ? (spentAmount / categoryData.budget) * 100 : 0;

        return (
            <View style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={() => handleEditBudget(category)}
                        >
                            <Text style={styles.editButtonText}>Edit Budget</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.editButton, { marginLeft: 10 }]}
                            onPress={() => handleEditCategory(category)}
                        >
                            <Text style={styles.editButtonText}>Edit Category</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.deleteButton, { marginLeft: 10 }]}
                            onPress={() => handleDeleteCategory(category)}
                        >
                            <Text style={styles.editButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.budgetInfo}>
                    <Text style={styles.budgetText}>Budget: ${categoryData.budget.toFixed(2)}</Text>
                    <Text style={styles.budgetText}>Spent: ${spentAmount.toFixed(2)}</Text>
                    <Text style={[
                        styles.budgetText, 
                        remainingAmount < 0 ? styles.overBudget : styles.underBudget
                    ]}>
                        Remaining: ${remainingAmount.toFixed(2)}
                    </Text>
                    <Text style={styles.subcategoriesText}>
                        Subcategories: {categoryData.subcategories.join(', ')}
                    </Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <View 
                        style={[
                            styles.progressBar, 
                            { 
                                width: `${Math.min(percentageUsed, 100)}%`,
                                backgroundColor: percentageUsed > 100 ? '#FF4444' : '#4CAF50'
                            }
                        ]} 
                    />
                </View>
                <Text style={styles.percentageText}>{percentageUsed.toFixed(1)}% Used</Text>
            </View>
        );
    }, [budgetCategories, calculateSpentAmount, handleEditBudget, handleEditCategory, handleDeleteCategory]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budget Overview</Text>
            
            <TouchableOpacity 
                style={styles.addCategoryButton}
                onPress={() => setNewCategoryModal(true)}
            >
                <Text style={styles.addCategoryButtonText}>Add New Category</Text>
            </TouchableOpacity>

            <FlatList
                data={Object.keys(budgetCategories)}
                renderItem={renderBudgetCategory}
                keyExtractor={item => item}
                style={styles.categoryList}
            />

            {/* Edit Budget Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set Budget for {editingCategory}</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={tempBudgetAmount}
                            onChangeText={setTempBudgetAmount}
                            keyboardType="numeric"
                            placeholder="Enter budget amount"
                            placeholderTextColor="#666"
                        />
                      
                        <View style={styles.modalButtons}>
                            <Pressable 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveBudget}
                            >
                                <Text style={styles.modalButtonText}>Save</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* New Category Modal */}
            <Modal
                transparent={true}
                visible={newCategoryModal}
                onRequestClose={() => setNewCategoryModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Category</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                            placeholder="Category Name"
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={tempNewBudget}
                            onChangeText={setTempNewBudget}
                            keyboardType="numeric"
                            placeholder="Initial Budget (optional)"
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={newSubcategories}
                            onChangeText={setNewSubcategories}
                            placeholder="Subcategories (comma-separated)"
                            placeholderTextColor="#666"
                        />
                        <View style={styles.modalButtons}>
                            <Pressable 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddNewCategory}
                            >
                                <Text style={styles.modalButtonText}>Add</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setNewCategoryModal(false);
                                    resetNewCategoryForm();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                transparent={true}
                visible={editCategoryModal}
                onRequestClose={() => setEditCategoryModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Category</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                            placeholder="Category Name"
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={newSubcategories}
                            onChangeText={setNewSubcategories}
                            placeholder="Subcategories (comma-separated)"
                            placeholderTextColor="#666"
                        />
                        <View style={styles.modalButtons}>
                            <Pressable 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleUpdateCategory}
                            >
                                <Text style={styles.modalButtonText}>Update</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setEditCategoryModal(false);
                                    resetNewCategoryForm();
                                }}
                            >
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
        backgroundColor: '#036704',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    addCategoryButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    addCategoryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryList: {
        flex: 1,
    },
    categoryCard: {
        backgroundColor: '#025703',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
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
        flexWrap: 'wrap',
    },
    editButton: {
        backgroundColor: '#0056b3',
        padding: 8,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    budgetInfo: {
        marginBottom: 10,
    },
    budgetText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    subcategoriesText: {
        color: '#ddd',
        fontSize: 14,
        marginTop: 5,
    },
    overBudget: {
        color: '#FF4444',
    },
    underBudget: {
        color: '#4CAF50',
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginBottom: 5,
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    percentageText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'right',
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
      width: '80%',
      maxWidth: 500,
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: '#000',
  },
  modalInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
      color: '#000',
      backgroundColor: '#fff',
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
      backgroundColor: '#dc3545',
  },
  modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default BudgetScreen;