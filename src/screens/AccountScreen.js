import React, { useReducer } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import AuthScreen from './AuthScreen';
import AccountStackNavigator from '../navigators/AccountStackNavigator';
import Api from '../Api';

import { createAction } from '../config/createAction';
const RootStack = createStackNavigator();

function AccountScreen(state) {
  console.log(state);
  return (
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name={'RootStack'} component={AccountStackNavigator} />
      </RootStack.Navigator>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  input: {
    marginVertical: 20,
  },
});
