// src/screens/AnalyticsScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext.js';
import ExpenseDashboard from '../components/ExpenseDashboard.js';
import { getExpenses } from '../utilis/storage.js';

export default function AnalyticsScreen() {
  const theme = useContext(ThemeContext);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >
        Analytics Dashboard
      </Text>

      <View
        style={{
          backgroundColor: theme.card,
          borderRadius: 16,
          padding: 15,
        }}
      >
        <ExpenseDashboard expenses={expenses} />
      </View>
    </ScrollView>
  );
}
