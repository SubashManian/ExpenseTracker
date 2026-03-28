// src/components/WeekSectionList.js
import React, { useContext } from 'react';
import { View, Text, SectionList } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext.js';
import ExpenseItem from './expenseItem.js';

export default function WeekSectionList({ expenses, filter, onEdit }) {
  const theme = useContext(ThemeContext);

  // 📅 Filter data (Today / Week)
  const filterData = () => {
    const now = new Date();

    return expenses.filter(e => {
      const date = new Date(e.date);

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
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 6);

        return expenseDate >= weekAgo && expenseDate <= today;
      }

      return true;
    });
  };

  // 📦 Group by date
  const groupByDate = data => {
    const groups = {};

    data.forEach(item => {
      const key = new Date(item.date).toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);
    });

    return Object.keys(groups)
      .map(date => ({
        title: date,
        data: groups[date],
      }))
      .sort((a, b) => new Date(b.title) - new Date(a.title));
  };

  const sections = groupByDate(filterData());

  // 🗓 Format date
  const formatDate = dateStr => {
    const d = new Date(dateStr);

    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const getLabel = dateStr => {
    const today = new Date();
    const d = new Date(dateStr);

    if (d.toDateString() === today.toDateString()) return 'Today';

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return formatDate(dateStr);
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id.toString()}
      renderSectionHeader={({ section }) => {
        const total = section.data.reduce((sum, i) => sum + i.amount, 0);

        return (
          <View
            style={{
              paddingVertical: 10,
              backgroundColor: theme.background,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>
              {getLabel(section.title)}
            </Text>

            <Text style={{ color: theme.subText }}>₹{total}</Text>
          </View>
        );
      }}
      renderItem={({ item }) => <ExpenseItem item={item} onEdit={onEdit} />}
      ListEmptyComponent={() => (
        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
            color: theme.subText,
          }}
        >
          No expenses found
        </Text>
      )}
    />
  );
}
