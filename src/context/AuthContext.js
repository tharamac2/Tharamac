import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import * as authApi from '../services/auth.api';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  requestOtp: async ()=>{},
  verifyOtp: async ()=>{},
  logout: ()=>{}
});

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ (async ()=>{
    try{
      const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('user');
      if (t){ setToken(t); setUser(u ? JSON.parse(u) : null); }
    }catch(e){ console.warn('Auth load failed', e); }
  })(); }, []);

  async function requestOtp(mobile){
    setLoading(true);
    try{
      const res = await authApi.requestOtp(mobile);
      // backend should respond with success or just accept
      return res;
    }catch(e){ throw e; }
    finally{ setLoading(false); }
  }

  async function verifyOtp(mobile, otp){
    setLoading(true);
    try{
      const res = await authApi.verifyOtp(mobile, otp);
      if (res && res.token){
        setToken(res.token);
        setUser(res.user || null);
        await AsyncStorage.setItem('token', res.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.user || null));
      }
      return res;
    }catch(e){ throw e; }
    finally{ setLoading(false); }
  }

  async function logout(){
    setToken(null); setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, requestOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}