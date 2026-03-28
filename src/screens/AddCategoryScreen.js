// src/screens/AddCategoryScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { ThemeContext } from '../theme/ThemeContext.js';
import { saveCategories, getCategories } from '../utilis/categoryStorage.js';
import { ICONS } from '../constants/icons.js';

export default function AddCategoryScreen({ navigation, route }) {
  const theme = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');

  const saveCategory = async () => {
    if (!name) return;

    const existing = await getCategories();

    const newCat = {
      id: Date.now().toString(),
      name,
      icon,
      color: '#FF9800',
    };

    const updated = [...existing, newCat];
    await saveCategories(updated);

    // 👇 Send back new category
    route.params?.onAddCategory?.(newCat);

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.subText }]}>
        Category Name
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter category"
        placeholderTextColor={theme.subText}
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text },
        ]}
      />

      <Text style={[styles.label, { color: theme.subText }]}>Select Icon</Text>

      <View style={styles.iconGrid}>
        {ICONS.map(i => (
          <TouchableOpacity
            key={i}
            onPress={() => setIcon(i)}
            style={[
              styles.iconItem,
              {
                backgroundColor: icon === i ? theme.primary : theme.card,
              },
            ]}
          >
            <Text style={{ fontSize: 22 }}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: theme.primary }]}
        onPress={saveCategory}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Category</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  label: { marginBottom: 6, marginTop: 15 },

  input: {
    padding: 14,
    borderRadius: 12,
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },

  iconItem: {
    padding: 12,
    borderRadius: 10,
  },

  saveBtn: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
