import { API_BASE } from '../../constants/ApiConfig';

// ✅ Registration API
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Registration API Error:", error);
    return { status: 'error', message: 'Network request failed' };
  }
};

// ✅ Login API (THIS WAS MISSING)
export const loginUser = async (phone) => {
  try {
    const response = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login API Error:", error);
    return { status: 'error', message: 'Network request failed' };
  }
};