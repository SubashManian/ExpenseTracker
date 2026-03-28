// src/components/CategoryIcon.js
import React from 'react';
import { Text, View } from 'react-native';

export default function CategoryIcon({ category }) {
  return (
    <View>
      <Text style={{ fontSize: 20 }}>{category?.icon}</Text>
    </View>
  );
}
