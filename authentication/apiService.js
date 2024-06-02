import axios from 'axios';

const API_URL = 'http://192.168.86.250:5001/api/auth';

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password });
        console.log('Response:', response);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          // Axios error with response data
          throw error.response.data;
        } else {
          // Non-Axios error or response data not available
          throw error; // Throw the original error
        }
      }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // Axios error with response data
      throw error.response.data;
    } else {
      // Non-Axios error or response data not available
      throw error; // Throw the original error
    }
  }
};