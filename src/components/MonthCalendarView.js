// src/components/MonthCalendarView.js
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export default function MonthCalendarView({ expenses }) {
  const theme = useContext(ThemeContext);

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // 📅 Generate month days
  const getMonthDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();

    const startDay = firstDay.getDay();

    const days = [];

    // Empty slots
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let i = 1; i <= lastDate; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // 💰 Total per day
  const getTotalForDate = date => {
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.toDateString() === date.toDateString();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // 🔄 Month switch (no future allowed)
  const changeMonth = direction => {
    const newDate = new Date(selectedMonth);

    // Normalize to first day, no time
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);

    newDate.setMonth(newDate.getMonth() + direction);

    const now = new Date();

    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Normalize currentMonth too
    currentMonth.setHours(0, 0, 0, 0);

    // ❌ Block ONLY future months
    if (newDate.getTime() > currentMonth.getTime()) {
      return;
    }

    setSelectedMonth(newDate);
  };

  const days = getMonthDays();

  const isNextDisabled = () => {
    const now = new Date();

    return (
      selectedMonth.getFullYear() === now.getFullYear() &&
      selectedMonth.getMonth() === now.getMonth()
    );
  };

  return (
    <View style={{ marginTop: 10 }}>
      {/* 📅 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={[styles.arrow, { color: theme.subText }]}>⬅️ Prev</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          {selectedMonth.toLocaleString('en-IN', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        {isNextDisabled() ? (
          <Text style={[styles.arrow, { color: 'rgba(255, 255, 255, 0)' }]}>
            Next
          </Text>
        ) : (
          <TouchableOpacity
            onPress={() => changeMonth(1)}
            disabled={isNextDisabled()}
          >
            <Text style={[styles.arrow, { color: theme.subText }]}>
              Next ➡️
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📆 Week Labels */}
      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={[styles.weekText, { color: theme.subText }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* 📅 Calendar Grid */}
      <View style={styles.grid}>
        {days.map((day, index) => {
          if (!day) {
            return <View key={index} style={styles.empty} />;
          }

          const total = getTotalForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <View key={index} style={styles.cell}>
              <View
                style={[
                  styles.dayBox,
                  {
                    backgroundColor: theme.card,
                    borderColor: isToday ? theme.primary : 'transparent',
                    borderWidth: isToday ? 1 : 0,
                  },
                ]}
              >
                <Text style={{ color: theme.text }}>{day.getDate()}</Text>

                {total > 0 && (
                  <Text style={{ fontSize: 10, color: theme.primary }}>
                    ₹{total}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  weekText: {
    width: '14.2%',
    textAlign: 'center',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.2%',
    padding: 4,
  },
  empty: {
    width: '14.2%',
  },
  dayBox: {
    minHeight: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
