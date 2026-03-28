// src/components/ExpenseItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CategoryIcon from './CategoryIcon.js';

export default function ExpenseItem({ item, onEdit }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onEdit(item)}>
      <View style={styles.left}>
        <CategoryIcon category={item.category} />
        <View>
          <Text style={styles.note}>{item.note}</Text>
          <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
        </View>
      </View>

      <Text style={styles.amount}>₹{item.amount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    gap: 10,
  },
  note: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
