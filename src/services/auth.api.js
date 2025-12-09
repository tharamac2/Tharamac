import { API_BASE } from '../../constants/ApiConfig';
import { fetchJson } from '../utils/fetchJson';

export async function requestOtp(mobile){
  return await fetchJson(${API_BASE}/auth/request, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile })
  });
}

export async function verifyOtp(mobile, otp){
  return await fetchJson(${API_BASE}/auth/verify, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile, otp })
  });
}
