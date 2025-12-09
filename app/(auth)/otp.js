import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../src/context/AuthContext';


export default function OtpScreen(){
const params = useLocalSearchParams();
const mobileFromParams = params.mobile || '';
const [mobile, setMobile] = useState(mobileFromParams);
const [otp, setOtp] = useState('');
const [busy, setBusy] = useState(false);
const router = useRouter();
const auth = useContext(AuthContext);


useEffect(()=>{ if (mobileFromParams) setMobile(mobileFromParams); }, [mobileFromParams]);


async function handleVerify(){
if (!mobile || !otp) return Alert.alert('Enter mobile and OTP');
setBusy(true);
try{
const res = await auth.verifyOtp(mobile, otp);
if (res && res.token){
// success — go to main app (replace so user can't go back to auth)
router.replace('/');
}else{
Alert.alert('Verify failed', 'Invalid response from server');
}
}catch(e){ Alert.alert('Verify failed', e?.message || String(e)); }
finally{ setBusy(false); }
}


async function resend(){
try{
await auth.requestOtp(mobile);
Alert.alert('OTP resent');
}catch(e){ Alert.alert('Resend failed', e?.message || String(e)); }
}


return (
<View style={styles.container}>
<Text style={styles.title}>Verify OTP</Text>
<Text style={styles.subtitle}>We sent a code to {mobile || 'your mobile'}</Text>
<TextInput value={otp} onChangeText={setOtp} placeholder='Enter OTP' keyboardType='number-pad' style={styles.input} />
<Button title={busy? 'Verifying...' : 'Verify'} onPress={handleVerify} disabled={busy} />
<View style={{height:12}} />
<Button title='Resend OTP' onPress={resend} />
</View>
);
}


const styles = StyleSheet.create({
container:{ flex:1, padding:20, justifyContent:'center' },
title:{ fontSize:22, fontWeight:'700', marginBottom:8 },
subtitle:{ fontSize:14, color:'#555', marginBottom:20 },
input:{ borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:8, marginBottom:12 }
});