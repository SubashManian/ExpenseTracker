// src/screens/AddEditExpenseScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getCategories, saveCategories } from '../utilis/categoryStorage.js';
import { lightTheme, darkTheme } from '../theme/color.js';
import { useColorScheme } from 'react-native';
import { ICONS } from '../constants/icons.js';

export default function AddEditExpenseScreen({ route, navigation }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const existing = route.params?.expense;

  const [amount, setAmount] = useState(existing?.amount?.toString() || '');
  const [note, setNote] = useState(existing?.note || '');
  const [category, setCategory] = useState(existing?.category);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const [selectedIcon, setSelectedIcon] = useState('✨');
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data.length ? data : []);
  };

  // const addCategory = async () => {
  //   if (!newCategory) return;

  //   const newCat = {
  //     id: Date.now().toString(),
  //     name: newCategory,
  //     icon: selectedIcon, // ✅ dynamic icon
  //     color: '#FF9800',
  //   };

  //   const updated = [...categories, newCat];
  //   setCategories(updated);
  //   await saveCategories(updated);

  //   setNewCategory('');
  //   setSelectedIcon('✨');
  // };

  const save = () => {
    const expense = {
      id: existing?.id || Date.now(),
      amount: parseFloat(amount),
      note,
      category,
      date: new Date().toISOString(),
    };

    route.params.onSave(expense);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: 20 }}>
          {/* Amount */}
          <Text style={[styles.label, { color: theme.subText }]}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="₹ Enter amount"
            placeholderTextColor={theme.subText}
            style={[
              styles.input,
              { backgroundColor: theme.card, color: theme.text },
            ]}
          />

          {/* Note */}
          <Text style={[styles.label, { color: theme.subText }]}>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Description"
            placeholderTextColor={theme.subText}
            style={[
              styles.input,
              { backgroundColor: theme.card, color: theme.text },
            ]}
          />

          {/* Category Selection */}
          <Text style={[styles.label, { color: theme.subText }]}>Category</Text>

          <View style={styles.categoryContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      category?.id === cat.id ? theme.primary : theme.card,
                  },
                ]}
              >
                <Text style={{ color: theme.text }}>
                  {cat.icon} {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add New Category */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddCategory', {
                onAddCategory: newCat => {
                  setCategories(prev => [...prev, newCat]);
                  setCategory(newCat); // auto select
                },
              })
            }
            style={styles.addCategoryBtn}
          >
            <Text style={{ color: theme.primary }}>+ Add New Category</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={save}
          >
            <Text style={styles.saveText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
  },
  saveBtn: {
    marginTop: 30,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  iconItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  addCategoryBtn: {
    marginTop: 10,
    paddingVertical: 10,
  },
});
