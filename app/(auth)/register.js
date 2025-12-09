import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE } from '../../constants/ApiConfig';
import { fetchJson } from '../../src/utils/fetchJson';


export default function RegisterScreen(){
const [name, setName] = useState('');
const [mobile, setMobile] = useState('');
const [email, setEmail] = useState('');
const [busy, setBusy] = useState(false);
const router = useRouter();


async function handleRegister(){
if (!name || !mobile) return Alert.alert('Enter name and mobile');
setBusy(true);
try{
// Call backend register endpoint if available. For API Type 2, registration may happen automatically on verify.
// But we'll call /auth/register if your backend supports it. If not, skip this and call request OTP.
try{
const data = await fetchJson(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ name, mobile, email }) });
Alert.alert('Registered', 'Please verify OTP sent to your mobile');
// navigate to OTP
router.push({ pathname: '/(auth)/otp', params: { mobile } });
}catch(err){
// If register endpoint not available, fall back to requesting OTP (auto-register on verify)
await fetchJson(`${API_BASE}/auth/request`, { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ mobile }) });
Alert.alert('Proceed', 'OTP sent. Complete verification to create account.');
router.push({ pathname: '/(auth)/otp', params: { mobile } });
}
}catch(e){ Alert.alert('Register failed', e?.message || String(e)); }
finally{ setBusy(false); }
}


return (
<View style={styles.container}>
<Text style={styles.title}>Create account</Text>
<TextInput value={name} onChangeText={setName} placeholder='Full name' style={styles.input} />
<TextInput value={mobile} onChangeText={setMobile} placeholder='+91 9876543210' keyboardType='phone-pad' style={styles.input} />
<TextInput value={email} onChangeText={setEmail} placeholder='Email (optional)' keyboardType='email-address' style={styles.input} />
<Button title={busy? 'Please wait...' : 'Register & Send OTP'} onPress={handleRegister} disabled={busy} />
</View>
);
}


const styles = StyleSheet.create({
container:{ flex:1, padding:20, justifyContent:'center' },
title:{ fontSize:22, fontWeight:'700', marginBottom:8 },
input:{ borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:8, marginBottom:12 }
});