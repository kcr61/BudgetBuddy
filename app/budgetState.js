// app/budgetState.js

import { create } from 'zustand';

const useBudgetStore = create((set, get) => {
  // Define calculateCategoryTotals within the store scope
  const calculateCategoryTotals = (expenses) => {
    return expenses.reduce((totals, expense) => {
      const category = expense.category;
      if (!totals[category]) {
        totals[category] = 0;
      }
      totals[category] += parseFloat(expense.amount || 0);
      return totals;
    }, {});
  };

  return {
    expenses: [],
    budgetCategories: {
      Bills: {
        name: 'Bills',
        budget: 300,
        subcategories: ['Rent', 'Utilities', 'Internet']
      },
      Shopping: {
        name: 'Shopping',
        budget: 200,
        subcategories: ['Groceries', 'Clothing', 'Electronics']
      },
      Entertainment: {
        name: 'Entertainment',
        budget: 100,
        subcategories: ['Movies', 'Games', 'Activities']
      }
    },
    categoryTotals: {},

    // Add new expense
    addExpense: (expense) => {
      const currentState = get();
      const newExpenses = [...currentState.expenses, expense];
      set({
        expenses: newExpenses,
        categoryTotals: calculateCategoryTotals(newExpenses)
      });
    },

    // Delete expense
    deleteExpense: (expenseId) => {
      const currentState = get();
      const updatedExpenses = currentState.expenses.filter(expense => expense.id !== expenseId);
      set({
        expenses: updatedExpenses,
        categoryTotals: calculateCategoryTotals(updatedExpenses)
      });
    },

    // Update budget for a category
    updateBudgetCategory: (categoryName, amount) => {
      set((state) => ({
        budgetCategories: {
          ...state.budgetCategories,
          [categoryName]: {
            ...state.budgetCategories[categoryName],
            budget: amount
          }
        }
      }));
    },

    // Add new category
    addNewCategory: (categoryName, budget = 0, subcategories = []) => {
      set((state) => ({
        budgetCategories: {
          ...state.budgetCategories,
          [categoryName]: {
            name: categoryName,
            budget: budget,
            subcategories: subcategories
          }
        }
      }));
    },

    // Delete category
    deleteCategory: (categoryName) => {
      set((state) => {
        // Create a copy of the current state
        const newCategories = { ...state.budgetCategories };
        
        // Make sure the category exists before trying to delete it
        if (!newCategories[categoryName]) {
          console.warn(`Category ${categoryName} not found`);
          return state;
        }

        // Delete the category
        delete newCategories[categoryName];

        // Return new state
        return { 
          budgetCategories: newCategories,
          // Recalculate category totals excluding deleted category
          categoryTotals: Object.fromEntries(
            Object.entries(state.categoryTotals)
              .filter(([category]) => category !== categoryName)
          )
        };
      });
    },

    // Check if category can be deleted
    canDeleteCategory: (categoryName) => {
      const state = get();
      return !state.expenses.some(expense => expense.category === categoryName);
    },

    // Update category name
    updateCategoryName: (oldName, newName) => {
      set((state) => {
        const newCategories = { ...state.budgetCategories };
        const category = newCategories[oldName];
        
        if (!category) {
          console.warn(`Category ${oldName} not found`);
          return state;
        }

        delete newCategories[oldName];
        newCategories[newName] = { ...category, name: newName };
        
        return { 
          budgetCategories: newCategories,
          // Update category totals with new name
          categoryTotals: Object.fromEntries(
            Object.entries(state.categoryTotals)
              .map(([category, total]) => 
                category === oldName ? [newName, total] : [category, total]
              )
          )
        };
      });
    },

    // Update subcategories
    updateSubcategories: (categoryName, subcategories) => {
      set((state) => {
        if (!state.budgetCategories[categoryName]) {
          console.warn(`Category ${categoryName} not found`);
          return state;
        }

        return {
          budgetCategories: {
            ...state.budgetCategories,
            [categoryName]: {
              ...state.budgetCategories[categoryName],
              subcategories: subcategories
            }
          }
        };
      });
    },

    // Get category totals
    getCategoryTotals: () => {
      const state = get();
      return calculateCategoryTotals(state.expenses);
    }
  };
});

export default useBudgetStore;