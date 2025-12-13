import React, { createContext, useContext } from 'react';
import { UserState } from '../types';

export const UserContext = createContext<UserState>({
  xp: 0,
  level: 1,
  addXP: () => {}
});

export const useUser = () => useContext(UserContext);
