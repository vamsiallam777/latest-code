import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
  userData: {
    name: localStorage.getItem('userName') || null,
    email: localStorage.getItem('userEmail') || null,
    phone: localStorage.getItem('userPhone') || null,
    role: localStorage.getItem('userRole') || null
  },
  isAuthenticated: !!localStorage.getItem('token'),
  role: localStorage.getItem('userRole') || null,
  token: localStorage.getItem('token') || null
};
 
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = {
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
        role: action.payload.role
      };
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userRole', action.payload.role);
      localStorage.setItem('userName', action.payload.name);
      localStorage.setItem('userEmail', action.payload.email);
      localStorage.setItem('userPhone', action.payload.phone);
    },
    clearUser: (state) => {
      state.userData = {
        name: null,
        email: null,
        phone: null,
        role: null
      };
      state.isAuthenticated = false;
      state.role = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
    },
    initializeFromStorage: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
        state.role = localStorage.getItem('userRole');
        state.userData = {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
          phone: localStorage.getItem('userPhone'),
          role: localStorage.getItem('userRole')
        };
      }
    }
  },
});
 
export const { setUser, clearUser, initializeFromStorage } = userSlice.actions;
export const selectUser = (state) => state.user.userData;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectRole = (state) => state.user.role;
 
export default userSlice.reducer;