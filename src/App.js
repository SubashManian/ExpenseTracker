import React, { useContext } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { ThemeProvider, ThemeContext } from './theme/ThemeContext.js';
import HomeScreen from './screens/homeScreen.js';
import AddEditExpenseScreen from './screens/AddEditExpenseScreen.js';
import AddCategoryScreen from './screens/AddCategoryScreen.js';
import AnalyticsScreen from './screens/AnalyticsScreen.js';

const Stack = createStackNavigator();

function AppContent() {
  const theme = useContext(ThemeContext);

  const isDark = theme.background === '#0F1115';

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
      notification: theme.primary,
    },
  };

  return (
    <>
      {/* Status Bar */}
      <StatusBar
        barStyle={navTheme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.card,
            },
            headerTitleStyle: {
              color: theme.text,
              fontWeight: '600',
            },
            headerTintColor: theme.text,
            headerLeftContainerStyle: {
              paddingLeft: 10, // ✅ spacing fix
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false, // cleaner fintech look
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Expenses',
              headerLeft: () => null,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Analytics')}
                  style={{ paddingRight: 15 }}
                >
                  <Ionicons
                    name="pie-chart-outline"
                    size={22}
                    color={theme.text}
                  />
                </TouchableOpacity>
              ),
            })}
          />

          {/* ✅ Add/Edit → WITH back button */}
          <Stack.Screen
            name="AddExpense"
            component={AddEditExpenseScreen}
            options={({ navigation }) => ({
              title: 'Add Expense',
              headerBackTitleVisible: false,
              headerLeft: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ paddingHorizontal: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color={tintColor} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddCategoryScreen}
            options={({ navigation }) => ({
              title: 'Add Category',
              headerBackTitleVisible: false,
              headerLeft: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ paddingHorizontal: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color={tintColor} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={({ navigation }) => ({
              title: 'Analytics',
              headerBackTitleVisible: false,
              headerLeft: ({ tintColor }) => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ paddingHorizontal: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color={tintColor} />
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
