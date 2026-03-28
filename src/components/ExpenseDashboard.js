// src/components/ExpenseDashboard.js
import React, { useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '../theme/ThemeContext';

const screenWidth = Dimensions.get('window').width;

export default function ExpenseDashboard({ expenses }) {
  const theme = useContext(ThemeContext);

  // 📊 Category-wise data
  const categoryData = {};

  expenses.forEach(e => {
    const key = e.category?.name || 'Other';

    if (!categoryData[key]) {
      categoryData[key] = 0;
    }

    categoryData[key] += e.amount;
  });

  const pieData = Object.keys(categoryData).map((key, index) => ({
    name: key,
    amount: categoryData[key],
    color: getColor(index),
    legendFontColor: theme.text,
    legendFontSize: 12,
  }));

  // 📈 Trend (last 7 days)
  const getLast7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const total = expenses
        .filter(e => new Date(e.date).toDateString() === d.toDateString())
        .reduce((sum, e) => sum + e.amount, 0);

      days.push({
        label: d.getDate().toString(),
        value: total,
      });
    }

    return days;
  };

  const trendData = getLast7Days();

  return (
    <View style={{ marginBottom: 20 }}>
      {/* 🥧 Pie Chart */}
      {pieData.length > 0 && (
        <>
          <Text style={{ color: theme.text, marginBottom: 10 }}>
            Category Breakdown
          </Text>

          <PieChart
            data={pieData.map(d => ({
              name: d.name,
              population: d.amount,
              color: d.color,
              legendFontColor: d.legendFontColor,
              legendFontSize: d.legendFontSize,
            }))}
            width={screenWidth - 20}
            height={180}
            chartConfig={{
              backgroundColor: theme.background,
              color: () => theme.text,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            paddingRight="10"
          />
        </>
      )}

      {/* 📈 Line Chart */}
      <Text style={{ color: theme.text, marginVertical: 10 }}>Last 7 Days</Text>

      <LineChart
        data={{
          labels: trendData.map(d => d.label),
          datasets: [
            {
              data: trendData.map(d => d.value),
            },
          ],
        }}
        width={screenWidth - 20}
        height={200}
        chartConfig={{
          backgroundGradientFrom: theme.card,
          backgroundGradientTo: theme.card,
          color: () => theme.primary,
          labelColor: () => theme.text,
        }}
        bezier
        style={{
          borderRadius: 12,
        }}
      />
    </View>
  );
}

// 🎨 Auto colors
const getColor = i => {
  const colors = ['#FF7043', '#42A5F5', '#AB47BC', '#26A69A', '#FFA726'];
  return colors[i % colors.length];
};
