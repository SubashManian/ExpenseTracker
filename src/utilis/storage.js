// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveExpenses = async data => {
  await AsyncStorage.setItem('expenses', JSON.stringify(data));
};

export const getExpenses = async () => {
  const data = await AsyncStorage.getItem('expenses');
  return data ? JSON.parse(data) : [];
};
