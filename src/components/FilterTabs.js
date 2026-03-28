// src/components/FilterTabs.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext.js';

export default function FilterTabs({ selected, setSelected }) {
  const theme = useContext(ThemeContext);

  const tabs = ['Today', 'Week', 'Month'];

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {tabs.map(tab => {
        const isActive = selected === tab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelected(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? theme.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={{
                color: isActive ? '#fff' : theme.text,
                fontWeight: isActive ? 'bold' : '500',
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 5,
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
});
