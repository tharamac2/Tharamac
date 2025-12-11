// src/services/auth.api.js

// Ensure this path matches where your ApiConfig actually is.
// If your alias is set up, you can use '@/constants/ApiConfig'
import { API_BASE } from '../../constants/ApiConfig';

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Registration API Error:", error);
    return { status: 'error', message: 'Network request failed' };
  }
};

export const loginUser = async (phone) => {
  try {
    const response = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Login API Error:", error);
    return { status: 'error', message: 'Network request failed' };
  }
};