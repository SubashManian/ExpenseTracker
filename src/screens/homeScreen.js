import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from 'react-native';
import ExpenseItem from '../components/expenseItem.js';
import FilterTabs from '../components/FilterTabs.js';
import { ThemeContext } from '../theme/ThemeContext.js';
import { getExpenses, saveExpenses } from '../utilis/storage.js';
import MonthCalendarView from '../components/MonthCalendarView.js';
import ExpenseDashboard from '../components/ExpenseDashboard.js';
import WeekSectionList from '../components/WeekSectionList.js';

export default function HomeScreen({ navigation }) {
  const theme = useContext(ThemeContext);

  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('Today');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getExpenses();
    // console.log('====================================');
    // console.log(data);
    // console.log('====================================');
    setExpenses(data);
  };

  const save = async newExpense => {
    const updated = expenses.some(e => e.id === newExpense.id)
      ? expenses.map(e => (e.id === newExpense.id ? newExpense : e))
      : [newExpense, ...expenses];

    setExpenses(updated);
    await saveExpenses(updated);
  };

  const filterData = () => {
    const now = new Date();

    return expenses.filter(e => {
      const date = new Date(e.date);

      // Normalize time (important!)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const expenseDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      if (filter === 'Today') {
        return expenseDate.getTime() === today.getTime();
      }

      if (filter === 'Week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6); // last 7 days

        return expenseDate >= weekAgo && expenseDate <= today;
      }

      if (filter === 'Month') {
        return (
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    });
  };

  const total = filterData().reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Total Card */}
      <View style={[styles.totalCard, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.subText }}>Total Expense</Text>
        <Text style={[styles.totalText, { color: theme.text }]}>₹{total}</Text>
      </View>

      {/* Filters */}
      <FilterTabs selected={filter} setSelected={setFilter} />

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddExpense', { onSave: save })}
      >
        <Text style={styles.addText}>+ Add Expense</Text>
      </TouchableOpacity>

      {/* List */}
      {filterData().length === 0 ? (
        <Text
          style={{ textAlign: 'center', marginTop: 20, color: theme.subText }}
        >
          No expenses found
        </Text>
      ) : filter === 'Today' ? (
        <FlatList
          data={filterData()}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ExpenseItem
              item={item}
              onEdit={expense =>
                navigation.navigate('AddExpense', {
                  expense,
                  onSave: save,
                })
              }
            />
          )}
        />
      ) : filter === 'Week' ? (
        <WeekSectionList
          expenses={expenses}
          filter={filter}
          onEdit={expense =>
            navigation.navigate('AddEdit', {
              expense,
              onSave: save,
            })
          }
        />
      ) : (
        <MonthCalendarView expenses={expenses} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  totalCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },

  totalText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
  },

  addBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
