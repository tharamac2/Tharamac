import { API_BASE } from '../../constants/ApiConfig';

// Helper function to handle API responses safely
const handleResponse = async (response) => {
    const text = await response.text(); // Get raw response as text
    
    // Log the raw response to debug the "Unexpected character <" error
    console.log("SERVER RESPONSE:", text); 

    try {
        return JSON.parse(text); // Try converting to JSON
    } catch (error) {
        console.error("JSON Parse Error. Server sent HTML/Text instead of JSON.");
        // Return a safe error object so the app doesn't crash
        return { 
            status: 'error', 
            message: 'Server Error: Check console for details. ' + text.substring(0, 50) 
        };
    }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Network request failed:", error);
    return { status: 'error', message: 'Network connection failed' };
  }
};

export const loginUser = async (phone) => {
  try {
    const response = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Login API Error:", error);
    return { status: 'error', message: 'Network connection failed' };
  }
};