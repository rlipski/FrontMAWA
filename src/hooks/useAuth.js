import React, { useReducer, useState, useEffect } from 'react';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import { createAction } from '../config/createAction';
import { sleep } from '../utils/sleep';
import jwt_decode from 'jwt-decode';
import SecureStorage from 'react-native-secure-storage';

export function useAuth() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_USER':
          return {
            ...state,
            user: { ...action.payload },
          };
        case 'REMOVE_USER':
          return {
            ...state,
            user: undefined,
          };
        default:
          return state;
      }
    },
    {
      user: undefined,
    },
  );

  const auth = React.useMemo(
    () => ({
      login: async (email, password) => {
        await fetch(`${Api.getURL()}/login`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, password: password }),
        })
          .then((res) => res.json())
          .then(async (resData) => {
            const user = {
              token: resData.access_token,
              user: resData.user,
            };
            await SecureStorage.setItem('user', JSON.stringify(user));
            dispatch(createAction('SET_USER', user));
          })
          .catch((error) => {
            console.log('Api call error');
            alert(error.message);
          });
      },

      logout: async () => {
        await SecureStorage.removeItem('user');
        dispatch(createAction('REMOVE_USER'));
      },

      register: async (name, email, password) => {
        console.log(`${Api.getURL()}/register`);
        await fetch(`${Api.getURL()}/register`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, email: email, password: password }),
        })
          .then((res) => res.json())
          .then((resData) => {
          })
          .catch((error) => {
            console.log('Api call error');
            alert(error.message);
          });
      },
      editAccount: async (token, name, email, phone) => {
        const value = await AsyncStorage.getItem('userToken');

        let decodedToken = jwt_decode(token);
        console.log(JSON.stringify({ name: name, email: email, phone: phone }));
        await fetch(`${Api.getURL()}/user/${decodedToken.sub}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: name, email: email, phone: phone }),
        })
          .then((res) => res.json())
          .then(async (resData) => {
            const user = {
              token: resData.access_token,
              user: resData.user,
            };
            await SecureStorage.setItem('user', JSON.stringify(user));
            dispatch(createAction('SET_USER', user));
          })
          .catch((error) => {
            console.log('Api call error');
            alert(error.message);
          });
      },
    }),
    [],
  );

  useEffect(() => {
    sleep(2000).then(() => {
      SecureStorage.getItem('user').then(user => {
        if (user) {
          dispatch(createAction('SET_USER', JSON.parse(user)));
        }
      });
    });
  }, []);

  return { auth, state };
}