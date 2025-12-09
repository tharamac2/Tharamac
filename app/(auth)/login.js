import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';


export default function LoginScreen(){
const [mobile, setMobile] = useState('');
const [busy, setBusy] = useState(false);
const router = useRouter();
const auth = useContext(AuthContext);


async function handleRequest(){
if (!mobile) return Alert.alert('Enter mobile number');
setBusy(true);
try{
await auth.requestOtp(mobile);
// navigate to OTP screen and pass mobile
router.push({ pathname: '/(auth)/otp', params: { mobile } });
}catch(e){
Alert.alert('Request OTP failed', e?.message || String(e));
}finally{ setBusy(false); }
}


return (
<View style={styles.container}>
<Text style={styles.title}>Welcome back</Text>
<Text style={styles.subtitle}>Enter your mobile number to continue</Text>
<TextInput value={mobile} onChangeText={setMobile} placeholder='+91 9876543210' keyboardType='phone-pad' style={styles.input} />
<Button title={busy? 'Please wait...' : 'Send OTP'} onPress={handleRequest} disabled={busy} />
<View style={{height:12}} />
<Button title='Register new account' onPress={()=>router.push('/(auth)/register')} />
</View>
);
}


const styles = StyleSheet.create({
container:{ flex:1, padding:20, justifyContent:'center' },
title:{ fontSize:24, fontWeight:'700', marginBottom:8 },
subtitle:{ fontSize:14, color:'#555', marginBottom:20 },
input:{ borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:8, marginBottom:12 }
});