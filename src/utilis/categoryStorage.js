// src/utils/categoryStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCategories = async data => {
  await AsyncStorage.setItem('categories', JSON.stringify(data));
};

export const getCategories = async () => {
  const data = await AsyncStorage.getItem('categories');
  return data ? JSON.parse(data) : [];
};
