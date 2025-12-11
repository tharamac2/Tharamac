import { API_BASE } from '../../constants/ApiConfig'; // ✅ FIXED
import { fetchJson } from './fetcher';

export async function requestOtp(mobile) {
  return await fetchJson(`${API_BASE}/auth/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile })
  });
}

export async function verifyOtp(mobile, otp) {
  return await fetchJson(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, otp })
  });
}

export async function login(email, password) {
  return await fetchJson(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export async function logout() {
  return await fetchJson(`${API_BASE}/auth/logout`, {
    method: 'POST'
  });
}
