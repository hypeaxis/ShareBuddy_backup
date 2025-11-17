/**
 * API service for user operations
 */

import axios from 'axios';

const API_URL = '/api/users';

export const getUserProfile = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/password`, passwordData);
  return response.data;
};

export const getMyDocuments = async () => {
  const response = await axios.get(`${API_URL}/my/documents`);
  return response.data;
};

export const getDownloadHistory = async () => {
  const response = await axios.get(`${API_URL}/my/downloads`);
  return response.data;
};
